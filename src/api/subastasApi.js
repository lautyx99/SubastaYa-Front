import apiClient from './client';


export const getSubastas = async () => {
  const { data } = await apiClient.get('/subasta');
  return data;
};


export const getSubastasActivas = async () => {
  const { data } = await apiClient.get('/subasta/activas');
  return data;
};

export const getSubastasProximas = async () => {
  const { data } = await apiClient.get('/subasta/proximas');
  return data;
};

export const getSubastaById = async (id) => {
  const { data } = await apiClient.get(`/subasta/${id}`);
  return data;
};


export const createSubasta = async (subasta) => {
  const { data } = await apiClient.post('/subasta', subasta);
  return data;
};

export const deleteSubasta = async(id) => {
    const {data} = await apiClient.delete(`/subasta/${id}`);
    return data;
  };
