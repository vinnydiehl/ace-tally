/**
 * Generates the absolute path for a file in the `public/` directory.
 */
export function publicUrl(url: string): string {
  return `${import.meta.env.BASE_URL}${url}`;
}
