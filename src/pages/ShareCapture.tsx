import { FC, useRef, useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ColorItem, Folder, Palette } from '../types/colors'
import { ShareHeader, ShareActions, ShareColorGrid, ShareInfo } from '../components/Share'
import { COLORS_PER_ROW } from '../constants/share'
import { STORAGE_KEY } from '../constants/storage'
import { encodeShareData } from '../utils/share'
import html2canvas from 'html2canvas'
import Toast from '../components/Toast'

const ShareCapture: FC = () => {
  const navigate = useNavigate()
  const { paletteId, folderId } = useParams()
  const containerRef = useRef<HTMLDivElement>(null)
  const [isCapturing, setIsCapturing] = useState(false)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [colors, setColors] = useState<ColorItem[]>([])
  const [folder, setFolder] = useState<Folder | null>(null)
  const [palette, setPalette] = useState<Palette | null>(null)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")

  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY)
    if (savedData) {
      try {
        const palettes = JSON.parse(savedData)
        const currentPalette = palettes.find((p: Palette) => p.id === paletteId)
        if (currentPalette) {
          setPalette(currentPalette)
          if (folderId) {
            const currentFolder = currentPalette.folders.find((f: Folder) => f.id === folderId)
            setFolder(currentFolder || null)
            setColors(currentPalette.colors.filter((c: ColorItem) => c.folderId === folderId))
          } else {
            setColors(currentPalette.colors.filter((c: ColorItem) => c.folderId === null))
          }
        }
      } catch (err) {
        console.error('Failed to parse saved data:', err)
      }
    }
  }, [paletteId, folderId])

  const showNotification = (message: string) => {
    setToastMessage(message)
    setShowToast(true)
  }

  const handleCapture = async () => {
    if (!containerRef.current) return
    setIsCapturing(true)

    try {
      const canvas = await html2canvas(containerRef.current, {
        backgroundColor: null,
        scale: 2,
        logging: false
      })
      
      const dataUrl = canvas.toDataURL('image/png')
      setCapturedImage(dataUrl)
    } catch (err) {
      console.error('Failed to capture:', err)
    } finally {
      setIsCapturing(false)
    }
  }

  const handleDownload = () => {
    if (!capturedImage) return
    
    const a = document.createElement('a')
    a.href = capturedImage
    a.download = `${palette?.name}-${folder?.name || 'unorganized'}-colors.png`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const handleShare = async () => {
    if (!capturedImage) return

    try {
      const blob = await (await fetch(capturedImage)).blob()
      const file = new File([blob], `${palette?.name}-${folder?.name || 'unorganized'}-colors.png`, { type: 'image/png' })
      
      if (navigator.share) {
        await navigator.share({
          title: `${palette?.name} - ${folder?.name || 'Unorganized'} Colors`,
          files: [file]
        })
      } else {
        handleDownload()
      }
    } catch (err) {
      console.error('Failed to share:', err)
      handleDownload()
    }
  }

  const handleShareLink = () => {
    if (!palette) return

    const shareData = encodeShareData({
      name: palette.name,
      folderName: folder?.name || "Unorganized Colors",
      colors: colors,
      folder: folder
    })
    const shareUrl = `${window.location.origin}/share/palette/${shareData}`
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl)
        .then(() => showNotification('Share link copied to clipboard'))
        .catch(() => {
          const input = document.createElement('input')
          input.value = shareUrl
          document.body.appendChild(input)
          input.select()
          document.execCommand('copy')
          document.body.removeChild(input)
          showNotification('Share link copied to clipboard')
        })
    }
  }

  return (
    <div className="min-h-screen bg-dark-900 text-white">
      <ShareHeader onClose={() => navigate('/workspace')} />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <ShareActions
              isCapturing={isCapturing}
              capturedImage={capturedImage}
              onCapture={handleCapture}
              onShare={handleShare}
              onDownload={handleDownload}
              onShareLink={handleShareLink}
            />
          </div>

          <div 
            ref={containerRef}
            className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-dark-800 to-dark-900 p-8 border border-dark-700"
          >
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px_32px]" />
            <div className="relative">
              <div className="flex flex-col gap-6">
                <ShareInfo
                  paletteName={palette?.name}
                  folderName={folder?.name}
                  colorsCount={colors.length}
                />
                <ShareColorGrid colors={colors} colorsPerRow={COLORS_PER_ROW} />
              </div>

              <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between text-xs text-gray-500">
                <div>Created with SnowPalette</div>
                <div>snowpalette.vercel.app</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Toast
        message={toastMessage}
        isVisible={showToast}
        onHide={() => setShowToast(false)}
      />
    </div>
  )
}

export default ShareCapture 