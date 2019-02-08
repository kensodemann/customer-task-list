export function byName(c1: { name: string }, c2: { name: string }): number {
  if (c1.name.toLowerCase() < c2.name.toLowerCase()) {
    return -1;
  }
  if (c1.name.toLowerCase() > c2.name.toLowerCase()) {
    return 1;
  }
  return 0;
}
