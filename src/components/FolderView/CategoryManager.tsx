import { FC } from "react"
import { motion } from "framer-motion"
import { Tag } from "lucide-react"
import { CATEGORIES } from "../../constants/categories"
import { CategoryManagerProps } from "../../types/colors"

const CategoryManager: FC<CategoryManagerProps> = ({
  selectedColors,
  onCategoryChange,
  onClose,
  colors
}) => {
  const selectedColorItems = colors.filter(color => selectedColors.includes(color.id))
  const currentCategories = [...new Set(selectedColorItems.map(color => color.category))]
  const isMultipleCategories = currentCategories.length > 1

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="absolute top-full mt-1 right-0 bg-dark-800 rounded-xl border border-dark-700 shadow-lg p-2 min-w-[180px] z-10"
    >
      {CATEGORIES.map(category => (
        <button
          key={category}
          onClick={() => {
            onCategoryChange(selectedColors, category)
            onClose()
          }}
          className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg transition-colors ${
            !isMultipleCategories && currentCategories[0] === category
              ? "bg-primary/10 text-primary-300"
              : "text-gray-400 hover:text-white hover:bg-dark-700/50"
          }`}
        >
          <Tag size={14} className="shrink-0" />
          <span className="text-sm capitalize">{category}</span>
        </button>
      ))}
    </motion.div>
  )
}

export default CategoryManager 