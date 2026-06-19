import imageCompression from 'browser-image-compression';

// 1. Compress Image (Make it small enough for the database)
export const compressImage = async (file) => {
  const options = {
    maxSizeMB: 0.1, // Very aggressive compression (100KB)
    maxWidthOrHeight: 600,
    useWebWorker: true
  };

  try {
    return await imageCompression(file, options);
  } catch (error) {
    console.error("Compression error:", error);
    return file; 
  }
};

// 2. Convert to Base64 (The important part)
export const uploadImageToStorage = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) return resolve(""); // Return empty string if no file

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        console.log("Image converted to text! Length:", reader.result.length); // Debugging Log
        resolve(reader.result);
    };
    reader.onerror = (error) => reject(error);
  });
};