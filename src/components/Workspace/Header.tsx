import { FC, useState, useRef, useEffect } from "react"
import { Link } from "react-router-dom"
import { Plus, Keyboard } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

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

const ShortcutDisplay: FC<{ shortcut: ShortcutKey }> = ({ shortcut }) => {
  const isMac = navigator.platform.includes("Mac")
  
  return (
    <div className="flex items-center gap-1 text-xs font-mono">
      {shortcut.modifiers.ctrl && (
        <span className="px-1.5 py-0.5 bg-dark-700/50 rounded-md text-gray-400">
          {isMac ? "cmd" : "ctrl"}
        </span>
      )}
      {shortcut.modifiers.alt && (
        <span className="px-1.5 py-0.5 bg-dark-700/50 rounded-md text-gray-400">
          {isMac ? "opt" : "alt"}
        </span>
      )}
      {shortcut.modifiers.shift && (
        <span className="px-1.5 py-0.5 bg-dark-700/50 rounded-md text-gray-400">
          shift
        </span>
      )}
      <span className="px-1.5 py-0.5 bg-dark-700/50 rounded-md text-primary-300">
        {shortcut.key}
      </span>
    </div>
  )
}

const Header: FC<HeaderProps> = ({ onNewPalette, shortcuts }) => {
  const [showShortcuts, setShowShortcuts] = useState(false)
  const shortcutsRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        shortcutsRef.current &&
        buttonRef.current &&
        !shortcutsRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowShortcuts(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

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

      <AnimatePresence>
        {showShortcuts && (
          <motion.div
            ref={shortcutsRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-4 top-20 bg-dark-800/95 backdrop-blur-sm border border-dark-700 rounded-lg shadow-2xl overflow-hidden"
          >
            <div className="p-2 border-b border-dark-700 flex items-center gap-2">
              <Keyboard size={12} className="text-gray-400" />
              <span className="text-xs font-medium text-gray-300">Keyboard Shortcuts</span>
            </div>
            <div className="p-1.5">
              {shortcuts.map(shortcut => (
                <div key={shortcut.id} className="flex items-center justify-between px-2 py-1.5 rounded-md text-[11px] hover:bg-dark-700/50">
                  <span className="text-gray-400 mr-8">{shortcut.description}</span>
                  <ShortcutDisplay shortcut={shortcut} />
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

export default Header 