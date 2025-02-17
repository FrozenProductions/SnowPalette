import { FC } from 'react'
import { Camera, Share2, Download, Loader2 } from 'lucide-react'
import { ShareActionsProps } from '../../types/share'

const ShareActions: FC<ShareActionsProps> = ({
  isCapturing,
  capturedImage,
  onCapture,
  onShare,
  onDownload,
}) => {
  return (
    <div className="flex items-center gap-3">
      {capturedImage ? (
        <>
          <button
            onClick={onShare}
            className="px-4 py-2 bg-primary/10 text-sm font-medium text-primary-300 rounded-xl border border-primary/20 hover:bg-primary/20 transition-colors flex items-center gap-2"
          >
            <Share2 size={16} />
            Share Image
          </button>
          <button
            onClick={onDownload}
            className="px-4 py-2 bg-dark-700/50 text-sm font-medium text-gray-300 rounded-xl border border-dark-600 hover:border-primary/50 transition-colors flex items-center gap-2"
          >
            <Download size={16} />
            Download
          </button>
        </>
      ) : (
        <button
          onClick={onCapture}
          disabled={isCapturing}
          className="px-4 py-2 bg-primary/10 text-sm font-medium text-primary-300 rounded-xl border border-primary/20 hover:bg-primary/20 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isCapturing ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Capturing...
            </>
          ) : (
            <>
              <Camera size={16} />
              Capture Image
            </>
          )}
        </button>
      )}
    </div>
  )
}

export default ShareActions 