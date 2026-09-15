export const getToken = () => localStorage.getItem('token')
export const getUserId = () => {
  const id = Number(localStorage.getItem('userId'))
  return Number.isFinite(id) && id > 0 ? id : null
}
export const getUserRol = () => localStorage.getItem('userRol') || ''

export const isComprador = () => getUserRol().toLowerCase() === 'comprador'
export const isVendedor = () => getUserRol().toLowerCase() === 'vendedor'
export const isAuthenticated = () => Boolean(getToken())

export function getRoleFromToken(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return (
      payload[
        'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
      ] ||
      payload.role ||
      payload.rol ||
      null
    )
  } catch {
    return null
  }
}

export function getUserIdFromToken(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return (
      payload[
        'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'
      ] ||
      payload.nameid ||
      payload.sub ||
      null
    )
  } catch {
    return null
  }
}