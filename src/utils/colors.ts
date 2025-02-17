import { ColorItem } from '../types/colors'

const filterColorsByFolder = (colors: ColorItem[], selectedFolder: string | null): ColorItem[] => {
  if (selectedFolder === null) {
    return colors.filter(color => color.folderId === null)
  }
  return colors.filter(color => color.folderId === selectedFolder)
}

const filterColorsByCategory = (colors: ColorItem[], categoryFilter: string | null): ColorItem[] => {
  if (!categoryFilter) return colors
  return colors.filter(color => color.category === categoryFilter)
}

const reorderColors = (colors: ColorItem[], newOrder: ColorItem[]): ColorItem[] => {
  const updatedColors = [...colors]
  const reorderedIds = newOrder.map(item => item.id)
  const startIndex = updatedColors.findIndex(color => color.id === reorderedIds[0])
  
  newOrder.forEach((item, index) => {
    const currentIndex = updatedColors.findIndex(color => color.id === item.id)
    if (currentIndex !== -1) {
      updatedColors.splice(currentIndex, 1)
      updatedColors.splice(startIndex + index, 0, item)
    }
  })
  
  return updatedColors
}

export { filterColorsByFolder, filterColorsByCategory, reorderColors } 