import { ShareData } from "../types/share"

export const encodeShareData = (data: ShareData): string => {
  const jsonString = JSON.stringify(data)
  return btoa(encodeURIComponent(jsonString))
}

export const decodeShareData = (encoded: string): ShareData | null => {
  try {
    const jsonString = decodeURIComponent(atob(encoded))
    return JSON.parse(jsonString) as ShareData
  } catch (err) {
    console.error("Failed to decode share data:", err)
    return null
  }
} 