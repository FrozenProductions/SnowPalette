export type RGB = {
  r: number
  g: number
  b: number
}

export type LAB = {
  l: number
  a: number
  b: number
}

export type ColorCluster = {
  centroid: LAB
  points: LAB[]
  weight: number
}

export type ExtractColorsOptions = {
  minColors: number
  maxColors: number
  targetColors: number
} 