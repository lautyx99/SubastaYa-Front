// src/api/uploadService.js

export const subirImagenACloudinary = async (file) => {
  const cloudName = "dgvjgbd69"; // Reemplaza con tu Cloud Name
  const uploadPreset = "subastaya_preset"; // Reemplaza con el nombre de tu Preset unsigned

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "Error al subir la imagen a Cloudinary");
    }

    // Retorna la URL pública y segura de la imagen ya alojada
    return data.secure_url;
  } catch (error) {
    console.error("Error en uploadService:", error);
    throw error;
  }
};