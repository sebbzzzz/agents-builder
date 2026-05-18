export function LogoMark({ size = 14 }: { size?: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src="/logo.svg" alt="groundwork logo" width={size} height={size} aria-hidden="true" />
  )
}
