// Alternative upload service using Cloudinary
// This bypasses Firebase Storage completely

const CLOUDINARY_UPLOAD_URL = "https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload"
const CLOUDINARY_UPLOAD_PRESET = "YOUR_UPLOAD_PRESET" // Unsigned preset

export const cloudinaryUpload = {
  async uploadImage(file: File, folder: string): Promise<string> {
    try {
      console.log("[Cloudinary] Starting upload:", file.name)
      
      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)
      formData.append('folder', folder)
      
      const response = await fetch(CLOUDINARY_UPLOAD_URL, {
        method: 'POST',
        body: formData
      })
      
      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`)
      }
      
      const result = await response.json()
      console.log("[Cloudinary] Upload successful:", result.secure_url)
      
      return result.secure_url
    } catch (error: any) {
      console.error("[Cloudinary] Upload error:", error)
      throw new Error(`Upload failed: ${error.message}`)
    }
  }
}

// To use this, replace uploadOperations in firebase-operations.ts:
// import { cloudinaryUpload } from './cloudinary-upload'
// 
// export const uploadOperations = {
//   uploadImage: cloudinaryUpload.uploadImage,
//   deleteImage: async () => {} // Implement if needed
// }