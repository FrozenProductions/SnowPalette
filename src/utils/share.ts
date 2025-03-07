import { ShareData } from "../types/share"
import { ColorItem, ColorCategory } from "../types/colors"

/**
 * Converts a color category to a code.
 * @param category - The color category to convert.
 * @returns The code for the color category.
 */
const categoryToCode = (category: ColorCategory): string => {
  switch (category) {
    case "background": return "b"
    case "text": return "t"
    case "border": return "r"
    case "accent": return "a"
    case "other": return "o"
  }
}

/**
 * Converts a code to a color category.
 * @param code - The code to convert.
 * @returns The color category.
 */
const codeToCategory = (code: string): ColorCategory => {
  switch (code) {
    case "b": return "background"
    case "t": return "text"
    case "r": return "border"
    case "a": return "accent"
    default: return "other"
  }
}

/**
 * Compresses colors into a string.
 * @param colors - The colors to compress.
 * @returns The compressed string.
 */
const compressColors = (colors: ColorItem[]): string => {
  return colors.map(color => {
    const hex = color.value.replace("#", "").toLowerCase()
    const cat = categoryToCode(color.category)
    const name = color.name === color.value ? "" : color.name
    return `${hex}${cat}${name}`
  }).join(",")
}

/**
 * Decompresses a string of colors into an array of ColorItem objects.
 * @param str - The string to decompress.
 * @returns The decompressed colors.
 */
const decompressColors = (str: string): ColorItem[] => {
  if (!str) return []
  return str.split(",").map((colorStr, index) => {
    const hex = colorStr.slice(0, 6)
    const cat = colorStr.slice(6, 7)
    const name = colorStr.slice(7) || `#${hex}`
    return {
      id: `imported-${index}`,
      value: `#${hex}`,
      category: codeToCategory(cat),
      name,
      folderId: null
    }
  })
}

/**
 * Encodes share data into a string.
 * @param data - The share data to encode.
 * @returns The encoded string.
 */
export const encodeShareData = (data: ShareData): string => {
  const nameAndFolder = `${data.name}~${data.folderName || ""}`
  const colors = compressColors(data.colors)
  const compressed = `${nameAndFolder};${colors}`
  return btoa(encodeURIComponent(compressed))
}

/**
 * Decodes a share data string into a ShareData object.
 * @param encoded - The encoded string to decode.
 * @returns The decoded share data.
 */
export const decodeShareData = (encoded: string): ShareData | null => {
  try {
    const str = decodeURIComponent(atob(encoded))
    const [nameAndFolder, colorsStr] = str.split(";")
    const [name, folderName] = nameAndFolder.split("~")
    return {
      name,
      folderName: folderName || null,
      colors: decompressColors(colorsStr),
      folder: null
    }
  } catch (err) {
    console.error("Failed to decode share data:", err)
    return null
  }
}