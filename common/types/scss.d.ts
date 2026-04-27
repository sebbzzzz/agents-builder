// Allow TypeScript to resolve .scss files imported as side-effects
declare module "*.scss" {
  const content: Record<string, string>
  export default content
}
