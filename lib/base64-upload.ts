// Temporary workaround: Store images as base64 in Firestore
// This works immediately without CORS issues

export const base64Upload = {
  async uploadImage(file: File, folder: string): Promise<string> {
    try {
      console.log("[Base64] Converting image:", file.name)
      
      // Validate file size (500KB max for base64 storage)
      if (file.size > 500 * 1024) {
        throw new Error("File too large for base64 storage. Please use an image under 500KB.")
      }
      
      // Convert to base64
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(file)
      })
      
      console.log("[Base64] Conversion successful")
      return base64
      
    } catch (error: any) {
      console.error("[Base64] Conversion error:", error)
      throw new Error(`Image processing failed: ${error.message}`)
    }
  },
  
  async deleteImage(url: string) {
    // No deletion needed for base64 - it's stored in Firestore
    console.log("[Base64] Delete not needed for base64 images")
  }
}

// To use this immediately:
// 1. Replace uploadOperations in firebase-operations.ts
// 2. Gallery images will be stored as base64 strings
// 3. Works immediately without any Firebase configuration