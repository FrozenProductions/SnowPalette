import { ColorValue } from "../types/colors"

type ColorRange = {
  name: string
  hueRange: [number, number]
  additionalTerms?: string[]
  specialCases?: {
    saturation: [number, number]
    lightness: [number, number]
    name: string
  }[]
}

const COLOR_RANGES: ColorRange[] = [
  {
    name: "Red",
    hueRange: [355, 10],
    additionalTerms: ["Ruby", "Crimson", "Scarlet", "Cardinal", "Maroon", "Wine", "Cherry", "Blood", "Fire", "Brick"],
    specialCases: [
      { saturation: [80, 100], lightness: [45, 55], name: "Pure Red" },
      { saturation: [70, 90], lightness: [30, 40], name: "Blood Red" },
      { saturation: [60, 80], lightness: [70, 85], name: "Rose Pink" }
    ]
  },
  {
    name: "Orange",
    hueRange: [10, 45],
    additionalTerms: ["Amber", "Coral", "Tangerine", "Rust", "Peach", "Apricot", "Copper", "Bronze", "Cinnamon", "Terracotta"],
    specialCases: [
      { saturation: [85, 100], lightness: [50, 60], name: "Pure Orange" },
      { saturation: [70, 90], lightness: [70, 85], name: "Peach" },
      { saturation: [60, 80], lightness: [30, 40], name: "Rust" }
    ]
  },
  {
    name: "Yellow",
    hueRange: [45, 70],
    additionalTerms: ["Gold", "Lemon", "Canary", "Sunshine", "Butter", "Honey", "Daffodil", "Banana", "Wheat", "Cream"],
    specialCases: [
      { saturation: [90, 100], lightness: [50, 60], name: "Pure Yellow" },
      { saturation: [80, 95], lightness: [40, 50], name: "Golden Yellow" },
      { saturation: [20, 40], lightness: [80, 90], name: "Cream" }
    ]
  },
  {
    name: "Lime",
    hueRange: [70, 150],
    additionalTerms: ["Chartreuse", "Sage", "Mint", "Olive", "Pistachio", "Fern", "Spring", "Grass", "Forest", "Moss"],
    specialCases: [
      { saturation: [85, 100], lightness: [45, 55], name: "Pure Lime" },
      { saturation: [30, 50], lightness: [30, 40], name: "Olive" },
      { saturation: [40, 60], lightness: [80, 90], name: "Mint" }
    ]
  },
  {
    name: "Green",
    hueRange: [150, 170],
    additionalTerms: ["Emerald", "Forest", "Jade", "Pine", "Shamrock", "Seaweed", "Basil", "Hunter", "Kelly", "Malachite"],
    specialCases: [
      { saturation: [85, 100], lightness: [45, 55], name: "Pure Green" },
      { saturation: [70, 90], lightness: [25, 35], name: "Forest Green" },
      { saturation: [50, 70], lightness: [70, 85], name: "Seafoam" }
    ]
  },
  {
    name: "Teal",
    hueRange: [170, 195],
    additionalTerms: ["Turquoise", "Aqua", "Cyan", "Ocean", "Sea", "Lagoon", "Marine", "Cerulean", "Arctic", "Aegean"],
    specialCases: [
      { saturation: [85, 100], lightness: [45, 55], name: "Pure Teal" },
      { saturation: [60, 80], lightness: [30, 40], name: "Deep Sea" },
      { saturation: [50, 70], lightness: [75, 85], name: "Aqua" }
    ]
  },
  {
    name: "Blue",
    hueRange: [195, 240],
    additionalTerms: ["Azure", "Sapphire", "Ocean", "Sky", "Denim", "Steel", "Arctic", "Cornflower", "Royal", "Lapis"],
    specialCases: [
      { saturation: [85, 100], lightness: [45, 55], name: "Pure Blue" },
      { saturation: [70, 90], lightness: [25, 35], name: "Deep Blue" },
      { saturation: [40, 60], lightness: [75, 85], name: "Sky Blue" }
    ]
  },
  {
    name: "Indigo",
    hueRange: [240, 280],
    additionalTerms: ["Royal", "Cobalt", "Navy", "Midnight", "Twilight", "Periwinkle", "Iris", "Ultramarine", "Cosmic", "Storm"],
    specialCases: [
      { saturation: [85, 100], lightness: [45, 55], name: "Pure Indigo" },
      { saturation: [70, 90], lightness: [20, 30], name: "Midnight Blue" },
      { saturation: [30, 50], lightness: [70, 85], name: "Periwinkle" }
    ]
  },
  {
    name: "Purple",
    hueRange: [280, 320],
    additionalTerms: ["Violet", "Amethyst", "Plum", "Lavender", "Mauve", "Grape", "Orchid", "Mulberry", "Heliotrope", "Thistle"],
    specialCases: [
      { saturation: [85, 100], lightness: [45, 55], name: "Pure Purple" },
      { saturation: [70, 90], lightness: [25, 35], name: "Royal Purple" },
      { saturation: [30, 50], lightness: [75, 85], name: "Lavender" }
    ]
  },
  {
    name: "Pink",
    hueRange: [320, 355],
    additionalTerms: ["Rose", "Magenta", "Fuchsia", "Salmon", "Bubblegum", "Blush", "Berry", "Cerise", "Hot Pink", "Flamingo"],
    specialCases: [
      { saturation: [85, 100], lightness: [45, 55], name: "Pure Pink" },
      { saturation: [70, 90], lightness: [65, 75], name: "Hot Pink" },
      { saturation: [20, 40], lightness: [75, 85], name: "Baby Pink" }
    ]
  }
]

const LIGHTNESS_TERMS = [
  { range: [0, 10], prefix: "Pitch", suffix: "Black" },
  { range: [10, 20], prefix: "Dark", suffix: "Shadow" },
  { range: [20, 30], prefix: "Deep", suffix: "" },
  { range: [30, 40], prefix: "Rich", suffix: "" },
  { range: [40, 45], prefix: "Dark", suffix: "" },
  { range: [45, 55], prefix: "", suffix: "" },
  { range: [55, 65], prefix: "Light", suffix: "" },
  { range: [65, 75], prefix: "Bright", suffix: "" },
  { range: [75, 85], prefix: "Pale", suffix: "" },
  { range: [85, 92], prefix: "Very Pale", suffix: "" },
  { range: [92, 100], prefix: "Pure", suffix: "White" }
]

const SATURATION_TERMS = [
  { range: [0, 5], term: "Neutral" },
  { range: [5, 15], term: "Gray" },
  { range: [15, 30], term: "Muted" },
  { range: [30, 45], term: "Soft" },
  { range: [45, 60], term: "" },
  { range: [60, 75], term: "Clear" },
  { range: [75, 85], term: "Bright" },
  { range: [85, 95], term: "Vibrant" },
  { range: [95, 100], term: "Pure" }
]

const METALLIC_COLORS = [
  { name: "Gold", hue: [45, 55], saturation: [70, 90], lightness: [50, 65] },
  { name: "Silver", hue: [0, 360], saturation: [0, 10], lightness: [70, 85] },
  { name: "Bronze", hue: [25, 35], saturation: [50, 70], lightness: [45, 60] },
  { name: "Copper", hue: [15, 25], saturation: [60, 80], lightness: [50, 65] },
  { name: "Steel", hue: [200, 220], saturation: [5, 15], lightness: [60, 75] }
]

const EARTH_TONES = [
  { name: "Sienna", hue: [20, 30], saturation: [50, 70], lightness: [30, 45] },
  { name: "Umber", hue: [25, 35], saturation: [40, 60], lightness: [20, 35] },
  { name: "Ochre", hue: [35, 45], saturation: [60, 80], lightness: [40, 55] },
  { name: "Khaki", hue: [45, 55], saturation: [30, 50], lightness: [60, 75] },
  { name: "Taupe", hue: [30, 40], saturation: [10, 30], lightness: [50, 65] }
]

const hexToHsl = (hex: string): [number, number, number] => {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0, s = 0, l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break
      case g: h = (b - r) / d + 2; break
      case b: h = (r - g) / d + 4; break
    }
    h /= 6
  }

  return [
    Math.round(h * 360),
    Math.round(s * 100),
    Math.round(l * 100)
  ]
}

const getColorRange = (hue: number): ColorRange => {
  return COLOR_RANGES.find(range => {
    const [min, max] = range.hueRange
    return (hue >= min && hue < max) || 
           (min > max && (hue >= min || hue < max))
  }) || COLOR_RANGES[0]
}

const getLightnessDescription = (lightness: number) => {
  return LIGHTNESS_TERMS.find(t => lightness >= t.range[0] && lightness < t.range[1]) || LIGHTNESS_TERMS[5]
}

const getSaturationDescription = (saturation: number) => {
  return SATURATION_TERMS.find(t => saturation >= t.range[0] && saturation < t.range[1]) || SATURATION_TERMS[4]
}

const checkSpecialColor = (hue: number, saturation: number, lightness: number) => {
  const metallic = METALLIC_COLORS.find(m => {
    const [minH, maxH] = m.hue
    const [minS, maxS] = m.saturation
    const [minL, maxL] = m.lightness
    return (hue >= minH && hue < maxH || (minH > maxH && (hue >= minH || hue < maxH))) &&
           saturation >= minS && saturation < maxS &&
           lightness >= minL && lightness < maxL
  })
  if (metallic) return metallic.name

  const earthTone = EARTH_TONES.find(e => {
    const [minH, maxH] = e.hue
    const [minS, maxS] = e.saturation
    const [minL, maxL] = e.lightness
    return hue >= minH && hue < maxH &&
           saturation >= minS && saturation < maxS &&
           lightness >= minL && lightness < maxL
  })
  if (earthTone) return earthTone.name

  return null
}

export const generateColorName = (colorValue: ColorValue): string => {
  if (typeof colorValue === "object") {
    return "Gradient"
  }

  const [hue, saturation, lightness] = hexToHsl(colorValue)

  const specialColor = checkSpecialColor(hue, saturation, lightness)
  if (specialColor) return specialColor

  if (lightness < 5) return "Pitch Black"
  if (lightness > 97) return "Pure White"
  
  if (saturation < 15) {
    const grayTone = getLightnessDescription(lightness)
    if (saturation < 5) {
      return `${grayTone.prefix || "Pure"} Gray`
    }
    return `${grayTone.prefix || ""} Gray`.trim()
  }

  const colorRange = getColorRange(hue)
  const lightnessDesc = getLightnessDescription(lightness)
  const saturationDesc = getSaturationDescription(saturation)

  const specialCase = colorRange.specialCases?.find(sc => 
    saturation >= sc.saturation[0] && saturation < sc.saturation[1] &&
    lightness >= sc.lightness[0] && lightness < sc.lightness[1]
  )
  if (specialCase) return specialCase.name

  const additionalTerm = colorRange.additionalTerms?.[
    Math.floor(Math.random() * (colorRange.additionalTerms.length * 0.7))
  ]

  let name = ""
  if (lightnessDesc.prefix) name += lightnessDesc.prefix + " "
  if (saturationDesc.term) name += saturationDesc.term + " "
  name += additionalTerm || colorRange.name
  if (lightnessDesc.suffix) name += " " + lightnessDesc.suffix

  return name.trim()
} 