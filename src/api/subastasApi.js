import apiClient from './client';

// Listar todas
export const getSubastas = async () => {
  const { data } = await apiClient.get('/subasta');
  return data;
};

// Solo activas (si tenés ese endpoint)
export const getSubastasActivas = async () => {
  const { data } = await apiClient.get('/subasta/activas');
  return data;
};

// Detalle por id
export const getSubastaById = async (id) => {
  const { data } = await apiClient.get(`/subasta/${id}`);
  return data;
};

// Crear (para más adelante)
export const createSubasta = async (subasta) => {
  const { data } = await apiClient.post('/subasta', subasta);
  return data;
};