export const getToken = () => localStorage.getItem('token')

export const getUserId = () => {
  const id = Number(localStorage.getItem('userId'))
  return Number.isFinite(id) && id > 0 ? id : null
}

export const getUserRol = () => {
  const valor = localStorage.getItem('userRol');
  if (!valor) return '';

  try {
    const parsed = JSON.parse(valor);
    if (typeof parsed === 'object' && parsed !== null) {
      return parsed.nombre || parsed.authority || parsed.name || '';
    }
  } catch (e) {

  }

  if (valor === '[object Object]') {
    return '';
  }

  return valor;
};

export const isComprador = () => getUserRol().toLowerCase() === 'comprador'

export const isVendedor = () => {
  const rol = getUserRol();
  return rol.toLowerCase() === 'vendedor' || rol.toLowerCase() === 'admin';
};

export const isAdmin = () => {
  const rol = getUserRol();
  if (!rol) return false;
  
  const rolStr = rol.toString().toLowerCase();
  return rolStr === 'administrador' || rolStr === 'admin' || rolStr === '3';
};


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



// ==========================================
// NUEVO: Wrapper para peticiones con control de 401 (Expiración de Token)
// ==========================================
export const fetchWithAuth = async (url, options = {}) => {
  const token = getToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });


  if (response.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRol');

    window.location.href = '/login'; 
    
    throw new Error('La sesión ha expirado. Por favor, inicia sesión nuevamente.');
  }

  return response;
};