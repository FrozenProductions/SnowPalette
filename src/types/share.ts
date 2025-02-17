import { ColorItem } from './colors'

export interface ShareHeaderProps {
  onClose: () => void
}

export interface ShareActionsProps {
  isCapturing: boolean
  capturedImage: string | null
  onCapture: () => void
  onShare: () => void
  onDownload: () => void
}

export interface ShareColorGridProps {
  colors: ColorItem[]
  colorsPerRow: number
}

export interface ShareInfoProps {
  paletteName: string | undefined
  folderName: string | undefined
  colorsCount: number
} 