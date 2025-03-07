import { ColorItem } from "../types/colors"
import { FolderOperationType } from "../types/folders"
import { generateColorName } from "./colorNaming"

export const folderOperations: FolderOperationType = {
  /**
   * Auto-names colors in a folder.
   * @param colors - The colors to name.
   * @param folderId - The ID of the folder to name the colors in.
   * @returns The named colors.
   */
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

  /**
   * Deletes all colors in a folder.
   * @param colors - The colors to delete.
   * @param folderId - The ID of the folder to delete the colors from.
   * @returns The deleted colors.
   */
  deleteAllColors: (colors: ColorItem[], folderId: string): ColorItem[] => {
    return colors.filter((color: ColorItem): boolean => color.folderId !== folderId)
  },

  /**
   * Selects all colors in a folder.
   * @param colors - The colors to select.
   * @param folderId - The ID of the folder to select the colors from.
   * @returns The selected colors.
   */
  selectAllColors: (colors: ColorItem[], folderId: string): string[] => {
    return colors
      .filter((color: ColorItem): boolean => color.folderId === folderId)
      .map((color: ColorItem): string => color.id)
  },

  /**
   * Checks if all colors in a folder are selected.
   * @param colors - The colors to check.
   * @param folderId - The ID of the folder to check the colors in.
   * @param selectedColors - The selected colors.
   * @returns Whether all colors in the folder are selected.
   */
  areAllColorsSelected: (colors: ColorItem[], folderId: string, selectedColors: string[]): boolean => {
    const folderColorIds: string[] = colors
      .filter((color: ColorItem): boolean => color.folderId === folderId)
      .map((color: ColorItem): string => color.id)
    
    return folderColorIds.length > 0 && folderColorIds.every((id: string): boolean => selectedColors.includes(id))
  },

  /**
   * Copies all colors in a folder.
   * @param colors - The colors to copy.
   * @param folderId - The ID of the folder to copy the colors from.
   * @returns The copied colors.
   */
  copyFolderColors: (colors: ColorItem[], folderId: string): string[] => {
    return colors
      .filter((color: ColorItem): boolean => color.folderId === folderId)
      .map((color: ColorItem): string => color.value)
  }
} 