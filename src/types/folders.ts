import { ColorItem } from "./colors"

export type FolderOperationType = {
  autoNameColors: (colors: ColorItem[], folderId: string) => ColorItem[]
  deleteAllColors: (colors: ColorItem[], folderId: string) => ColorItem[]
  selectAllColors: (colors: ColorItem[], folderId: string) => string[]
  areAllColorsSelected: (colors: ColorItem[], folderId: string, selectedColors: string[]) => boolean
  copyFolderColors: (colors: ColorItem[], folderId: string) => string[]
} 