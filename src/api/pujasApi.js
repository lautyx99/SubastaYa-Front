import apiClient from './client'

export const getPujasBySubasta = async (subastaId) => {
  const { data } = await apiClient.get(`/subastas/${subastaId}/pujas`)
  return data
}

// para más adelante
export const crearPuja = async ({ subastaId, monto }) => {
  const { data } = await apiClient.post('/subastas/${subastaId}/pujas', {
    subastaId,
    monto: Number(monto),
  })
  return data
}