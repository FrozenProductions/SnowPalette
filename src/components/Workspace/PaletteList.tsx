import { FC, useRef, useEffect } from 'react'
import { Plus, X, MoreVertical } from 'lucide-react'
import { Palette } from '../../types/colors'

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
        className="p-1.5 bg-dark-800/95 backdrop-blur-sm border border-dark-700 rounded-full text-gray-400 hover:text-white transition-colors"
      >
        <MoreVertical size={16} />
      </button>
      
      <div 
        ref={sidebarRef}
        className={`absolute right-0 bg-dark-800/95 backdrop-blur-sm border border-dark-700 rounded-2xl px-2 py-1.5 transform transition-all duration-300 ease-in-out ${
          showSidebar 
            ? 'translate-x-0 opacity-100 pointer-events-auto' 
            : 'translate-x-8 opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col items-stretch gap-1 min-w-[200px]">
          <div className="px-4 py-1.5 text-sm font-medium text-gray-300 flex items-center justify-between">
            <span>Your Palettes</span>
            <button
              onClick={onNewPalette}
              className="text-gray-400 hover:text-white transition-colors flex items-center gap-1.5"
            >
              <Plus size={14} />
              <span className="text-xs">New</span>
            </button>
          </div>
          <div className="w-full h-px bg-dark-600" />
          <div className="max-h-[calc(100vh-24rem)] overflow-y-auto flex flex-col gap-1 py-1">
            {palettes.map(palette => (
              <button
                key={palette.id}
                onClick={() => onSelectPalette(palette)}
                className={`group px-2 py-1.5 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 ${
                  currentPalette?.id === palette.id
                    ? 'bg-primary/20 text-primary-300'
                    : 'text-gray-400 hover:text-white hover:bg-dark-700/50'
                }`}
              >
                <span className="flex-1 text-left">{palette.name}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onDeletePalette(palette.id)
                  }}
                  className="w-5 h-5 rounded-full hover:bg-red-500/20 hover:text-red-400 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 -mr-1"
                >
                  <X size={14} />
                </button>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaletteList 