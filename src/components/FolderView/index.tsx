import { FC, useState, useEffect, useRef } from 'react'
import { Folder, Filter } from 'lucide-react'
import { motion, AnimatePresence, Reorder } from 'framer-motion'
import { ColorItem, ColorCategory, Folder as FolderType } from '../../types/colors'
import { CATEGORIES } from '../../constants/categories'
import { filterColorsByFolder, filterColorsByCategory, reorderColors } from '../../utils/colors'
import ColorCard from './ColorCard'
import ContextMenu from './ContextMenu'
import Toast from '../Toast'

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
  selectedFolderId
}) => {
  const [categoryFilter, setCategoryFilter] = useState<ColorCategory | null>(null)
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; folder: FolderType } | null>(null)
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null)
  const [isCategoryFilterOpen, setIsCategoryFilterOpen] = useState(false)
  const [isFolderListVisible, setIsFolderListVisible] = useState(true)
  const [isReordering, setIsReordering] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const categoryDropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleResize = () => {
      setIsFolderListVisible(window.innerWidth > 640)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target as Node)) {
        setIsCategoryFilterOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
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

  const handleReorder = (newOrder: ColorItem[]) => {
    const updatedColors = reorderColors(colors, newOrder)
    onUpdateColors(updatedColors)
  }

  const handleRenameColor = (colorId: string, newName: string) => {
    const newColors = colors.map(color => 
      color.id === colorId ? { ...color, name: newName } : color
    )
    onUpdateColors(newColors)
  }

  const handleDragStart = () => {
    setIsReordering(true)
  }

  const handleDragEnd = () => {
    setIsReordering(false)
  }

  const handleFolderDrop = (folderId: string | null, e: React.DragEvent) => {
    e.preventDefault()
    e.currentTarget.classList.remove('border-primary-400')
    
    const colorId = e.dataTransfer.getData('text/plain')
    if (!colorId) return

    const newColors = colors.map(color => 
      color.id === colorId ? { ...color, folderId } : color
    )
    onUpdateColors(newColors)
    setIsReordering(false)
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 h-full min-h-0">
      <Toast 
        message={toastMessage}
        isVisible={showToast}
        onHide={() => setShowToast(false)}
      />
      <button
        onClick={() => setIsFolderListVisible(prev => !prev)}
        className="sm:hidden w-full flex items-center justify-between px-3 py-2 bg-dark-800/50 rounded-xl border border-dark-700 text-gray-400 hover:text-white hover:border-primary/50"
      >
        <span className="text-sm font-medium">Folders</span>
        <Folder size={16} />
      </button>

      <AnimatePresence>
        {isFolderListVisible && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="sm:w-56 flex flex-col bg-dark-800/50 rounded-xl border border-dark-700 p-3 overflow-hidden"
          >
            <h4 className="text-sm font-medium text-gray-300 mb-2 flex-shrink-0">Folders</h4>
            <div className="overflow-y-auto flex-1 min-h-0">
              <div className="space-y-1">
                <button
                  onClick={() => {
                    onFolderSelect(null)
                    setIsFolderListVisible(window.innerWidth > 640)
                  }}
                  onDragOver={(e) => {
                    e.preventDefault()
                    e.currentTarget.classList.add('border-primary-400')
                  }}
                  onDragLeave={(e) => {
                    e.currentTarget.classList.remove('border-primary-400')
                  }}
                  onDrop={(e) => handleFolderDrop(null, e)}
                  className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl border transition-colors select-none ${
                    selectedFolderId === null
                      ? 'bg-primary/10 border-primary/20 text-primary-300'
                      : 'bg-dark-800/50 border-dark-700 text-gray-400 hover:text-white hover:border-primary/50'
                  }`}
                >
                  <Folder size={14} className="shrink-0" />
                  <span className="text-sm">Unorganized</span>
                  <span className="ml-auto text-xs text-gray-400 shrink-0">
                    {colors.filter(c => c.folderId === null).length}
                  </span>
                </button>
                {folders.map((folder) => (
                  <button
                    key={folder.id}
                    onClick={() => {
                      onFolderSelect(folder.id)
                      setIsFolderListVisible(window.innerWidth > 640)
                    }}
                    onContextMenu={(e) => {
                      e.preventDefault()
                      setContextMenu({
                        x: e.clientX,
                        y: e.clientY,
                        folder
                      })
                    }}
                    onDragOver={(e) => {
                      e.preventDefault()
                      e.currentTarget.classList.add('border-primary-400')
                    }}
                    onDragLeave={(e) => {
                      e.currentTarget.classList.remove('border-primary-400')
                    }}
                    onDrop={(e) => handleFolderDrop(folder.id, e)}
                    className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl border transition-colors select-none ${
                      selectedFolderId === folder.id
                        ? 'bg-primary/10 border-primary/20 text-primary-300'
                        : 'bg-dark-800/50 border-dark-700 text-gray-400 hover:text-white hover:border-primary/50'
                    }`}
                  >
                    <Folder size={14} className="shrink-0" />
                    {editingFolderId === folder.id ? (
                      <input
                        type="text"
                        value={folder.name}
                        onChange={(e) => onUpdateFolderName(folder.id, e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        onBlur={() => setEditingFolderId(null)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            setEditingFolderId(null)
                          }
                        }}
                        maxLength={10}
                        autoFocus
                        className="flex-1 bg-transparent border-none text-sm focus:outline-none focus:ring-0 text-left select-text"
                      />
                    ) : (
                      <span className="flex-1 text-sm truncate text-left">{folder.name}</span>
                    )}
                    <span className="text-xs text-gray-400 shrink-0">
                      {colors.filter(c => c.folderId === folder.id).length}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ type: "spring", duration: 0.2 }}
                    className="absolute mt-1 w-48 bg-dark-800/95 backdrop-blur-sm border border-dark-700 rounded-xl shadow-2xl overflow-hidden z-[100]"
                  >
                    <div className="p-1">
                      <motion.button
                        whileHover={{ backgroundColor: categoryFilter === null ? "rgba(59, 130, 246, 0.2)" : "rgba(17, 24, 39, 0.5)" }}
                        onClick={() => {
                          setCategoryFilter(null)
                          setIsCategoryFilterOpen(false)
                        }}
                        className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg transition-colors ${
                          categoryFilter === null
                            ? "bg-primary/10 text-primary-300"
                            : "text-gray-400 hover:text-white"
                        }`}
                      >
                        <Filter size={14} className="shrink-0" />
                        <span className="text-sm">All Categories</span>
                      </motion.button>
                      {CATEGORIES.map((category) => (
                        <motion.button
                          key={category}
                          whileHover={{ backgroundColor: categoryFilter === category ? "rgba(59, 130, 246, 0.2)" : "rgba(17, 24, 39, 0.5)" }}
                          onClick={() => {
                            setCategoryFilter(category)
                            setIsCategoryFilterOpen(false)
                          }}
                          className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg transition-colors ${
                            categoryFilter === category
                              ? "bg-primary/10 text-primary-300"
                              : "text-gray-400 hover:text-white"
                          }`}
                        >
                          <Filter size={14} className="shrink-0" />
                          <span className="text-sm capitalize">{category}</span>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          <div className="text-sm text-gray-400">{finalFilteredColors.length} colors</div>
        </div>

        <div className="flex-1 overflow-y-auto min-h-0">
          <Reorder.Group 
            axis="y" 
            values={finalFilteredColors} 
            onReorder={handleReorder}
            className="space-y-1.5"
            layoutScroll
          >
            {finalFilteredColors.map((color) => (
              <ColorCard 
                key={color.id} 
                color={color} 
                onDelete={() => onDeleteColor(color.id)}
                onRename={(newName) => handleRenameColor(color.id, newName)}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                isReordering={isReordering}
              />
            ))}
          </Reorder.Group>
        </div>
      </div>

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          folder={contextMenu.folder}
          paletteId={paletteId}
          onClose={() => setContextMenu(null)}
          onRename={() => setEditingFolderId(contextMenu.folder.id)}
          onDelete={() => onDeleteFolder(contextMenu.folder.id)}
        />
      )}
    </div>
  )
}

export default FolderView 