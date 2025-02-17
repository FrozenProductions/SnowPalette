const quantize = (pixels: Uint8ClampedArray, numColors: number): string[] => {
  const colors: { [key: string]: number } = {}
  
  for (let i = 0; i < pixels.length; i += 4) {
    const r = Math.round(pixels[i] / 16) * 16
    const g = Math.round(pixels[i + 1] / 16) * 16
    const b = Math.round(pixels[i + 2] / 16) * 16
    const hex = rgbToHex(r, g, b)
    colors[hex] = (colors[hex] || 0) + 1
  }

  return Object.entries(colors)
    .sort(([, a], [, b]) => b - a)
    .slice(0, numColors)
    .map(([color]) => color)
}

const rgbToHex = (r: number, g: number, b: number): string => {
  return "#" + [r, g, b]
    .map(x => x.toString(16).padStart(2, "0"))
    .join("")
}

export const extractColors = async (imageFile: File, numColors: number = 6): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")
        if (!ctx) {
          reject(new Error("Could not get canvas context"))
          return
        }

        const maxSize = 100
        const scale = Math.min(maxSize / img.width, maxSize / img.height)
        canvas.width = img.width * scale
        canvas.height = img.height * scale

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const colors = quantize(imageData.data, numColors)
        resolve(colors)
      }
      img.onerror = () => reject(new Error("Failed to load image"))
      img.src = e.target?.result as string
    }
    reader.onerror = () => reject(new Error("Failed to read file"))
    reader.readAsDataURL(imageFile)
  })
} 