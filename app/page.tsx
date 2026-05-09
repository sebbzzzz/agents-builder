import { CategoryHeader } from "@/app/_components/category/CategoryHeader"
import { GhostCode } from "@/app/_components/splash/GhostCode"
import { Hero } from "@/app/_components/splash/Hero"
import { LineGutter } from "@/app/_components/splash/LineGutter"

export default function Home() {
  return (
    <>
      <CategoryHeader />

      <div className="flex flex-1 overflow-hidden">
        <LineGutter count={30} className="hidden md:flex" />

        <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden">
          <GhostCode />
          <Hero />
        </div>
      </div>
    </>
  )
}
