export function normalizeInput(value: string): string {
  return value.trim();
}

export function hasContent(value: string): boolean {
  return normalizeInput(value).length > 0;
}
