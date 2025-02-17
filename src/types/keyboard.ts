export type KeyboardShortcut = {
  key: string
  description: string
  ctrlKey?: boolean
  altKey?: boolean
  shiftKey?: boolean
  metaKey?: boolean
  action: () => void
}

export type KeyboardShortcuts = {
  [key: string]: KeyboardShortcut
}

export type KeyboardContextType = {
  shortcuts: KeyboardShortcuts
  registerShortcut: (id: string, shortcut: KeyboardShortcut) => void
  unregisterShortcut: (id: string) => void
} 