export type ColorCategory = 'background' | 'text' | 'border' | 'accent' | 'other'

export type GradientValue = {
  type: 'gradient'
  colors: string[]
  angle: number
}

export type ColorValue = string | GradientValue

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