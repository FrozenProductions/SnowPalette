import { useState, useEffect } from 'react'
import { Palette } from '../types/colors'
import { STORAGE_KEY, SELECTED_PALETTE_KEY } from '../constants/storage'

const usePaletteStorage = () => {
  const [palettes, setPalettes] = useState<Palette[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        return Array.isArray(parsed) ? parsed : []
      } catch {
        return []
      }
    }
    return []
  })

  const [currentPalette, setCurrentPalette] = useState<Palette | null>(null)

  useEffect(() => {
    const savedPaletteId = localStorage.getItem(SELECTED_PALETTE_KEY)
    if (palettes.length > 0) {
      const paletteToSelect = savedPaletteId 
        ? palettes.find(p => p.id === savedPaletteId) || palettes[palettes.length - 1]
        : palettes[palettes.length - 1]
      
      setCurrentPalette(paletteToSelect)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(palettes))
  }, [palettes])

  useEffect(() => {
    if (currentPalette) {
      localStorage.setItem(SELECTED_PALETTE_KEY, currentPalette.id)
    }
  }, [currentPalette])

  return {
    palettes,
    setPalettes,
    currentPalette,
    setCurrentPalette,
  }
}

export default usePaletteStorage 