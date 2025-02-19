import { FC, useRef, useEffect } from "react"
import { Keyboard } from "lucide-react"
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
  icon?: FC<{ size?: number }>
}

interface KeyboardShortcutsProps {
  shortcuts: ShortcutKey[]
  isOpen: boolean
  onClose: () => void
  buttonRef: React.RefObject<HTMLButtonElement>
}

const ShortcutDisplay: FC<{ shortcut: ShortcutKey }> = ({ shortcut }) => {
  const isMac = navigator.platform.includes("Mac")
  const Icon = shortcut.icon
  
  return (
    <div className="flex items-center gap-1 text-xs font-mono">
      {shortcut.modifiers.ctrl && (
        <span className="h-[20px] px-1.5 py-0.5 bg-dark-700/50 rounded-md text-gray-400 flex items-center justify-center">
          {isMac ? "cmd" : "ctrl"}
        </span>
      )}
      {shortcut.modifiers.alt && (
        <span className="h-[20px] px-1.5 py-0.5 bg-dark-700/50 rounded-md text-gray-400 flex items-center justify-center">
          {isMac ? "opt" : "alt"}
        </span>
      )}
      {shortcut.modifiers.shift && (
        <span className="h-[20px] px-1.5 py-0.5 bg-dark-700/50 rounded-md text-gray-400 flex items-center justify-center">
          shift
        </span>
      )}
      <span className="h-[20px] px-1.5 py-0.5 bg-dark-700/50 rounded-md text-primary-300 flex items-center justify-center">
        {Icon ? <Icon size={12} /> : shortcut.key}
      </span>
    </div>
  )
}

const KeyboardShortcuts: FC<KeyboardShortcutsProps> = ({ shortcuts, isOpen, onClose, buttonRef }) => {
  const shortcutsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        shortcutsRef.current &&
        buttonRef.current &&
        !shortcutsRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        onClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [onClose])

  return (
    <AnimatePresence>
      {isOpen && (
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
  )
}

export default KeyboardShortcuts 