import { createContext, useContext, useEffect, useState, FC, ReactNode } from "react"
import { KeyboardContextType, KeyboardShortcuts, KeyboardShortcut } from "../types/keyboard"

const KeyboardContext = createContext<KeyboardContextType | null>(null)

export const useKeyboard = () => {
  const context = useContext(KeyboardContext)
  if (!context) {
    throw new Error("useKeyboard must be used within a KeyboardProvider")
  }
  return context
}

interface KeyboardProviderProps {
  children: ReactNode
}

export const KeyboardProvider: FC<KeyboardProviderProps> = ({ children }) => {
  const [shortcuts, setShortcuts] = useState<KeyboardShortcuts>({})
  const isMac = navigator.platform.includes("Mac")

  const registerShortcut = (id: string, shortcut: KeyboardShortcut) => {
    setShortcuts(prev => ({ ...prev, [id]: shortcut }))
  }

  const unregisterShortcut = (id: string) => {
    setShortcuts(prev => {
      const newShortcuts = { ...prev }
      delete newShortcuts[id]
      return newShortcuts
    })
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return
      }

      if (event.altKey) {
        event.preventDefault()
      }

      const matchingShortcut = Object.values(shortcuts).find(shortcut => {
        const keyMatch: boolean = event.code.toLowerCase() === `key${shortcut.key.toLowerCase()}`
        const altMatch: boolean = !!shortcut.altKey === event.altKey
        const ctrlMatch: boolean = !!shortcut.ctrlKey === (isMac ? event.metaKey : event.ctrlKey)
        const shiftMatch: boolean = !!shortcut.shiftKey === event.shiftKey
        const metaMatch: boolean = !!shortcut.metaKey === (isMac ? event.metaKey : event.metaKey)

        return keyMatch && altMatch && ctrlMatch && shiftMatch && metaMatch
      })

      if (matchingShortcut) {
        event.preventDefault()
        matchingShortcut.action()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [shortcuts, isMac])

  return (
    <KeyboardContext.Provider value={{ shortcuts, registerShortcut, unregisterShortcut }}>
      {children}
    </KeyboardContext.Provider>
  )
}