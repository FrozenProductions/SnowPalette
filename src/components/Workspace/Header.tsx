import { FC, useState, useRef } from "react"
import { Link } from "react-router-dom"
import { Plus, Keyboard } from "lucide-react"
import KeyboardShortcuts from "./KeyboardShortcuts"

interface ShortcutKey {
  id: string
  description: string
  modifiers: {
    ctrl: boolean
    alt: boolean
    shift: boolean
    meta: boolean
  }
  key: string
}

interface HeaderProps {
  onNewPalette: () => void
  shortcuts: ShortcutKey[]
}

const Header: FC<HeaderProps> = ({ onNewPalette, shortcuts }) => {
  const [showShortcuts, setShowShortcuts] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  return (
    <header className="fixed top-0 left-0 right-0 h-20 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 relative">
            <div className="absolute inset-0 bg-primary/10 rounded-lg blur-sm transition-all group-hover:bg-primary/15" />
            <div className="relative bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg overflow-hidden">
              <img 
                src="/icon-maskable.png" 
                alt="SnowPalette Logo" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-300 to-primary-500">
              SnowPalette
            </h1>
            <span className="text-xs text-gray-400">Workspace</span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <button 
            className="px-4 py-1.5 rounded-full text-sm font-medium transition-colors text-gray-400 hover:text-white hover:bg-dark-700/50 flex items-center gap-2"
            onClick={onNewPalette}
          >
            <Plus size={16} />
            New Palette
          </button>
          <button
            ref={buttonRef}
            onClick={() => setShowShortcuts(prev => !prev)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-dark-700/50 transition-colors relative"
          >
            <Keyboard size={16} />
          </button>
        </div>
      </div>

      <KeyboardShortcuts
        shortcuts={shortcuts}
        isOpen={showShortcuts}
        onClose={() => setShowShortcuts(false)}
        buttonRef={buttonRef}
      />
    </header>
  )
}

export default Header 