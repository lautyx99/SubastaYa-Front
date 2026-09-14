import apiClient from './client'

export const login = async ({ email, password }) => {
  const { data } = await apiClient.post('v1/auth/login', {
    email,
    password,
  })
  return data
  // esperamos algo como: { token, email, nombre, rol }
}