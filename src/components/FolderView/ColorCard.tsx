import { FC, useState } from 'react'
import { X, Pencil, GripVertical } from 'lucide-react'
import { motion, AnimatePresence, Reorder, useDragControls } from 'framer-motion'
import { ColorItem, ColorCategory, GradientValue } from '../../types/colors'
import { CATEGORIES } from '../../constants/categories'

interface ColorCardProps {
  color: ColorItem
  onDelete: () => void
  onRename: (newName: string) => void
  onDragStart: () => void
  onDragEnd: () => void
  isReordering: boolean
}

const ColorCard: FC<ColorCardProps> = ({ color, onDelete, onRename, onDragStart, onDragEnd, isReordering }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [isRenamingColor, setIsRenamingColor] = useState(false)
  const [colorName, setColorName] = useState(color.name)
  const [isHovered, setIsHovered] = useState(false)
  const dragControls = useDragControls()

  const isGradient = typeof color.value === 'object' && 'type' in color.value && color.value.type === 'gradient'
  const colorStyle = isGradient
    ? {
        backgroundImage: `linear-gradient(${(color.value as GradientValue).angle}deg, ${(color.value as GradientValue).colors.join(', ')})`,
      }
    : { backgroundColor: color.value as string }

  const getDisplayValue = () => {
    if (isGradient) {
      const gradient = color.value as GradientValue
      return `${gradient.colors.join(', ')} ${gradient.angle}°`
    }
    return color.value as string
  }

  const getCopyValue = () => {
    if (isGradient) {
      const gradient = color.value as GradientValue
      return `linear-gradient(${gradient.angle}deg, ${gradient.colors.join(', ')})`
    }
    return color.value as string
  }

  const handleRename = () => {
    if (colorName.trim() !== '') {
      onRename(colorName.trim())
      setIsRenamingColor(false)
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getCopyValue())
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
        className="flex items-center gap-2 p-2 bg-dark-800/50 rounded-xl border border-dark-700"
        onHoverStart={() => !isReordering && setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
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
            <GripVertical size={16} />
          </motion.div>
          <div 
            className="w-8 h-8 rounded-lg ring-1 ring-dark-800 relative cursor-move"
            style={colorStyle}
            draggable
            onDragStart={(e) => {
              e.stopPropagation()
              e.dataTransfer.effectAllowed = 'move'
              e.dataTransfer.setData('text/plain', color.id)
              onDragStart()
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
              <motion.div 
                onClick={() => !isReordering && setIsEditing(true)}
                className="text-xs text-gray-400 cursor-pointer flex items-center gap-1 truncate"
                whileHover={{ color: !isReordering ? 'rgb(147, 197, 253)' : 'rgb(156, 163, 175)' }}
              >
                <AnimatePresence mode="wait">
                  {isEditing ? (
                    <motion.select
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      value={color.category}
                      onChange={(e) => {
                        const newCategory = e.target.value as ColorCategory
                        const event = new CustomEvent('updateCategory', {
                          detail: { colorId: color.id, category: newCategory }
                        })
                        window.dispatchEvent(event)
                        setIsEditing(false)
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="py-0.5 px-1 text-xs bg-dark-700 rounded-lg border border-dark-600 text-gray-300 focus:outline-none focus:border-primary/50 select-text"
                      autoFocus
                      onBlur={() => setIsEditing(false)}
                    >
                      {CATEGORIES.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </motion.select>
                  ) : (
                    <motion.span
                      initial={false}
                      animate={{ textDecoration: isHovered && !isReordering ? 'underline' : 'none' }}
                    >
                      {color.category}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
              <AnimatePresence>
                <motion.div 
                  className="flex items-center gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isHovered && !isReordering ? 1 : 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <div className="w-px h-3 bg-dark-600" />
                  <div 
                    onClick={handleCopy}
                    className="text-xs text-gray-500 font-mono truncate cursor-pointer hover:text-primary-300 transition-colors"
                  >
                    {getDisplayValue()}
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
            onClick={() => {
              setIsRenamingColor(true)
              setColorName(color.name)
            }}
            className="w-6 h-6 rounded-lg hover:text-primary-300 text-gray-400 flex items-center justify-center"
          >
            <Pencil size={14} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1, backgroundColor: "rgba(239, 68, 68, 0.2)" }}
            onClick={onDelete}
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