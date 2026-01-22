const BASE_URL = import.meta.env.VITE_API_URL

export async function fetchPlantCatalog() {
  const res = await fetch(`${BASE_URL}/plants/plant-catalog`)
  if (!res.ok) throw new Error("Failed to load plant catalog")
  const data = await res.json()
  return data.items || []
}
