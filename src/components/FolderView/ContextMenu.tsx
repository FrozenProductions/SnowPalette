import { FC, useEffect, useRef, useState } from 'react'
import { Folder, Pencil, Trash2, MoreHorizontal, Share2, LucideIcon } from 'lucide-react'
import { motion } from 'framer-motion'
import { Folder as FolderType } from '../../types/colors'
import { useNavigate } from 'react-router-dom'

type MenuItemType = {
  label: string
  icon: LucideIcon
  onClick: () => void
  color: 'primary' | 'red'
}

interface ContextMenuProps {
  x: number
  y: number
  folder: FolderType
  paletteId: string
  onClose: () => void
  onRename: () => void
  onDelete: () => void
}

const ContextMenu: FC<ContextMenuProps> = ({ x, y, folder, paletteId, onClose, onRename, onDelete }) => {
  const navigate = useNavigate()
  const menuRef = useRef<HTMLDivElement>(null)
  const [selectedIndex, setSelectedIndex] = useState<number>(-1)
  const menuItems: MenuItemType[] = [
    { label: 'Share', icon: Share2, onClick: () => navigate(`/share/${paletteId}/${folder.id}`), color: 'primary' },
    { label: 'Rename', icon: Pencil, onClick: onRename, color: 'primary' },
    { label: 'Delete', icon: Trash2, onClick: onDelete, color: 'red' }
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
    <motion.div
      ref={menuRef}
      style={{ top: adjustedPosition.y, left: adjustedPosition.x }}
      className="fixed z-50 min-w-[180px] bg-dark-800/95 backdrop-blur-sm border border-dark-700 rounded-xl shadow-2xl overflow-hidden"
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0 }}
      transition={{ duration: 0.1, ease: "easeOut" }}
    >
      <div className="px-3 py-2 text-xs font-medium text-gray-400 border-b border-dark-600 flex items-center gap-2">
        <Folder size={12} className="shrink-0" />
        <span className="truncate text-left flex-1">{folder.name}</span>
        <MoreHorizontal size={12} className="shrink-0 text-gray-500" />
      </div>
      <div className="p-1">
        {menuItems.map((item, index) => {
          const isSelected = selectedIndex === index
          const bgColor = item.color === 'red' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.1)'
          const textColorClass = item.color === 'red' ? 'text-red-400 hover:text-red-300' : 'text-gray-300 hover:text-primary-300'
          
          return (
            <div key={item.label} className="relative">
              <motion.button
                onClick={() => {
                  item.onClick()
                  onClose()
                }}
                onMouseEnter={() => setSelectedIndex(index)}
                className={`w-full px-3 py-1.5 text-sm flex items-center gap-2 rounded-lg ${textColorClass} transition-colors duration-75`}
                initial={false}
                animate={{ 
                  backgroundColor: isSelected ? bgColor : 'rgba(0, 0, 0, 0)'
                }}
                transition={{ duration: 0.1 }}
              >
                <item.icon size={14} className="shrink-0" />
                <span className="text-left">{item.label}</span>
              </motion.button>
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}

export default ContextMenu 