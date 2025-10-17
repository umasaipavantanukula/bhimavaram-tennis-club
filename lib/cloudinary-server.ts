import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary (server-side only)
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Video upload function for highlights (server-side only)
export const uploadHighlightVideo = async (file: File): Promise<string> => {
  try {
    // Convert file to base64
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const base64File = buffer.toString('base64')

    // Upload to Cloudinary with video-specific settings
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        `data:video/${file.type.split('/')[1]};base64,${base64File}`,
        {
          resource_type: 'video', // Explicitly set as video
          folder: 'tennis-highlights', // Organize videos in highlights folder
          public_id: `highlight_${Date.now()}`, // Unique identifier
          quality: 'auto', // Automatic quality optimization
          format: 'mp4', // Convert to MP4 for better compatibility
          video_codec: 'h264', // Use H.264 codec for broad compatibility
          audio_codec: 'aac', // Use AAC audio codec
          transformation: [
            {
              quality: 'auto:good', // Good quality with automatic optimization
              video_codec: 'h264',
              audio_codec: 'aac',
              format: 'mp4'
            }
          ]
        },
        (error: any, result: any) => {
          if (error) {
            console.error('Cloudinary upload error:', error)
            reject(error)
          } else {
            console.log('Cloudinary upload success:', result?.secure_url)
            resolve(result)
          }
        }
      )
    })

    return (result as any).secure_url
  } catch (error) {
    console.error('Error uploading video to Cloudinary:', error)
    throw new Error('Failed to upload video to Cloudinary')
  }
}

// Delete video from Cloudinary (server-side only)
export const deleteHighlightVideo = async (videoUrl: string): Promise<void> => {
  try {
    // Extract public ID from URL
    const publicId = extractPublicIdFromUrl(videoUrl)
    if (!publicId) throw new Error('Could not extract public ID from URL')

    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: 'video'
    })

    if (result.result !== 'ok') {
      throw new Error(`Failed to delete video: ${result.result}`)
    }
  } catch (error) {
    console.error('Error deleting video:', error)
    throw error
  }
}

// Helper function to extract public ID from Cloudinary URL
const extractPublicIdFromUrl = (url: string): string | null => {
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.\w+$/)
  return match ? match[1] : null
}

export default cloudinary