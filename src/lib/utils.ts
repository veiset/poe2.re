import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


function formatKey(key: string): string {
  const formatted = key
    .replace(/([A-Z])/g, ' $1') // Add space before capital letters
    .toLowerCase()              // Convert everything to lowercase
    .trim();                    // Clean up any leading/trailing spaces

  // Capitalize the very first letter of the final string
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getSelectedPropertiesFromObject(settings: any): string[] {
  const selectedProperties: string[] = [];

  // Helper function to recursively traverse the object
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function traverse(obj: any) {
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const value = obj[key];

        if (typeof value === 'boolean' && value) {
          selectedProperties.push(formatKey(key));
        } else if (typeof value === 'number' && value > 0) {
          selectedProperties.push(formatKey(key));
        } else if (typeof value === 'object' && value !== null) {
          // If the property is a nested object (like itemClass, itemMods, etc.), dig deeper
          // Skipping resultSettings assuming it's configuration and not a selectable property list
          if (key !== 'resultSettings') {
            traverse(value);
          }
        }
      }
    }
  }

  traverse(settings);
  return selectedProperties;
}