import { FC, useState } from 'react'
import { X, Pencil, GripVertical, Tag } from 'lucide-react'
import { motion, AnimatePresence, Reorder, useDragControls } from 'framer-motion'
import { ColorCardProps } from '../../types/colors'

const ColorCard: FC<ColorCardProps> = ({
  color,
  onDelete,
  onRename,
  onDragStart,
  onDragEnd,
  isReordering,
  isSelected,
  onSelect,
  selectedColors
}) => {
  const [isRenamingColor, setIsRenamingColor] = useState(false)
  const [colorName, setColorName] = useState(color.name)
  const [isHovered, setIsHovered] = useState(false)
  const dragControls = useDragControls()

  const handleRename = () => {
    if (colorName.trim() !== '') {
      onRename(colorName.trim())
      setIsRenamingColor(false)
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(color.value)
      const event = new CustomEvent('showToast', {
        detail: { message: 'Color copied to clipboard' }
      })
      window.dispatchEvent(event)
    } catch (err) {
      console.error('Failed to copy color:', err)
    }
  }

  return (
    <Reorder.Item
      value={color}
      dragListener={false}
      dragControls={dragControls}
      className="overflow-hidden"
      whileDrag={{ 
        scale: 1.02,
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)",
        zIndex: 1 
      }}
      transition={{
        duration: 0.15,
        ease: "easeInOut"
      }}
    >
      <motion.div 
        className={`flex items-center gap-2 p-2 bg-dark-800/50 rounded-xl border transition-colors ${
          isSelected 
            ? "border-primary-400 bg-primary/5" 
            : "border-dark-700 hover:border-dark-600"
        }`}
        onHoverStart={() => !isReordering && setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onClick={() => !isReordering && onSelect()}
      >
        <div className="flex items-center gap-2 flex-1">
          <motion.div 
            className="text-gray-500 cursor-grab active:cursor-grabbing select-none"
            whileHover={{ color: 'rgba(156, 163, 175, 1)' }}
            onPointerDown={(e) => {
              e.stopPropagation()
              dragControls.start(e)
            }}
          >
            <GripVertical size={14} />
          </motion.div>
          <div 
            className="w-8 h-8 rounded-lg ring-1 ring-dark-800 relative cursor-move"
            style={{ backgroundColor: color.value }}
            draggable
            onDragStart={(e) => {
              e.stopPropagation()
              e.dataTransfer.effectAllowed = "move"
              const colorIds = isSelected ? selectedColors : [color.id]

              const dragPreview = document.createElement("div")
              dragPreview.className = "fixed top-0 left-0 bg-dark-800/95 border border-primary/20 rounded-xl px-3 py-2 text-primary-300 pointer-events-none"
              dragPreview.innerHTML = `Moving ${colorIds.length} color${colorIds.length !== 1 ? "s" : ""}`
              dragPreview.style.position = "absolute"
              dragPreview.style.top = "-1000px"
              document.body.appendChild(dragPreview)
              e.dataTransfer.setDragImage(dragPreview, 0, 0)

              const dragData = {
                type: "colors",
                colorIds
              }
              e.dataTransfer.setData("application/json", JSON.stringify(dragData))
              onDragStart()

              requestAnimationFrame(() => document.body.removeChild(dragPreview))
            }}
            onDragEnd={(e) => {
              e.stopPropagation()
              onDragEnd()
            }}
          >
            <motion.div 
              className="absolute inset-0 rounded-lg bg-gradient-to-b from-black/0 to-black/20"
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered && !isReordering ? 1 : 0 }}
              transition={{ duration: 0.1 }}
            />
          </div>
          <div className="flex-1 min-w-0 select-none">
            <div className="text-sm font-medium text-gray-300 truncate">
              {isRenamingColor ? (
                <input
                  type="text"
                  value={colorName}
                  onChange={(e) => setColorName(e.target.value)}
                  onBlur={handleRename}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleRename()
                    }
                  }}
                  className="w-full bg-transparent border-none text-sm focus:outline-none focus:ring-0 text-left select-text"
                  autoFocus
                  maxLength={24}
                />
              ) : (
                color.name
              )}
            </div>
            <div className="flex items-center gap-2">
              <div className="text-xs text-gray-400 flex items-center gap-1">
                <Tag size={12} />
                <span className="capitalize">{color.category}</span>
              </div>
              <AnimatePresence>
                <motion.div 
                  className="flex items-center gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isHovered && !isReordering ? 1 : 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <div className="w-px h-3 bg-dark-600" />
                  <div 
                    onClick={(e) => {
                      e.stopPropagation()
                      handleCopy()
                    }}
                    className="text-xs text-gray-500 font-mono truncate cursor-pointer hover:text-primary-300 transition-colors"
                  >
                    {color.value}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
        <motion.div 
          className="flex items-center gap-1 shrink-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered && !isReordering ? 1 : 0 }}
          transition={{ duration: 0.15 }}
        >
          <motion.button
            whileHover={{ scale: 1.1, backgroundColor: "rgba(59, 130, 246, 0.2)" }}
            onClick={(e) => {
              e.stopPropagation()
              setIsRenamingColor(true)
              setColorName(color.name)
            }}
            className="w-6 h-6 rounded-lg hover:text-primary-300 text-gray-400 flex items-center justify-center"
          >
            <Pencil size={14} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1, backgroundColor: "rgba(239, 68, 68, 0.2)" }}
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
            className="w-6 h-6 rounded-lg hover:text-red-400 text-gray-400 flex items-center justify-center"
          >
            <X size={14} />
          </motion.button>
        </motion.div>
      </motion.div>
    </Reorder.Item>
  )
}

export default ColorCard 