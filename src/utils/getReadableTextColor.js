/**
 * Determines whether white or black text is more readable on a given background color
 * @param {string} bgColor - Background color in hex format (e.g., "#ff0000" or "ff0000")
 * @returns {string} - Either "white" or "black"
 */
export function getReadableTextColor(bgColor) {
  if (!bgColor) return 'black';
  
  // Remove # if present
  const hex = bgColor.replace('#', '');
  
  // Convert to RGB
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  // Calculate luminance using standard formula
  // Values are normalized to 0-1 range and adjusted for human eye sensitivity
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Return white text for dark backgrounds, black for light backgrounds
  return luminance > 0.5 ? 'black' : 'white';
}