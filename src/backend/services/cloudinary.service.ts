import { envConfig } from '../../config/env.config';

/**
 * Cloudinary Media Management Service
 * Handles image uploads to the Cloudinary cloud
 */

interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
  format: string;
}

export const CloudinaryService = {
  /**
   * Upload an image to Cloudinary
   * @param file - The file to upload
   * @param preset - The upload preset (must be unsigned for client-side uploads)
   */
  uploadImage: async (file: File, preset = 'sam_b_tech_unsigned'): Promise<CloudinaryUploadResponse> => {
    const cloudName = envConfig.cloudinaryCloudName;
    if (!cloudName) {
      throw new Error('Cloudinary Cloud Name is not configured. Please check your .env file.');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', preset);
    formData.append('folder', envConfig.cloudinaryFolder);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to upload image to Cloudinary');
      }

      return await response.json();
    } catch (error: any) {
      console.error('Cloudinary upload error:', error);
      throw new Error(`Cloudinary upload failed: ${error.message}`);
    }
  }
};

export default CloudinaryService;
