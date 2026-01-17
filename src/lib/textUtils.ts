/**
 * Capitalise la première lettre d'un texte
 * @param text - Le texte à capitaliser
 * @returns Le texte avec la première lettre en majuscule
 */
export const capitalizeFirst = (text: string): string => {
  if (!text || text.length === 0) return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
};

/**
 * Capitalise la première lettre de chaque phrase (après . ! ?)
 * @param text - Le texte à capitaliser
 * @returns Le texte avec chaque phrase capitalisée
 */
export const capitalizeSentences = (text: string): string => {
  if (!text || text.length === 0) return text;
  
  return text.replace(/(^|[.!?]\s+)([a-z])/g, (match, prefix, letter) => {
    return prefix + letter.toUpperCase();
  });
};