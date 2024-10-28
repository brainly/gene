export function assign(url: string) {
  if (typeof window !== 'undefined') {
    window.location.assign(url);
  }
}
