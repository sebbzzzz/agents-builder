import { ImageResponse } from "next/og"

export const size = { width: 32, height: 32 }
export const contentType = "image/png"

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: 32,
        height: 32,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "oklch(0.16 0.008 60)",
      }}
    >
      <svg width="22" height="22" viewBox="0 0 14 14" fill="none">
        <rect
          x="0.75"
          y="0.75"
          width="12.5"
          height="12.5"
          rx="1.5"
          stroke="#FF781D"
          strokeWidth="1.5"
        />
        <rect x="3" y="3" width="8" height="8" rx="0.75" fill="rgba(255,120,29,0.25)" />
      </svg>
    </div>,
    { ...size },
  )
}
