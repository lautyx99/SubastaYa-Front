import apiClient from './client'

export const getBilletera = async (usuarioId) => {
  const { data } = await apiClient.get('/Billetera', {
    params: { usuarioId },
  })
  return data
}

export const getMovimientos = async (billeteraId) => {
  const { data } = await apiClient.get(`/Billetera/${billeteraId}/transacciones`)
  return data
}

export const depositarSaldo = async ({ usuarioId, monto }) => {
  const { data } = await apiClient.post('/Billetera/deposito', {
    usuarioId: Number(usuarioId),
    monto: Number(monto),
  })
  // Si tu DepositoDto usa PascalCase y no camelCase:
  // { UsuarioId: Number(usuarioId), Monto: Number(monto) }
  return data
}