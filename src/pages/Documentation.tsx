import { FC } from "react"
import { Link } from "react-router-dom"
import { Book, Palette, Keyboard, Share2, Database, ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"
import { DocSection } from "../types/documentation"

const sections: DocSection[] = [
  {
    title: "Color Management",
    icon: <Palette className="w-5 h-5" />,
    items: [
      {
        title: "Adding Colors",
        description: "Add colors using HEX, RGB, or HSL values. Upload images to extract colors automatically. Use Alt + C for quick access."
      },
      {
        title: "Organizing",
        description: "Create folders to organize colors, drag and drop to rearrange, and filter by categories. Sort your colors by dragging them into your preferred order."
      }
    ]
  },
  {
    title: "Keyboard Controls",
    icon: <Keyboard className="w-5 h-5" />,
    items: [
      {
        title: "Palette Actions",
        description: "Alt + N: New palette, Alt + R: Rename palette, Alt + B: Toggle sidebar, Alt + E: Export folders, Alt + S: Share current folder"
      },
      {
        title: "Color Actions",
        description: "Click to copy color values, drag to move colors between folders, use the pencil icon to rename colors"
      }
    ]
  },
  {
    title: "Sharing",
    icon: <Share2 className="w-5 h-5" />,
    items: [
      {
        title: "Export Options",
        description: "Export your palettes as JSON files, share as beautiful images, or copy individual color values"
      },
      {
        title: "Collaboration",
        description: "Share your palettes with team members by exporting and importing JSON files"
      }
    ]
  },
  {
    title: "Storage",
    icon: <Database className="w-5 h-5" />,
    items: [
      {
        title: "Local Storage",
        description: "Your palettes are automatically saved locally. Changes are saved instantly."
      },
      {
        title: "Backup",
        description: "Export your palettes as JSON files for backup. Import them back anytime."
      }
    ]
  }
]

const Documentation: FC = () => {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-screen overflow-hidden bg-gradient-to-b from-dark-800 to-dark-900 relative"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-primary/5 rounded-full blur-3xl transform rotate-12" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-primary/10 rounded-full blur-3xl transform -rotate-12" />
      </div>

      <div className="h-full flex flex-col container max-w-4xl mx-auto px-4 py-8 relative">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Link 
            to="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6 group flex-shrink-0"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
            Back to Home
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex items-center gap-3 mb-6 flex-shrink-0"
        >
          <div className="w-12 h-12 relative group">
            <div className="absolute inset-0 bg-primary/10 rounded-xl blur-md transition-all group-hover:bg-primary/15 group-hover:blur-lg" />
            <div className="relative bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl p-1 overflow-hidden">
              <Book className="w-full h-full text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-300 to-primary-500">
              Documentation
            </h1>
            <p className="text-sm text-gray-400">
              Learn how to use SnowPalette effectively
            </p>
          </div>
        </motion.div>

        <div className="flex-1 min-h-0 overflow-y-auto pr-2 -mr-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sections.map((section, index) => (
              <motion.div 
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.4,
                  delay: 0.2 + index * 0.1,
                  ease: "easeOut"
                }}
                className="bg-dark-800/50 backdrop-blur-sm border border-dark-700 rounded-xl p-6 hover:border-primary/20 transition-colors"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary-300">
                    {section.icon}
                  </div>
                  <h2 className="text-lg font-medium text-gray-200">
                    {section.title}
                  </h2>
                </div>
                <div className="space-y-4">
                  {section.items.map((item) => (
                    <div key={item.title}>
                      <h3 className="text-sm font-medium text-gray-300 mb-1">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-400 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.main>
  )
}

export default Documentation 