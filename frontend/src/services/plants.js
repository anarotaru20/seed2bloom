const API_URL = import.meta.env.VITE_API_URL

const authHeaders = () => {
  const token = localStorage.getItem('jwt')
  return { Authorization: `Bearer ${token}` }
}

export async function getMyPlants() {
  const res = await fetch(`${API_URL}/plants`, {
    headers: { ...authHeaders() },
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Failed to fetch plants')
  return data.plants || []
}

export async function updateMyPlant(id, payload) {
  const res = await fetch(`${API_URL}/plants/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(payload),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Failed to update plant')
  return data.plant
}

export async function deleteMyPlant(id) {
  const res = await fetch(`${API_URL}/plants/${id}`, {
    method: 'DELETE',
    headers: { ...authHeaders() },
  })
  if (res.status === 204) return true
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message || 'Failed to delete plant')
  return true
}

export async function addMyPlant(payload) {
  const res = await fetch(`${API_URL}/plants`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(payload),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Failed to add plant')
  return data.plant
}
