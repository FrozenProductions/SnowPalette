import { ColorItem } from "../types/colors"
import { FolderOperationType } from "../types/folders"
import { generateColorName } from "./colorNaming"

export const folderOperations: FolderOperationType = {
  autoNameColors: (colors: ColorItem[], folderId: string): ColorItem[] => {
    return colors.map((color: ColorItem): ColorItem => {
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
    return colors.filter((color: ColorItem): boolean => color.folderId !== folderId)
  },

  selectAllColors: (colors: ColorItem[], folderId: string): string[] => {
    return colors
      .filter((color: ColorItem): boolean => color.folderId === folderId)
      .map((color: ColorItem): string => color.id)
  },

  areAllColorsSelected: (colors: ColorItem[], folderId: string, selectedColors: string[]): boolean => {
    const folderColorIds: string[] = colors
      .filter((color: ColorItem): boolean => color.folderId === folderId)
      .map((color: ColorItem): string => color.id)
    
    return folderColorIds.length > 0 && folderColorIds.every((id: string): boolean => selectedColors.includes(id))
  },

  copyFolderColors: (colors: ColorItem[], folderId: string): string[] => {
    return colors
      .filter((color: ColorItem): boolean => color.folderId === folderId)
      .map((color: ColorItem): string => color.value)
  }
} 