import { FC, useEffect } from 'react'
import { CheckCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface ToastProps {
  message: string
  isVisible: boolean
  onHide: () => void
}

const Toast: FC<ToastProps> = ({ message, isVisible, onHide }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onHide()
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [isVisible, onHide])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          className="fixed bottom-10 left-1/2 z-50"
          initial={{ opacity: 0, y: 20, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: 20, x: '-50%' }}
          transition={{ duration: 0.15, ease: "easeOut" }}
        >
          <div className="bg-dark-800/95 backdrop-blur-sm border border-dark-700 rounded-full px-4 py-2 flex items-center gap-2 shadow-lg">
            <CheckCircle size={16} className="text-primary-300" />
            <span className="text-sm text-gray-300">{message}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Toast 