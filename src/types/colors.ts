export type ColorCategory = "background" | "text" | "border" | "accent" | "other"

export type ColorValue = string

export interface ColorItem {
  id: string
  value: ColorValue
  category: ColorCategory
  name: string
  folderId: string | null
}

export interface Folder {
  id: string
  name: string
}

export interface Palette {
  id: string
  name: string
  colors: ColorItem[]
  folders: Folder[]
}

export type CategoryManagerProps = {
  selectedColors: string[]
  onCategoryChange: (colorIds: string[], category: ColorCategory) => void
  onClose: () => void
  colors: ColorItem[]
}

export type ColorCardProps = {
  color: ColorItem
  onDelete: () => void
  onRename: (newName: string) => void
  onDragStart: () => void
  onDragEnd: () => void
  isReordering: boolean
  isSelected: boolean
  onSelect: () => void
} 

export type ColorRange = {
    name: string
    hueRange: [number, number]
    additionalTerms?: string[]
    specialCases?: {
      saturation: [number, number]
      lightness: [number, number]
      name: string
    }[]
}