export const subirImagenACloudinary = async (file) => {
  const cloudName = "dgvjgbd69"; 
  const uploadPreset = "subastaya_preset"; 

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

    return data.secure_url;
  } catch (error) {
    console.error("Error en uploadService:", error);
    throw error;
  }
};