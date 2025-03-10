import { FC, useEffect, useRef, useState } from 'react'
import { Folder, Pencil, Trash2, MoreHorizontal, Share2, Wand2, XCircle, CheckSquare, Square, Copy } from 'lucide-react'
import { motion } from 'framer-motion'
import { ColorItem, Folder as FolderType, ColorCategory } from '../../types/colors'
import { useNavigate } from 'react-router-dom'
import { folderOperations } from '../../utils/folderOperations'
import { filterColorsByCategory } from '../../utils/colors'
import ConfirmDialog from '../ConfirmDialog'
import { MenuItemType } from '../../types/menu'

interface ContextMenuProps {
  x: number
  y: number
  folder: FolderType
  paletteId: string
  colors: ColorItem[]
  onClose: () => void
  onRename: () => void
  onDelete: () => void
  onUpdateColors: (colors: ColorItem[]) => void
  onSelectColors: (colorIds: string[]) => void
  selectedColors: string[]
  categoryFilter: ColorCategory | null
}

const ContextMenu: FC<ContextMenuProps> = ({
  x,
  y,
  folder,
  paletteId,
  colors,
  onClose,
  onRename,
  onDelete,
  onUpdateColors,
  onSelectColors,
  selectedColors,
  categoryFilter
}) => {
  const navigate = useNavigate()
  const menuRef = useRef<HTMLDivElement>(null)
  const [selectedIndex, setSelectedIndex] = useState<number>(-1)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  
  const folderColors = filterColorsByCategory(
    colors.filter(color => color.folderId === folder.id),
    categoryFilter
  )
  const folderColorIds = folderColors.map(color => color.id)
  const areAllSelected = folderColorIds.length > 0 && folderColorIds.every(id => selectedColors.includes(id))
  
  const handleDeleteColors = () => {
    const newColors = folderOperations.deleteAllColors(colors, folder.id)
    onUpdateColors(newColors)
    onClose()
  }

  const menuItems: MenuItemType[] = [
    { label: 'Share', icon: Share2, onClick: () => navigate(`/share/${paletteId}/${folder.id}`), color: 'primary' },
    { label: 'Rename', icon: Pencil, onClick: onRename, color: 'primary' },
    { label: 'Delete', icon: Trash2, onClick: onDelete, color: 'red' },
    { 
      label: 'Auto-name Colors', 
      icon: Wand2, 
      onClick: () => {
        const newColors = folderOperations.autoNameColors(colors, folder.id)
        onUpdateColors(newColors)
      }, 
      color: 'primary',
      isGroupStart: true
    },
    { 
      label: 'Copy Colors', 
      icon: Copy, 
      onClick: () => {
        const colorValues = folderOperations.copyFolderColors(colors, folder.id)
        if (colorValues.length > 0) {
          navigator.clipboard.writeText(colorValues.join(", "))
        }
      }, 
      color: 'primary' 
    },
    { 
      label: 'Delete All Colors', 
      icon: XCircle, 
      onClick: () => {
        setShowDeleteConfirm(true)
      }, 
      color: 'red' 
    },
    { 
      label: areAllSelected ? 'Unselect All Colors' : 'Select All Colors', 
      icon: areAllSelected ? Square : CheckSquare, 
      onClick: () => {
        if (areAllSelected) {
          onSelectColors(selectedColors.filter(id => !folderColorIds.includes(id)))
        } else {
          onSelectColors([...new Set([...selectedColors, ...folderColorIds])])
        }
      }, 
      color: 'primary' 
    }
  ]

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault()
          setSelectedIndex(prev => (prev + 1) % menuItems.length)
          break
        case 'ArrowUp':
          event.preventDefault()
          setSelectedIndex(prev => (prev - 1 + menuItems.length) % menuItems.length)
          break
        case 'Enter':
          event.preventDefault()
          if (selectedIndex >= 0) {
            menuItems[selectedIndex].onClick()
            onClose()
          }
          break
        case 'Escape':
          event.preventDefault()
          onClose()
          break
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose, selectedIndex, menuItems])

  const adjustedPosition = {
    x: Math.min(x, window.innerWidth - 200),
    y: Math.min(y, window.innerHeight - 150)
  }

  return (
    <>
      <motion.div
        ref={menuRef}
        style={{ top: adjustedPosition.y, left: adjustedPosition.x }}
        className="fixed z-50 min-w-[180px] bg-dark-800/95 backdrop-blur-sm border border-dark-700 rounded-xl shadow-2xl overflow-hidden"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
      >
        <div className="px-3 py-2 text-xs font-medium text-gray-400 border-b border-dark-600 flex items-center gap-2">
          <Folder size={12} className="shrink-0" />
          <span className="truncate text-left flex-1">{folder.name}</span>
          <MoreHorizontal size={12} className="shrink-0 text-gray-500" />
        </div>
        <div className="p-1">
          {menuItems.map((item: MenuItemType, index: number) => {
            const isSelected = selectedIndex === index
            const bgColor = item.color === "red" ? "rgba(239, 68, 68, 0.1)" : "rgba(59, 130, 246, 0.1)"
            const textColorClass = item.color === "red" ? "text-red-400 hover:text-red-300" : "text-gray-300 hover:text-primary-300"
            
            return (
              <motion.button
                key={item.label}
                onClick={() => {
                  item.onClick()
                  if (item.label !== "Delete All Colors") {
                    onClose()
                  }
                }}
                onMouseEnter={() => setSelectedIndex(index)}
                className={`w-full px-3 py-1.5 text-sm flex items-center gap-2 rounded-lg ${textColorClass} transition-colors duration-75 hover:bg-dark-700/50 ${item.isGroupStart ? "mt-1" : ""}`}
                initial={false}
                animate={{ 
                  backgroundColor: isSelected ? bgColor : "rgba(0, 0, 0, 0)"
                }}
                transition={{ duration: 0.1 }}
              >
                <item.icon size={14} className="shrink-0" />
                <span className="text-left">{item.label}</span>
              </motion.button>
            )
          })}
        </div>
      </motion.div>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete All Colors"
        message={`Are you sure you want to delete all${categoryFilter ? ` ${categoryFilter}` : ""} colors from "${folder.name}"? This action cannot be undone.`}
        onConfirm={() => {
          handleDeleteColors()
          setShowDeleteConfirm(false)
          onClose()
        }}
        onCancel={() => {
          setShowDeleteConfirm(false)
        }}
      />
    </>
  )
}

export default ContextMenu 