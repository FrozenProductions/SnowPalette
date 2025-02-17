import { FC, useRef, useEffect } from 'react'
import { Plus, X, MoreVertical, Palette as PaletteIcon } from 'lucide-react'
import { Palette } from '../../types/colors'
import { motion, AnimatePresence } from 'framer-motion'

interface PaletteListProps {
  palettes: Palette[]
  currentPalette: Palette | null
  showSidebar: boolean
  onNewPalette: () => void
  onSelectPalette: (palette: Palette) => void
  onDeletePalette: (paletteId: string) => void
  onToggleSidebar: () => void
}

const PaletteList: FC<PaletteListProps> = ({
  palettes,
  currentPalette,
  showSidebar,
  onNewPalette,
  onSelectPalette,
  onDeletePalette,
  onToggleSidebar,
}) => {
  const sidebarRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
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

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showSidebar, onToggleSidebar])

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
            <div className="flex flex-col min-w-[180px]">
              <div className="p-3 flex items-center justify-between border-b border-dark-700">
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
              <div className="p-1.5 max-h-[calc(100vh-24rem)] overflow-y-auto">
                {palettes.map(palette => (
                  <motion.button
                    key={palette.id}
                    onClick={() => onSelectPalette(palette)}
                    className={`group w-full px-2 py-1.5 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                      currentPalette?.id === palette.id
                        ? "bg-primary/10 text-primary-300"
                        : "text-gray-400 hover:text-white hover:bg-dark-700/50"
                    }`}
                    whileHover={{ x: 2 }}
                    transition={{ duration: 0.1 }}
                  >
                    <span className="flex-1 text-left truncate">{palette.name}</span>
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation()
                        onDeletePalette(palette.id)
                      }}
                      className="w-5 h-5 rounded-lg hover:bg-red-500/20 hover:text-red-400 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100"
                      whileHover={{ scale: 1.1 }}
                    >
                      <X size={12} />
                    </motion.button>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default PaletteList 