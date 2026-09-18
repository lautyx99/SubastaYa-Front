import axios from 'axios';

// Asegúrate de que la URL coincida con la ruta base de tu backend
const API_URL = 'http://localhost:55976/api/categoria'; // Ajusta el puerto si tu backend corre en otro (ej: 5163, 7000, etc.)

export const getCategorias = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error al obtener las categorías:', error);
    throw error;
  }
};