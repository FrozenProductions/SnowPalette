import { RGB, LAB, ColorCluster, ExtractColorsOptions } from "../types/colorExtractor"

const DEFAULT_OPTIONS: ExtractColorsOptions = {
  minColors: 1,
  maxColors: 12,
  targetColors: 6
}

/**
 * Converts an RGB color to a LAB color.
 * @param rgb - The RGB color to convert.
 * @returns The LAB color.
 */
const rgbToLab = (rgb: RGB): LAB => {
  let r = rgb.r / 255
  let g = rgb.g / 255
  let b = rgb.b / 255

  r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92
  g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92
  b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92

  r *= 100
  g *= 100
  b *= 100

  const x = r * 0.4124 + g * 0.3576 + b * 0.1805
  const y = r * 0.2126 + g * 0.7152 + b * 0.0722
  const z = r * 0.0193 + g * 0.1192 + b * 0.9505

  const xn = 95.047
  const yn = 100
  const zn = 108.883

  const xx = x / xn
  const yy = y / yn
  const zz = z / zn

  const fx = xx > 0.008856 ? Math.pow(xx, 1 / 3) : (7.787 * xx) + 16 / 116
  const fy = yy > 0.008856 ? Math.pow(yy, 1 / 3) : (7.787 * yy) + 16 / 116
  const fz = zz > 0.008856 ? Math.pow(zz, 1 / 3) : (7.787 * zz) + 16 / 116

  return {
    l: Math.max(0, (116 * fy) - 16),
    a: 500 * (fx - fy),
    b: 200 * (fy - fz)
  }
}

/**
 * Converts a LAB color to an RGB color.
 * @param lab - The LAB color to convert.
 * @returns The RGB color.
 */
const labToRgb = (lab: LAB): RGB => {
  let y = (lab.l + 16) / 116
  let x = lab.a / 500 + y
  let z = y - lab.b / 200

  const y3 = Math.pow(y, 3)
  const x3 = Math.pow(x, 3)
  const z3 = Math.pow(z, 3)

  y = y3 > 0.008856 ? y3 : (y - 16 / 116) / 7.787
  x = x3 > 0.008856 ? x3 : (x - 16 / 116) / 7.787
  z = z3 > 0.008856 ? z3 : (z - 16 / 116) / 7.787

  x *= 95.047
  y *= 100
  z *= 108.883

  x /= 100
  y /= 100
  z /= 100

  let r = x * 3.2406 + y * -1.5372 + z * -0.4986
  let g = x * -0.9689 + y * 1.8758 + z * 0.0415
  let b = x * 0.0557 + y * -0.2040 + z * 1.0570

  r = r > 0.0031308 ? 1.055 * Math.pow(r, 1 / 2.4) - 0.055 : 12.92 * r
  g = g > 0.0031308 ? 1.055 * Math.pow(g, 1 / 2.4) - 0.055 : 12.92 * g
  b = b > 0.0031308 ? 1.055 * Math.pow(b, 1 / 2.4) - 0.055 : 12.92 * b

  return {
    r: Math.max(0, Math.min(255, Math.round(r * 255))),
    g: Math.max(0, Math.min(255, Math.round(g * 255))),
    b: Math.max(0, Math.min(255, Math.round(b * 255)))
  }
}

/**
 * Converts an RGB color to a hex color.
 * @param rgb - The RGB color to convert.
 * @returns The hex color.
 */
const rgbToHex = (rgb: RGB): string => {
  return "#" + [rgb.r, rgb.g, rgb.b]
    .map(x => x.toString(16).padStart(2, "0"))
    .join("")
}

/**
 * Calculates the Euclidean distance between two LAB colors.
 * @param a - The first LAB color.
 * @param b - The second LAB color.
 * @returns The distance between the two colors.
 */
const distance = (a: LAB, b: LAB): number => {
  const dl = a.l - b.l
  const da = a.a - b.a
  const db = a.b - b.b
  return Math.sqrt(dl * dl + da * da + db * db)
}

/**
 * Calculates the centroid of a set of LAB colors.
 * @param points - The LAB colors to calculate the centroid for.
 * @returns The centroid of the colors.
 */
const calculateCentroid = (points: LAB[]): LAB => {
  const sum = points.reduce((acc, point) => ({
    l: acc.l + point.l,
    a: acc.a + point.a,
    b: acc.b + point.b
  }), { l: 0, a: 0, b: 0 })

  return {
    l: sum.l / points.length,
    a: sum.a / points.length,
    b: sum.b / points.length
  }
}

/**
 * Performs k-means clustering on a set of LAB colors.
 * @param points - The LAB colors to cluster.
 * @param k - The number of clusters to create.
 * @param maxIterations - The maximum number of iterations to perform.
 * @returns The clusters found by the k-means algorithm.
 */
const kMeans = (points: LAB[], k: number, maxIterations: number = 50): ColorCluster[] => {
  if (points.length === 0) return []
  if (points.length <= k) {
    return points.map(point => ({
      centroid: point,
      points: [point],
      weight: 1
    }))
  }

  let centroids = points
    .sort(() => Math.random() - 0.5)
    .slice(0, k)
    .map(point => ({ ...point }))

  let clusters: ColorCluster[] = []
  let iterations = 0
  let hasChanged = true

  while (hasChanged && iterations < maxIterations) {
    clusters = centroids.map(centroid => ({
      centroid,
      points: [],
      weight: 0
    }))

    points.forEach(point => {
      let minDistance = Infinity
      let closestClusterIndex = 0

      centroids.forEach((centroid, index) => {
        const dist = distance(point, centroid)
        if (dist < minDistance) {
          minDistance = dist
          closestClusterIndex = index
        }
      })

      clusters[closestClusterIndex].points.push(point)
    })

    hasChanged = false

    clusters.forEach((cluster, i) => {
      if (cluster.points.length > 0) {
        const newCentroid = calculateCentroid(cluster.points)
        if (distance(newCentroid, centroids[i]) > 0.1) {
          centroids[i] = newCentroid
          hasChanged = true
        }
      }
    })

    iterations++
  }

  return clusters.filter(cluster => cluster.points.length > 0)
    .map(cluster => ({
      ...cluster,
      weight: cluster.points.length
    }))
}

/**
 * Quantizes an image by extracting colors from the image data.
 * @param pixels - The image data to extract colors from.
 * @param options - The options for the color extraction.
 * @returns The colors extracted from the image.
 */
const quantize = (pixels: Uint8ClampedArray, options: ExtractColorsOptions): string[] => {
  const points: LAB[] = []
  const seen: Set<string> = new Set()

  for (let i = 0; i < pixels.length; i += 4) {
    const rgb: RGB = {
      r: pixels[i],
      g: pixels[i + 1],
      b: pixels[i + 2]
    }

    const key = `${rgb.r},${rgb.g},${rgb.b}`
    if (!seen.has(key)) {
      seen.add(key)
      points.push(rgbToLab(rgb))
    }
  }

  const numColors = Math.min(
    Math.max(options.minColors, Math.min(points.length, options.targetColors)),
    options.maxColors
  )

  const clusters = kMeans(points, numColors)
    .sort((a, b) => b.weight - a.weight)

  return clusters.map(cluster => {
    const rgb = labToRgb(cluster.centroid)
    return rgbToHex(rgb)
  })
}

/**
 * Extracts colors from an image file.
 * @param imageFile - The image file to extract colors from.
 * @param options - The options for the color extraction.
 * @returns The colors extracted from the image.
 */
export const extractColors = async (
  imageFile: File,
  options: Partial<ExtractColorsOptions> = {}
): Promise<string[]> => {
  const finalOptions: ExtractColorsOptions = {
    ...DEFAULT_OPTIONS,
    ...options,
    minColors: Math.max(1, options.minColors || DEFAULT_OPTIONS.minColors),
    maxColors: Math.min(12, options.maxColors || DEFAULT_OPTIONS.maxColors)
  }

  if (finalOptions.targetColors < finalOptions.minColors) {
    finalOptions.targetColors = finalOptions.minColors
  }
  if (finalOptions.targetColors > finalOptions.maxColors) {
    finalOptions.targetColors = finalOptions.maxColors
  }

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

        const maxSize = 150
        const scale = Math.min(maxSize / img.width, maxSize / img.height)
        canvas.width = img.width * scale
        canvas.height = img.height * scale

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const colors = quantize(imageData.data, finalOptions)
        resolve(colors)
      }
      img.onerror = () => reject(new Error("Failed to load image"))
      img.src = e.target?.result as string
    }
    reader.onerror = () => reject(new Error("Failed to read file"))
    reader.readAsDataURL(imageFile)
  })
} 