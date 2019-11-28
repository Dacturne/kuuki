export function isTrailingSlash(s: string): boolean {
  return s && s.substr(-1) === "/";
}
