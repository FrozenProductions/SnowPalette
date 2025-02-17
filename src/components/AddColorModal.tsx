import { FC, useState, useEffect, useRef } from 'react'
import { X, Camera, Loader2, ChevronUp, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { extractColors } from '../utils/colorExtractor'

interface RGB {
  r: number
  g: number
  b: number
}

interface HSL {
  h: number
  s: number
  l: number
}

interface AddColorModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (colors: string[]) => void
  initialColor?: string
  selectedFolderId: string | null
}

const hexToRgb = (hex: string): RGB | null => {
  const h = hex.replace('#', '')
  if (!/^[0-9A-F]{6}$/i.test(h)) return null
  return {
    r: parseInt(h.substring(0, 2), 16),
    g: parseInt(h.substring(2, 4), 16),
    b: parseInt(h.substring(4, 6), 16)
  }
}

const rgbToHex = (r: number, g: number, b: number): string => {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }).join('')
}

const rgbToHsl = (r: number, g: number, b: number): HSL => {
  r /= 255
  g /= 255
  b /= 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0, s, l = (max + min) / 2

  if (max === min) {
    h = s = 0
  } else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break
      case g: h = (b - r) / d + 2; break
      case b: h = (r - g) / d + 4; break
    }
    h /= 6
  }

  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
}

const hslToRgb = (h: number, s: number, l: number): RGB => {
  h /= 360
  s /= 100
  l /= 100
  let r, g, b

  if (s === 0) {
    r = g = b = l
  } else {
    const hue2rgb = (p: number, q: number, t: number): number => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1/6) return p + (q - p) * 6 * t
      if (t < 1/2) return q
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
      return p
    }

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    r = hue2rgb(p, q, h + 1/3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1/3)
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  }
}

const parseRgbString = (str: string): RGB | null => {
  const match = str.match(/^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/)
  if (!match) return null
  const [, r, g, b] = match
  const rgb = { r: parseInt(r), g: parseInt(g), b: parseInt(b) }
  if (rgb.r > 255 || rgb.g > 255 || rgb.b > 255) return null
  return rgb
}

const parseHslString = (str: string): HSL | null => {
  const match = str.match(/^hsl\(\s*(\d+)\s*,\s*(\d+)%?\s*,\s*(\d+)%?\s*\)$/)
  if (!match) return null
  const [, h, s, l] = match
  const hsl = { h: parseInt(h), s: parseInt(s), l: parseInt(l) }
  if (hsl.h > 360 || hsl.s > 100 || hsl.l > 100) return null
  return hsl
}

const tryParseColor = (text: string): string | null => {
  text = text.trim().toLowerCase()

  if (text.startsWith('#')) {
    const rgb = hexToRgb(text)
    if (rgb) return rgbToHex(rgb.r, rgb.g, rgb.b)
  }

  if (text.startsWith('rgb')) {
    const rgb = parseRgbString(text)
    if (rgb) return rgbToHex(rgb.r, rgb.g, rgb.b)
  }

  if (text.startsWith('hsl')) {
    const hsl = parseHslString(text)
    if (hsl) {
      const rgb = hslToRgb(hsl.h, hsl.s, hsl.l)
      return rgbToHex(rgb.r, rgb.g, rgb.b)
    }
  }

  const hexWithoutHash = text.replace('#', '')
  if (/^[0-9A-F]{6}$/i.test(hexWithoutHash)) {
    return '#' + hexWithoutHash
  }

  return null
}

export const AddColorModal: FC<AddColorModalProps> = ({ isOpen, onClose, onAdd, initialColor = '#000000' }) => {
  const [hex, setHex] = useState(initialColor)
  const [rgb, setRgb] = useState<RGB>(hexToRgb(initialColor) || { r: 0, g: 0, b: 0 })
  const [hsl, setHsl] = useState<HSL>(rgbToHsl(rgb.r, rgb.g, rgb.b))
  const [extractedColors, setExtractedColors] = useState<string[]>([])
  const [isExtracting, setIsExtracting] = useState(false)
  const [numColors, setNumColors] = useState(6)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!isOpen) return

    const handlePaste = (e: ClipboardEvent) => {
      e.preventDefault()
      const text = e.clipboardData?.getData('text')
      if (!text) return

      const color = tryParseColor(text)
      if (color) {
        const newRgb = hexToRgb(color) || { r: 0, g: 0, b: 0 }
        setHex(color)
        setRgb(newRgb)
        setHsl(rgbToHsl(newRgb.r, newRgb.g, newRgb.b))
      }
    }

    document.addEventListener('paste', handlePaste)
    return () => document.removeEventListener('paste', handlePaste)
  }, [isOpen])

  const handleHexChange = (value: string) => {
    if (value.startsWith('#')) {
      value = value.slice(1)
    }
    value = value.slice(0, 6)
    const newHex = '#' + value
    setHex(newHex)
    if (value.length === 6) {
      const newRgb = hexToRgb(newHex)
      if (newRgb) {
        setRgb(newRgb)
        setHsl(rgbToHsl(newRgb.r, newRgb.g, newRgb.b))
      }
    }
  }

  const handleRgbChange = (key: keyof RGB, value: string) => {
    const num = parseInt(value)
    if (value === '') {
      setRgb(prev => ({ ...prev, [key]: 0 }))
    } else if (!isNaN(num)) {
      const newRgb = { ...rgb, [key]: Math.min(255, num) }
      setRgb(newRgb)
      setHex(rgbToHex(newRgb.r, newRgb.g, newRgb.b))
      setHsl(rgbToHsl(newRgb.r, newRgb.g, newRgb.b))
    }
  }

  const handleHslChange = (key: keyof HSL, value: string) => {
    const num = parseInt(value)
    if (value === '') {
      setHsl(prev => ({ ...prev, [key]: 0 }))
    } else if (!isNaN(num)) {
      const maxValue = key === 'h' ? 360 : 100
      const newHsl = { ...hsl, [key]: Math.min(maxValue, num) }
      setHsl(newHsl)
      const newRgb = hslToRgb(newHsl.h, newHsl.s, newHsl.l)
      setRgb(newRgb)
      setHex(rgbToHex(newRgb.r, newRgb.g, newRgb.b))
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsExtracting(true)
    try {
      const colors = await extractColors(file, {
        targetColors: numColors,
        minColors: Math.max(1, numColors - 2),
        maxColors: Math.min(24, numColors + 2)
      })
      setExtractedColors(colors)
    } catch (err) {
      console.error("Failed to extract colors:", err)
    } finally {
      setIsExtracting(false)
    }
  }

  const handleExtractedColorClick = (color: string) => {
    const newRgb = hexToRgb(color) || { r: 0, g: 0, b: 0 }
    setHex(color)
    setRgb(newRgb)
    setHsl(rgbToHsl(newRgb.r, newRgb.g, newRgb.b))
  }

  const handleAddAll = () => {
    onAdd(extractedColors)
    setExtractedColors([])
    onClose()
  }

  const handleAddSingle = () => {
    onAdd([hex])
    onClose()
  }

  const handleNumColorsChange = (delta: number) => {
    setNumColors(prev => Math.min(12, Math.max(1, prev + delta)))
  }

  const handleNumColorsInput = (value: string) => {
    const num = parseInt(value)
    if (value === "") {
      setNumColors(1)
    } else if (!isNaN(num)) {
      setNumColors(Math.min(12, Math.max(1, num)))
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-dark-800 rounded-xl border border-dark-700 shadow-lg max-w-md w-full overflow-hidden"
          >
            <div className="p-4 border-b border-dark-700 flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-200">Add Color</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-300 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div className="w-full h-24 rounded-lg border-2 border-dark-600 overflow-hidden">
                <div className="w-full h-full" style={{ backgroundColor: hex }} />
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-400">Hex</label>
                  <input
                    type="text"
                    value={hex}
                    onChange={(e) => handleHexChange(e.target.value)}
                    className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-sm focus:border-primary/50 focus:outline-none font-mono"
                    placeholder="#000000"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-400">RGB</label>
                  <div className="flex gap-2">
                    {(['r', 'g', 'b'] as const).map((key) => (
                      <div key={key} className="flex-1">
                        <input
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          value={rgb[key]}
                          onChange={(e) => handleRgbChange(key, e.target.value)}
                          className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-sm focus:border-primary/50 focus:outline-none font-mono text-center"
                          placeholder="0"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-400">HSL</label>
                  <div className="flex gap-2">
                    {(['h', 's', 'l'] as const).map((key) => (
                      <div key={key} className="flex-1">
                        <input
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          value={hsl[key]}
                          onChange={(e) => handleHslChange(key, e.target.value)}
                          className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-sm focus:border-primary/50 focus:outline-none font-mono text-center"
                          placeholder="0"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isExtracting}
                      className="w-full h-9 px-3 bg-dark-700/50 text-sm text-gray-300 rounded-lg border border-dark-600 hover:border-primary/50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isExtracting ? (
                        <>
                          <Loader2 size={14} className="animate-spin" />
                          <span>Extracting...</span>
                        </>
                      ) : (
                        <>
                          <Camera size={14} />
                          <span>Extract from Image</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="flex items-center h-9 bg-dark-700/50 rounded-lg border border-dark-600">
                    <span className="text-xs text-gray-400 px-2">Colors:</span>
                    <div className="flex items-center h-full border-l border-dark-600">
                      <button
                        onClick={() => handleNumColorsChange(-1)}
                        disabled={numColors <= 1}
                        className="h-full px-1 text-gray-400 hover:text-gray-300 hover:bg-dark-700/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronDown size={14} />
                      </button>
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={numColors}
                        onChange={(e) => handleNumColorsInput(e.target.value)}
                        className="w-8 bg-transparent text-sm text-gray-300 text-center focus:outline-none font-mono"
                      />
                      <button
                        onClick={() => handleNumColorsChange(1)}
                        disabled={numColors >= 12}
                        className="h-full px-1 text-gray-400 hover:text-gray-300 hover:bg-dark-700/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronUp size={14} />
                      </button>
                    </div>
                  </div>
                </div>

                {extractedColors.length > 0 && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-6 gap-2">
                      {extractedColors.map((color, index) => (
                        <button
                          key={index}
                          onClick={() => handleExtractedColorClick(color)}
                          className="aspect-square rounded-lg ring-1 ring-dark-600 hover:ring-primary/50 transition-colors overflow-hidden"
                        >
                          <div
                            className="w-full h-full"
                            style={{ backgroundColor: color }}
                          />
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={handleAddAll}
                      className="w-full px-4 py-2 bg-primary/10 text-sm text-primary-300 rounded-lg border border-primary/20 hover:bg-primary/20 transition-colors"
                    >
                      Add All Colors
                    </button>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2 bg-dark-700 text-sm text-gray-300 rounded-lg border border-dark-600 hover:text-white hover:border-dark-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddSingle}
                  className="flex-1 px-4 py-2 bg-primary/10 text-sm text-primary-300 rounded-lg border border-primary/20 hover:bg-primary/20 transition-colors"
                >
                  Add Color
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
} 