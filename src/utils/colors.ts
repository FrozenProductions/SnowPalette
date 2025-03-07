import { ColorItem } from '../types/colors'

/**
 * Filters colors by folder.
 * @param colors - The colors to filter.
 * @param selectedFolder - The folder to filter by.
 * @returns The filtered colors.
 */
const filterColorsByFolder = (colors: ColorItem[], selectedFolder: string | null): ColorItem[] => {
  if (selectedFolder === null) {
    return colors.filter(color => color.folderId === null)
  }
  return colors.filter(color => color.folderId === selectedFolder)
}

/**
 * Filters colors by category.
 * @param colors - The colors to filter.
 * @param categoryFilter - The category to filter by.
 * @returns The filtered colors.
 */
const filterColorsByCategory = (colors: ColorItem[], categoryFilter: string | null): ColorItem[] => {
  if (!categoryFilter) return colors
  return colors.filter(color => color.category === categoryFilter)
}

/**
 * Reorders colors.
 * @param colors - The colors to reorder.
 * @param newOrder - The new order of the colors.
 * @returns The reordered colors.
 */
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