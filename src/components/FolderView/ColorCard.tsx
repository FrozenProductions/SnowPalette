import { FC, useState, useRef, useEffect } from 'react'
import { X, Pencil, GripVertical, Tag } from 'lucide-react'
import { Reorder, useDragControls } from 'framer-motion'
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
  const [isDragging, setIsDragging] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const dragControls = useDragControls()
  
  useEffect(() => {
    if (!isReordering && cardRef.current) {
      cardRef.current.style.transform = 'none'
      cardRef.current.style.transition = 'none'
    }
  }, [isReordering])

  const handleRename = (): void => {
    if (colorName.trim() !== '') {
      onRename(colorName.trim())
      setIsRenamingColor(false)
    }
  }

  const handleCopy = async (): Promise<void> => {
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
      className="touch-none overflow-hidden"
      whileDrag={{ 
        scale: 1.02,
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)",
        zIndex: 1 
      }}
      layout
      transition={{
        layout: { duration: 0.15, ease: "easeInOut" },
        default: { duration: 0.15, ease: "easeInOut" }
      }}
      onDragStart={() => {
        setIsDragging(true)
        onDragStart()
      }}
      onDragEnd={() => {
        setTimeout(() => setIsDragging(false), 100)
        onDragEnd()
        
        if (cardRef.current) {
          cardRef.current.style.transform = 'none'
        }
      }}
    >
      <div 
        ref={cardRef}
        className={`flex items-center gap-2 p-2 bg-dark-800/50 rounded-xl border transition-colors ${
          isSelected 
            ? "border-primary-400 bg-primary/5" 
            : "border-dark-700 hover:border-dark-600"
        }`}
        onMouseEnter={() => !isReordering && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => !isReordering && !isDragging && onSelect()}
        style={{ transform: 'none' }}
      >
        <div className="flex items-center gap-2 flex-1">
          <div 
            className="text-gray-500 cursor-grab active:cursor-grabbing select-none h-full flex items-center ml-1"
            onPointerDown={(e) => {
              e.stopPropagation()
              setIsHovered(false)
              setIsDragging(true)
              dragControls.start(e)
            }}
            onPointerUp={() => {
              setTimeout(() => setIsDragging(false), 0)
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <GripVertical size={16} strokeWidth={1.75} />
          </div>
          <div 
            className="w-8 h-8 rounded-lg ring-1 ring-dark-800 relative cursor-move"
            style={{ backgroundColor: color.value }}
            draggable
            onDragStart={(e) => {
              e.stopPropagation()
              setIsDragging(true)
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
              setTimeout(() => setIsDragging(false), 0)
              onDragEnd()
            }}
          >
            {isHovered && !isReordering && (
              <div className="absolute inset-0 rounded-lg bg-gradient-to-b from-black/0 to-black/20" />
            )}
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
              {isHovered && !isReordering && (
                <div className="flex items-center gap-2">
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
                </div>
              )}
            </div>
          </div>
        </div>
        {isHovered && !isReordering && (
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={(e) => {
                e.stopPropagation()
                setIsRenamingColor(true)
                setColorName(color.name)
              }}
              className="w-6 h-6 rounded-lg hover:text-primary-300 hover:bg-primary-400/20 text-gray-400 flex items-center justify-center transition-colors"
            >
              <Pencil size={14} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onDelete()
              }}
              className="w-6 h-6 rounded-lg hover:text-red-400 hover:bg-red-400/20 text-gray-400 flex items-center justify-center transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        )}
      </div>
    </Reorder.Item>
  )
}

export default ColorCard 