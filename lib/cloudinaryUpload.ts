/**
 * Uploads an image file to Cloudinary using an unsigned upload preset.
 * @param file - The image file to upload.
 * @returns Promise<string> - The secure URL of the uploaded image.
 * @throws Error if the configuration is missing, the file is too large, or the upload fails.
 */
export async function uploadImageToCloudinary(file: File): Promise<string> {
  // --- Configuration Check ---
  // Ensure that the necessary Cloudinary environment variables are set.
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    console.error('Cloudinary configuration is missing from environment variables.');
    throw new Error('Server configuration error: Image upload is not available.');
  }

  // --- File Validation ---
  // FIX: Added a file size check to prevent users from uploading excessively large files.
  // 10MB limit is a reasonable default.
  const MAX_FILE_SIZE_MB = 10;
  if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
    throw new Error(`File is too large. Please upload an image under ${MAX_FILE_SIZE_MB}MB.`);
  }

  // --- FormData Preparation ---
  // Create a FormData object to send the file and upload preset to Cloudinary.
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);

  // --- API Request ---
  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    const data = await response.json();

    // --- Error Handling ---
    // FIX: Improved error handling to provide more specific feedback.
    if (!response.ok) {
      // If the response is not OK, throw an error with the message from Cloudinary.
      const errorMessage = data.error?.message || `Failed to upload image (HTTP ${response.status})`;
      throw new Error(errorMessage);
    }

    if (!data.secure_url) {
        // If the response is OK but the secure_url is missing.
        throw new Error('Upload was successful, but no secure URL was returned.');
    }

    return data.secure_url;
  } catch (error) {
    // Log the detailed error for debugging purposes.
    console.error('Cloudinary upload error:', error);
    
    // Re-throw a more user-friendly error to the form.
    // The specific error from the try block will be caught and re-thrown here.
    throw new Error(`Image upload failed. ${error instanceof Error ? error.message : 'Please try again.'}`);
  }
}
