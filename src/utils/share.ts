import { ShareData } from "../types/share"
import { ColorItem, ColorCategory } from "../types/colors"

const categoryToCode = (category: ColorCategory): string => {
  switch (category) {
    case "background": return "b"
    case "text": return "t"
    case "border": return "r"
    case "accent": return "a"
    case "other": return "o"
  }
}

const codeToCategory = (code: string): ColorCategory => {
  switch (code) {
    case "b": return "background"
    case "t": return "text"
    case "r": return "border"
    case "a": return "accent"
    default: return "other"
  }
}

const compressColors = (colors: ColorItem[]): string => {
  return colors.map(color => {
    const hex = color.value.replace("#", "").toLowerCase()
    const cat = categoryToCode(color.category)
    const name = color.name === color.value ? "" : color.name
    return `${hex}${cat}${name}`
  }).join(",")
}

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

export const encodeShareData = (data: ShareData): string => {
  const nameAndFolder = `${data.name}~${data.folderName || ""}`
  const colors = compressColors(data.colors)
  const compressed = `${nameAndFolder};${colors}`
  return btoa(encodeURIComponent(compressed))
}

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