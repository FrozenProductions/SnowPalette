import { LucideIcon } from 'lucide-react'

export type KeyboardShortcut = {
  key: string
  ctrlKey?: boolean
  altKey?: boolean
  shiftKey?: boolean
  metaKey?: boolean
  description: string
  action: () => void
  icon?: LucideIcon
}

export type KeyboardShortcuts = {
  [key: string]: KeyboardShortcut
}

export type KeyboardContextType = {
  shortcuts: KeyboardShortcuts
  registerShortcut: (id: string, shortcut: KeyboardShortcut) => void
  unregisterShortcut: (id: string) => void
}

export type PaletteNavigationShortcuts = {
  nextPalette: KeyboardShortcut
  previousPalette: KeyboardShortcut
}

export interface ShortcutKey {
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