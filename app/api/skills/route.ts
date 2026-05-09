import { STATIC_SKILLS } from "@/data/skills-fallback"

interface SkillsApiSkill {
  id: string
  source: string
  slug: string
  installs: number
}

interface SkillsApiResponse {
  skills?: SkillsApiSkill[]
  data?: SkillsApiSkill[]
}

const BASE_ENDPOINT = "https://skills.sh/api/v1/skills"
const CURATED_ENDPOINT = `${BASE_ENDPOINT}/curated`

function formatInstalls(count: number): string {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K`
  return String(count)
}

function normalize(skills: SkillsApiSkill[]) {
  return skills.map((s) => ({
    id: s.slug,
    label: s.slug,
    owner: s.source.split("/")[0] ?? s.source,
    installs: formatInstalls(s.installs),
    prompt: `npx skills add ${s.source}/${s.slug}`,
  }))
}

async function fetchSkills(
  endpoint: string,
  apiKey: string | null,
): Promise<SkillsApiSkill[] | null> {
  const res = await fetch(endpoint, {
    headers: { Authorization: `Bearer ${apiKey}` },
    next: { revalidate: 3600 },
  })
  if (!res.ok) return null
  const data: SkillsApiResponse = await res.json()
  return data.skills ?? data.data ?? null
}

export async function GET() {
  try {
    const apiKey = process.env.SKILLS_API_KEY || null

    const [curated, leaderboard] = await Promise.all([
      fetchSkills(CURATED_ENDPOINT, apiKey),
      fetchSkills(`${BASE_ENDPOINT}?per_page=100&view=all-time`, apiKey),
    ])

    if (curated && curated.length >= 15) return Response.json(normalize(curated))
    if (leaderboard && leaderboard.length > 0) return Response.json(normalize(leaderboard))
    return Response.json(STATIC_SKILLS)
  } catch (error) {
    console.error("Error fetching skills:", error)
    return Response.json(STATIC_SKILLS)
  }
}
