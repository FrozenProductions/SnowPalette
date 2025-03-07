import { FC, useState, useEffect, useRef } from 'react'
import { Folder, Filter, Tag } from 'lucide-react'
import { motion, AnimatePresence, Reorder } from 'framer-motion'
import { ColorItem, ColorCategory, Folder as FolderType } from '../../types/colors'
import { CATEGORIES } from '../../constants/categories'
import { filterColorsByFolder, filterColorsByCategory, reorderColors } from '../../utils/colors'
import ColorCard from './ColorCard'
import ContextMenu from './ContextMenu'
import Toast from '../Toast'
import CategoryManager from "./CategoryManager"
import { useDragControls } from 'framer-motion'

interface FolderViewProps {
  colors: ColorItem[]
  folders: FolderType[]
  paletteId: string
  onUpdateColors: (colors: ColorItem[]) => void
  onUpdateFolderName: (folderId: string, name: string) => void
  onDeleteFolder: (folderId: string) => void
  onDeleteColor: (colorId: string) => void
  onFolderSelect: (folderId: string | null) => void
  selectedFolderId: string | null
  onReorderFolders: (folders: FolderType[]) => void
  onMoveFolders?: (folderIds: string[], targetPaletteId: string) => void
}

const FolderView: FC<FolderViewProps> = ({
  colors,
  folders,
  paletteId,
  onUpdateColors,
  onUpdateFolderName,
  onDeleteFolder,
  onDeleteColor,
  onFolderSelect,
  selectedFolderId,
  onReorderFolders,
  onMoveFolders
}) => {
  const [categoryFilter, setCategoryFilter] = useState<ColorCategory | null>(null)
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; folder: FolderType } | null>(null)
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null)
  const [isCategoryFilterOpen, setIsCategoryFilterOpen] = useState(false)
  const [isReordering, setIsReordering] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const categoryDropdownRef = useRef<HTMLDivElement>(null)
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [showCategoryManager, setShowCategoryManager] = useState(false)
  const categoryManagerRef = useRef<HTMLDivElement>(null)
  const [selectedFolders, setSelectedFolders] = useState<string[]>([])
  const dragControls = useDragControls()

  useEffect(() => {
    setSelectedFolders([])
  }, [folders])

  useEffect(() => {
    setSelectedColors([])
  }, [paletteId])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target as Node)) {
        setIsCategoryFilterOpen(false)
      }
      if (categoryManagerRef.current && !categoryManagerRef.current.contains(event.target as Node)) {
        setShowCategoryManager(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    const handleUpdateCategory = (event: CustomEvent<{ colorId: string; category: ColorCategory }>) => {
      const { colorId, category } = event.detail
      const newColors = colors.map(color => 
        color.id === colorId ? { ...color, category } : color
      )
      onUpdateColors(newColors)
    }

    window.addEventListener('updateCategory', handleUpdateCategory as EventListener)
    return () => window.removeEventListener('updateCategory', handleUpdateCategory as EventListener)
  }, [colors, onUpdateColors])

  useEffect(() => {
    const handleShowToast = (event: CustomEvent<{ message: string }>) => {
      setToastMessage(event.detail.message)
      setShowToast(true)
    }

    window.addEventListener('showToast', handleShowToast as EventListener)
    return () => window.removeEventListener('showToast', handleShowToast as EventListener)
  }, [])

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [showToast])

  const filteredColors = filterColorsByFolder(colors, selectedFolderId)
  const finalFilteredColors = filterColorsByCategory(filteredColors, categoryFilter)

  const handleReorder = (newOrder: ColorItem[]): void => {
    setIsReordering(true)
    const updatedColors = reorderColors(colors, newOrder)
    onUpdateColors(updatedColors)
    setTimeout(() => setIsReordering(false), 200)
  }

  const handleFolderReorder = (newOrder: FolderType[]): void => {
    setIsReordering(true)
    onReorderFolders(newOrder)
    setTimeout(() => setIsReordering(false), 200)
  }

  const handleRenameColor = (colorId: string, newName: string) => {
    const newColors = colors.map(color => 
      color.id === colorId ? { ...color, name: newName } : color
    )
    onUpdateColors(newColors)
  }

  const handleFolderDrop = (folderId: string | null, e: React.DragEvent) => {
    e.preventDefault()
    e.currentTarget.classList.remove("border-primary-400")
    
    try {
      const data = JSON.parse(e.dataTransfer.getData("application/json"))
      if (data.type === "colors") {
        const newColors = colors.map(color => 
          data.colorIds.includes(color.id) ? { ...color, folderId } : color
        )
        onUpdateColors(newColors)
        setIsReordering(false)
        return
      }

      if (data.type === "folders" && data.sourcePaletteId !== paletteId) {
        onMoveFolders?.(data.folderIds, paletteId)
        setTimeout(() => {
          setIsReordering(false)
        }, 300)
      }
    } catch (err) {
      const colorId = e.dataTransfer.getData("text/plain")
      if (colorId) {
        const newColors = colors.map(color => 
          color.id === colorId ? { ...color, folderId } : color
        )
        onUpdateColors(newColors)
        setIsReordering(false)
      }
    }
  }

  const handleColorSelect = (colorId: string) => {
    setSelectedColors(prev => {
      if (prev.includes(colorId)) {
        return prev.filter(id => id !== colorId)
      }
      return [...prev, colorId]
    })
  }

  const handleCategoryChange = (colorIds: string[], category: ColorCategory) => {
    const newColors = colors.map(color => 
      colorIds.includes(color.id) ? { ...color, category } : color
    )
    onUpdateColors(newColors)
    setSelectedColors([])
    setShowCategoryManager(false)
  }

  const handleFolderClick = (folderId: string, e: React.MouseEvent) => {
    if (e.metaKey || e.ctrlKey) {
      setSelectedFolders(prev => {
        const newSelection = prev.includes(folderId)
          ? prev.filter(id => id !== folderId)
          : [...prev, folderId]
        return newSelection
      })
    } else {
      setSelectedFolders([])
      if (editingFolderId !== folderId) {
        onFolderSelect(folderId)
      }
    }
  }

  const handleFolderDragStart = (e: React.DragEvent, folderId: string) => {
    if (selectedFolders.length === 0) {
      e.preventDefault()
      return
    }

    if (!selectedFolders.includes(folderId)) {
      e.preventDefault()
      return
    }

    const dragPreview = document.createElement("div")
    dragPreview.className = "fixed top-0 left-0 bg-dark-800/95 border border-primary/20 rounded-xl px-3 py-2 text-primary-300 pointer-events-none"
    dragPreview.innerHTML = `Moving ${selectedFolders.length} folder${selectedFolders.length !== 1 ? "s" : ""}`
    dragPreview.style.position = "absolute"
    dragPreview.style.top = "-1000px"
    document.body.appendChild(dragPreview)
    e.dataTransfer.setDragImage(dragPreview, 0, 0)

    const dragData = {
      type: "folders",
      folderIds: selectedFolders,
      sourcePaletteId: paletteId
    }
    e.dataTransfer.setData("application/json", JSON.stringify(dragData))
    e.dataTransfer.effectAllowed = "move"

    window.dispatchEvent(new CustomEvent("folderDragStart"))

    requestAnimationFrame(() => document.body.removeChild(dragPreview))
  }

  const handleFolderDragEnd = () => {
    window.dispatchEvent(new CustomEvent("folderDragEnd"))
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 h-full min-h-0">
      <Toast 
        message={toastMessage}
        isVisible={showToast}
        onHide={() => setShowToast(false)}
      />
      <div className="w-56 flex flex-col bg-dark-800/50 rounded-xl border border-dark-700 p-3 overflow-hidden">
        <h4 className="text-sm font-medium text-gray-300 mb-2 flex-shrink-0">Folders</h4>
        <div className="overflow-y-auto flex-1 min-h-0">
          <div className="space-y-1">
            <motion.button
              onClick={() => {
                if (!isReordering) {
                  onFolderSelect(null)
                  setSelectedFolders([])
                }
              }}
              onDragOver={(e) => {
                e.preventDefault()
                e.currentTarget.classList.add("border-primary-400")
              }}
              onDragLeave={(e) => {
                e.currentTarget.classList.remove("border-primary-400")
              }}
              onDrop={(e: React.DragEvent) => handleFolderDrop(null, e)}
              className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl border transition-colors select-none ${
                selectedFolderId === null
                  ? "bg-primary/10 border-primary/20 text-primary-300"
                  : "bg-dark-800/50 border-dark-700 text-gray-400 hover:text-white hover:border-primary/50"
              }`}
              style={{ transform: 'none' }}
              animate={{ scale: 1 }}
            >
              <Folder size={14} className="shrink-0" />
              <span className="text-sm">Unorganized</span>
              <span className="ml-auto text-xs text-gray-400 shrink-0">
                {colors.filter(c => c.folderId === null).length}
              </span>
            </motion.button>

            <Reorder.Group 
              axis="y" 
              values={folders} 
              onReorder={handleFolderReorder}
              className="space-y-1"
            >
              {folders.map((folder) => (
                <Reorder.Item
                  key={folder.id}
                  value={folder}
                  className="touch-none"
                  dragListener={!selectedFolders.length}
                  dragControls={dragControls}
                  layout
                  whileDrag={{ 
                    scale: 1.02,
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)",
                    zIndex: 1 
                  }}
                  transition={{
                    layout: { duration: 0.15, ease: "easeInOut" },
                    default: { duration: 0.15, ease: "easeInOut" }
                  }}
                  onDragStart={() => setIsReordering(true)}
                  onDragEnd={() => {
                    setTimeout(() => setIsReordering(false), 200)
                  }}
                >
                  <div
                    draggable={selectedFolders.length > 0}
                    onDragStart={(e: React.DragEvent) => handleFolderDragStart(e, folder.id)}
                    onDragEnd={handleFolderDragEnd}
                    onClick={(e: React.MouseEvent) => !isReordering && handleFolderClick(folder.id, e)}
                    onContextMenu={(e: React.MouseEvent) => {
                      e.preventDefault()
                      setContextMenu({ x: e.clientX, y: e.clientY, folder })
                    }}
                    onDragOver={(e) => {
                      e.preventDefault()
                      e.currentTarget.classList.add("border-primary-400", "bg-primary/5")
                    }}
                    onDragLeave={(e) => {
                      e.currentTarget.classList.remove("border-primary-400", "bg-primary/5")
                    }}
                    onDrop={(e) => {
                      e.preventDefault()
                      e.currentTarget.classList.remove("border-primary-400", "bg-primary/5")
                      handleFolderDrop(folder.id, e)
                    }}
                    className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl border transition-colors select-none ${
                      selectedFolders.includes(folder.id)
                        ? "bg-primary/20 border-primary/30 text-primary-300 cursor-grab"
                        : selectedFolderId === folder.id
                          ? "bg-primary/10 border-primary/20 text-primary-300 cursor-grab"
                          : "bg-dark-800/50 border-dark-700 text-gray-400 hover:text-white hover:border-primary/50 cursor-grab"
                    }`}
                    style={{ transform: 'none' }}
                  >
                    <Folder size={14} className="shrink-0" />
                    <div className="flex-1 flex items-center gap-2 truncate">
                      {editingFolderId === folder.id ? (
                        <input
                          type="text"
                          defaultValue={folder.name}
                          autoFocus
                          onBlur={(e) => {
                            onUpdateFolderName(folder.id, e.target.value)
                            setEditingFolderId(null)
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              onUpdateFolderName(folder.id, e.currentTarget.value)
                              setEditingFolderId(null)
                            }
                            if (e.key === "Escape") {
                              setEditingFolderId(null)
                            }
                          }}
                          onClick={(e) => e.stopPropagation()}
                          className="flex-1 bg-transparent outline-none text-sm"
                        />
                      ) : (
                        <span className="text-sm truncate">{folder.name}</span>
                      )}
                    </div>
                    <span className="text-xs text-gray-400 shrink-0">
                      {colors.filter(c => c.folderId === folder.id).length}
                    </span>
                  </div>
                </Reorder.Item>
              ))}
            </Reorder.Group>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-dark-800/50 rounded-xl border border-dark-700 p-3 min-h-0 relative">
        <div className="flex-shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 mb-3">
          <div className="flex items-center gap-3 overflow-visible">
            <h4 className="text-sm font-medium text-gray-300 truncate">
              {selectedFolderId === null ? "Unorganized Colors" : `${folders.find((f) => f.id === selectedFolderId)?.name}`}
            </h4>
            <div className="hidden sm:block h-4 w-px bg-dark-600" />
            <div className="relative flex-shrink-0" ref={categoryDropdownRef}>
              <button
                onClick={() => setIsCategoryFilterOpen(prev => !prev)}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl border transition-colors ${
                  categoryFilter !== null
                    ? "bg-primary/10 border-primary/20 text-primary-300"
                    : "bg-dark-800/50 border-dark-700 text-gray-400 hover:text-white hover:border-primary/50"
                }`}
              >
                <Filter size={14} className="shrink-0" />
                <span className="text-sm">
                  {categoryFilter === null ? "All Categories" : categoryFilter}
                </span>
              </button>

              <AnimatePresence>
                {isCategoryFilterOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full mt-1 right-0 bg-dark-800 rounded-xl border border-dark-700 shadow-lg p-2 min-w-[180px] z-10"
                  >
                    <button
                      onClick={() => {
                        setCategoryFilter(null)
                        setIsCategoryFilterOpen(false)
                      }}
                      className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg transition-colors ${
                        categoryFilter === null
                          ? "bg-primary/10 text-primary-300"
                          : "text-gray-400 hover:text-white hover:bg-dark-700/50"
                      }`}
                    >
                      <Filter size={14} className="shrink-0" />
                      <span className="text-sm">All Categories</span>
                    </button>
                    {CATEGORIES.map((category) => (
                      <button
                        key={category}
                        onClick={() => {
                          setCategoryFilter(category)
                          setIsCategoryFilterOpen(false)
                        }}
                        className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg transition-colors ${
                          categoryFilter === category
                            ? "bg-primary/10 text-primary-300"
                            : "text-gray-400 hover:text-white hover:bg-dark-700/50"
                        }`}
                      >
                        <Filter size={14} className="shrink-0" />
                        <span className="text-sm capitalize">{category}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {selectedColors.length > 0 && (
              <div className="relative" ref={categoryManagerRef}>
                <button
                  onClick={() => setShowCategoryManager(prev => !prev)}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-primary/20 bg-primary/10 text-primary-300 hover:bg-primary/20 transition-colors"
                >
                  <Tag size={14} />
                  <span className="text-sm">Set Category ({selectedColors.length})</span>
                </button>

                <AnimatePresence>
                  {showCategoryManager && (
                    <CategoryManager
                      selectedColors={selectedColors}
                      onCategoryChange={handleCategoryChange}
                      onClose={() => setShowCategoryManager(false)}
                      colors={colors}
                    />
                  )}
                </AnimatePresence>
              </div>
            )}
            <div className="text-sm text-gray-400">{finalFilteredColors.length} colors</div>
          </div>
        </div>

        <div className="relative flex-1 min-h-0 overflow-y-auto">
          <Reorder.Group
            axis="y"
            values={finalFilteredColors}
            onReorder={handleReorder}
            className="space-y-2"
          >
            {finalFilteredColors.map((color) => (
              <ColorCard
                key={color.id}
                color={color}
                onDelete={() => onDeleteColor(color.id)}
                onRename={(newName) => handleRenameColor(color.id, newName)}
                onDragStart={() => setIsReordering(true)}
                onDragEnd={() => setTimeout(() => setIsReordering(false), 200)}
                isReordering={isReordering}
                isSelected={selectedColors.includes(color.id)}
                onSelect={() => handleColorSelect(color.id)}
                selectedColors={selectedColors}
              />
            ))}
          </Reorder.Group>
        </div>
      </div>

      <AnimatePresence>
        {contextMenu && (
          <ContextMenu
            x={contextMenu.x}
            y={contextMenu.y}
            folder={contextMenu.folder}
            paletteId={paletteId}
            colors={colors}
            onClose={() => setContextMenu(null)}
            onRename={() => {
              setEditingFolderId(contextMenu.folder.id)
              setContextMenu(null)
            }}
            onDelete={() => {
              onDeleteFolder(contextMenu.folder.id)
              setContextMenu(null)
            }}
            onUpdateColors={onUpdateColors}
            onSelectColors={setSelectedColors}
            selectedColors={selectedColors}
            categoryFilter={categoryFilter}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default FolderView 