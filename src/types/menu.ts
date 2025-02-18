import { LucideIcon } from "lucide-react"

export type MenuItemType = {
  label: string
  icon: LucideIcon
  onClick: () => void
  color: "primary" | "red"
  isGroupStart?: boolean
} 