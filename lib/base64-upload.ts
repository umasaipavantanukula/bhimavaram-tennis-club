// Temporary workaround: Store images as base64 in Firestore
// This works immediately without CORS issues

export const base64Upload = {
  async uploadImage(file: File, folder: string): Promise<string> {
    try {
      console.log("[Base64] Processing image:", file.name, "Size:", (file.size / 1024).toFixed(2) + "KB")
      
      // Compress image if it's too large
      const compressedFile = await this.compressImage(file)
      console.log("[Base64] Compressed size:", (compressedFile.size / 1024).toFixed(2) + "KB")
      
      // Convert to base64
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(compressedFile)
      })
      
      console.log("[Base64] Conversion successful")
      return base64
      
    } catch (error: any) {
      console.error("[Base64] Conversion error:", error)
      throw new Error(`Image processing failed: ${error.message}`)
    }
  },

  async compressImage(file: File): Promise<File> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()
      
      img.onload = () => {
        try {
          // Calculate optimal dimensions for hero images
          let { width, height } = this.calculateOptimalSize(img.width, img.height)
          
          canvas.width = width
          canvas.height = height
          
          // Draw and compress
          ctx!.drawImage(img, 0, 0, width, height)
          
          // Try different quality levels until we get under 500KB
          let quality = 0.8
          let attempts = 0
          const maxAttempts = 5
          
          const tryCompress = () => {
            canvas.toBlob((blob) => {
              if (!blob) {
                reject(new Error("Failed to compress image"))
                return
              }
              
              console.log(`[Base64] Compression attempt ${attempts + 1}: Quality ${quality}, Size: ${(blob.size / 1024).toFixed(2)}KB`)
              
              if (blob.size <= 500 * 1024 || attempts >= maxAttempts) {
                // Success or max attempts reached
                const compressedFile = new File([blob], file.name, {
                  type: 'image/jpeg',
                  lastModified: Date.now()
                })
                resolve(compressedFile)
              } else {
                // Try with lower quality
                attempts++
                quality -= 0.15
                if (quality < 0.1) quality = 0.1
                tryCompress()
              }
            }, 'image/jpeg', quality)
          }
          
          tryCompress()
          
        } catch (error) {
          reject(error)
        }
      }
      
      img.onerror = () => reject(new Error("Failed to load image"))
      img.src = URL.createObjectURL(file)
    })
  },

  calculateOptimalSize(originalWidth: number, originalHeight: number): { width: number, height: number } {
    // For hero images, we want good quality but reasonable file size
    const maxWidth = 1920
    const maxHeight = 1080
    
    // Calculate aspect ratio
    const aspectRatio = originalWidth / originalHeight
    
    let width = originalWidth
    let height = originalHeight
    
    // Scale down if too large
    if (width > maxWidth) {
      width = maxWidth
      height = width / aspectRatio
    }
    
    if (height > maxHeight) {
      height = maxHeight
      width = height * aspectRatio
    }
    
    return {
      width: Math.round(width),
      height: Math.round(height)
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