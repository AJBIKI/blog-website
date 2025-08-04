/**
 * Converts a string into a URL-friendly, lowercase, kebab-case slug.
 * This function handles diacritics, removes special characters, and collapses whitespace.
 * @param title - The string to be converted into a slug.
 * @returns A URL-safe slug string.
 */
export function slugify(title: string): string {
  // FIX: Added a guard clause to handle null, undefined, or empty strings gracefully.
  if (!title) {
    return '';
  }

  const a = 'àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;'
  const b = 'aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------'
  const p = new RegExp(a.split('').join('|'), 'g')

  return title
    .toString()
    .toLowerCase()
    // Replace special characters with their simple Latin equivalents.
    .replace(p, c => b.charAt(a.indexOf(c))) 
    // Replace characters that are not letters, numbers, or hyphens with a hyphen.
    .replace(/&/g, '-and-') 
    .replace(/[^a-z0-9-]+/g, '-') 
    // Collapse consecutive hyphens into a single hyphen.
    .replace(/-+/g, '-') 
    // Trim leading and trailing hyphens.
    .replace(/^-+/, '') 
    .replace(/-+$/, '') 
}
