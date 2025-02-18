import { ColorItem } from "../types/colors"
import { generateColorName } from "./colorNaming"

type FolderOperationType = {
  autoNameColors: (colors: ColorItem[], folderId: string) => ColorItem[]
  deleteAllColors: (colors: ColorItem[], folderId: string) => ColorItem[]
  selectAllColors: (colors: ColorItem[], folderId: string) => string[]
  areAllColorsSelected: (colors: ColorItem[], folderId: string, selectedColors: string[]) => boolean
}

export const folderOperations: FolderOperationType = {
  autoNameColors: (colors: ColorItem[], folderId: string): ColorItem[] => {
    return colors.map((color) => {
      if (color.folderId === folderId) {
        return {
          ...color,
          name: generateColorName(color.value)
        }
      }
      return color
    })
  },

  deleteAllColors: (colors: ColorItem[], folderId: string): ColorItem[] => {
    return colors.filter((color) => color.folderId !== folderId)
  },

  selectAllColors: (colors: ColorItem[], folderId: string): string[] => {
    return colors
      .filter((color) => color.folderId === folderId)
      .map((color) => color.id)
  },

  areAllColorsSelected: (colors: ColorItem[], folderId: string, selectedColors: string[]): boolean => {
    const folderColorIds = colors
      .filter((color) => color.folderId === folderId)
      .map((color) => color.id)
    
    return folderColorIds.length > 0 && folderColorIds.every((id) => selectedColors.includes(id))
  }
} 