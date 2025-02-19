import { FC, useRef, useEffect, useState } from 'react'
import { Plus, X, MoreVertical, Palette as PaletteIcon, GripVertical } from 'lucide-react'
import { Palette, PaletteReorderEvent } from '../../types/colors'
import { motion, AnimatePresence, Reorder, useDragControls } from 'framer-motion'

interface PaletteListProps {
  palettes: Palette[]
  currentPalette: Palette | null
  showSidebar: boolean
  onNewPalette: () => void
  onSelectPalette: (palette: Palette) => void
  onDeletePalette: (paletteId: string) => void
  onToggleSidebar: () => void
  onMoveFolders?: (folderIds: string[], targetPaletteId: string) => void
  onReorderPalettes?: (event: PaletteReorderEvent) => void
}

const PaletteList: FC<PaletteListProps> = ({
  palettes,
  currentPalette,
  showSidebar,
  onNewPalette,
  onSelectPalette,
  onDeletePalette,
  onToggleSidebar,
  onMoveFolders,
  onReorderPalettes
}) => {
  const sidebarRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [isDraggingFolders, setIsDraggingFolders] = useState(false)
  const [orderedPalettes, setOrderedPalettes] = useState(palettes)

  useEffect(() => {
    setOrderedPalettes(palettes)
  }, [palettes])

  useEffect(() => {
    const handleFolderDragStart = () => {
      setIsDraggingFolders(true)
      onToggleSidebar()
    }

    const handleFolderDragEnd = () => {
      setIsDraggingFolders(false)
    }

    window.addEventListener("folderDragStart", handleFolderDragStart)
    window.addEventListener("folderDragEnd", handleFolderDragEnd)

    return () => {
      window.removeEventListener("folderDragStart", handleFolderDragStart)
      window.removeEventListener("folderDragEnd", handleFolderDragEnd)
    }
  }, [onToggleSidebar])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isDraggingFolders) return

      if (event.altKey || event.metaKey || event.ctrlKey) return

      if (
        showSidebar &&
        sidebarRef.current &&
        buttonRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        onToggleSidebar()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [showSidebar, onToggleSidebar, isDraggingFolders])

  const handleDrop = (e: React.DragEvent, targetPaletteId: string) => {
    e.preventDefault()
    e.currentTarget.classList.remove("border-primary-400", "bg-primary/10", "bg-primary/5")

    try {
      const data = JSON.parse(e.dataTransfer.getData("application/json"))
      if (data.type === "folders" && data.sourcePaletteId !== targetPaletteId) {
        onMoveFolders?.(data.folderIds, targetPaletteId)
        setTimeout(() => {
          setIsDraggingFolders(false)
          onToggleSidebar()
        }, 300)
      }
    } catch (err) {
      console.error("Failed to parse drag data:", err)
    }
  }

  const handleReorder = (newOrder: Palette[]) => {
    setOrderedPalettes(newOrder)
    const sourceIndex = palettes.findIndex(p => p.id === newOrder[0].id)
    const destinationIndex = 0
    
    if (sourceIndex !== destinationIndex) {
      onReorderPalettes?.({
        sourceIndex,
        destinationIndex
      })
    }
  }

  return (
    <div className="fixed top-1/2 -translate-y-1/2 right-6 flex items-center">
      <button
        ref={buttonRef}
        onClick={onToggleSidebar}
        className="p-1.5 bg-dark-800/95 backdrop-blur-sm border border-dark-700 rounded-full text-gray-400 hover:text-white hover:border-primary/50 transition-colors"
      >
        <MoreVertical size={16} />
      </button>
      
      <AnimatePresence>
        {showSidebar && (
          <motion.div 
            ref={sidebarRef}
            initial={{ opacity: 0, x: 20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 bg-dark-800/95 backdrop-blur-sm border border-dark-700 rounded-xl overflow-hidden shadow-xl"
          >
            <div 
              className="flex flex-col min-w-[180px]"
              onDragOver={(e) => {
                e.preventDefault()
                if (!currentPalette) return
                e.currentTarget.classList.add("border-primary-400", "bg-primary/5")
              }}
              onDragLeave={(e) => {
                const rect = e.currentTarget.getBoundingClientRect()
                const isLeaving = 
                  e.clientX < rect.left ||
                  e.clientX >= rect.right ||
                  e.clientY < rect.top ||
                  e.clientY >= rect.bottom
                if (isLeaving) {
                  e.currentTarget.classList.remove("border-primary-400", "bg-primary/5")
                }
              }}
              onDrop={(e) => {
                e.preventDefault()
                e.currentTarget.classList.remove("border-primary-400", "bg-primary/5")
                if (!currentPalette) return
                handleDrop(e, currentPalette.id)
              }}
            >
              <div className="p-2.5 flex items-center justify-between border-b border-dark-700">
                <div className="flex items-center gap-2">
                  <PaletteIcon size={14} className="text-primary-300" />
                  <span className="text-sm font-medium text-gray-300">Palettes</span>
                </div>
                <button
                  onClick={onNewPalette}
                  className="p-1 rounded-lg hover:bg-primary/10 text-gray-400 hover:text-primary-300 transition-colors"
                >
                  <Plus size={14} />
                </button>
              </div>
              <Reorder.Group 
                axis="y" 
                values={orderedPalettes} 
                onReorder={handleReorder}
                className="p-1.5 max-h-[calc(100vh-24rem)] overflow-y-auto space-y-0.5"
              >
                <AnimatePresence>
                  {orderedPalettes.map((palette) => (
                    <Reorder.Item
                      key={palette.id}
                      value={palette}
                      className={`group w-full px-3 py-1.5 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                        currentPalette?.id === palette.id
                          ? "bg-primary/10 text-primary-300 shadow-sm"
                          : "text-gray-400 hover:text-white hover:bg-dark-700/30"
                      }`}
                      whileHover={{ x: 2 }}
                      whileDrag={{ 
                        scale: 1.02,
                        boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
                        cursor: "grabbing"
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      <div 
                        className="cursor-grab active:cursor-grabbing p-1 -ml-2 text-gray-500 hover:text-gray-300"
                      >
                        <GripVertical size={14} />
                      </div>
                      <button
                        onClick={() => onSelectPalette(palette)}
                        className="flex-1 text-left truncate"
                      >
                        {palette.name}
                      </button>
                      <motion.div
                        onClick={(e) => {
                          e.stopPropagation()
                          onDeletePalette(palette.id)
                        }}
                        className="w-5 h-5 -mr-1 rounded-md hover:bg-dark-700/50 text-gray-500 hover:text-gray-300 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer"
                        whileHover={{ scale: 1.1 }}
                      >
                        <X size={12} />
                      </motion.div>
                    </Reorder.Item>
                  ))}
                </AnimatePresence>
              </Reorder.Group>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default PaletteList 