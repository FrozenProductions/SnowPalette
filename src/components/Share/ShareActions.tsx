import { FC } from 'react'
import { Camera, Share2, Download, Loader2, Link } from 'lucide-react'
import { ShareActionsProps } from '../../types/share'

const ShareActions: FC<ShareActionsProps> = ({
  isCapturing,
  capturedImage,
  onCapture,
  onShare,
  onDownload,
  onShareLink
}) => {
  return (
    <div className="flex items-center gap-3">
      {capturedImage ? (
        <>
          <button
            onClick={onShare}
            className="h-9 px-4 bg-primary/10 text-sm font-medium text-primary-300 rounded-xl border border-primary/20 hover:bg-primary/20 transition-colors flex items-center gap-2"
          >
            <Share2 size={16} className="shrink-0" />
            Share Image
          </button>
          <button
            onClick={onDownload}
            className="h-9 px-4 bg-dark-700/50 text-sm font-medium text-gray-300 rounded-xl border border-dark-600 hover:border-primary/50 transition-colors flex items-center gap-2"
          >
            <Download size={16} className="shrink-0" />
            Download
          </button>
        </>
      ) : (
        <>
          <button
            onClick={onCapture}
            disabled={isCapturing}
            className="h-9 px-4 bg-primary/10 text-sm font-medium text-primary-300 rounded-xl border border-primary/20 hover:bg-primary/20 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCapturing ? (
              <>
                <Loader2 size={16} className="shrink-0 animate-spin" />
                Capturing...
              </>
            ) : (
              <>
                <Camera size={16} className="shrink-0" />
                Capture Image
              </>
            )}
          </button>
          <button
            onClick={onShareLink}
            className="h-9 px-4 bg-dark-700/50 text-sm font-medium text-gray-300 rounded-xl border border-dark-600 hover:border-primary/50 transition-colors flex items-center gap-2"
          >
            <Link size={16} className="shrink-0" />
            Share Link
          </button>
        </>
      )}
    </div>
  )
}

export default ShareActions 