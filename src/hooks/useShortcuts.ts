import { useEffect } from "react"
import { useKeyboard } from "../contexts/KeyboardContext"
import { KeyboardShortcut } from "../types/keyboard"

export const useShortcuts = (shortcuts: { [key: string]: KeyboardShortcut }) => {
  const { registerShortcut, unregisterShortcut } = useKeyboard()

  useEffect(() => {
    Object.entries(shortcuts).forEach(([id, shortcut]) => {
      registerShortcut(id, shortcut)
    })

    return () => {
      Object.keys(shortcuts).forEach(id => {
        unregisterShortcut(id)
      })
    }
  }, [])

  return Object.entries(shortcuts).map(([id, shortcut]) => ({
    id,
    description: shortcut.description,
    modifiers: {
      ctrl: shortcut.ctrlKey || false,
      alt: shortcut.altKey || false,
      shift: shortcut.shiftKey || false,
      meta: shortcut.metaKey || false
    },
    key: shortcut.key.toUpperCase()
  }))
} 