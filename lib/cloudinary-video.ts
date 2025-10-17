// Browser-compatible Cloudinary utilities
// For server-side operations, use the full SDK in API routes

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

// Browser-compatible URL generation
const generateCloudinaryUrl = (publicId: string, options: Record<string, any> = {}) => {
  const baseUrl = `https://res.cloudinary.com/${CLOUD_NAME}`
  const resourceType = options.resource_type || 'image'
  const transformations = []
  
  // Build transformation string
  if (options.width) transformations.push(`w_${options.width}`)
  if (options.height) transformations.push(`h_${options.height}`)
  if (options.crop) transformations.push(`c_${options.crop}`)
  if (options.quality) transformations.push(`q_${options.quality}`)
  if (options.format) transformations.push(`f_${options.format}`)
  if (options.start_offset) transformations.push(`so_${options.start_offset}`)
  if (options.video_codec) transformations.push(`vc_${options.video_codec}`)
  if (options.audio_codec) transformations.push(`ac_${options.audio_codec}`)
  
  const transformString = transformations.length > 0 ? transformations.join(',') + '/' : ''
  
  return `${baseUrl}/${resourceType}/upload/${transformString}${publicId}`
}

// Video upload function for highlights
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
              audio_codec: 'aac'
            }
          ],
          tags: ['tennis', 'highlights', 'match'] // Tags for organization
        },
        (error: any, result: any) => {
          if (error) reject(error)
          else resolve(result)
        }
      )
    })

    // Return the secure URL
    return (result as any).secure_url
  } catch (error) {
    console.error('Error uploading video to Cloudinary:', error)
    throw error
  }
}

// Delete video from Cloudinary
export const deleteHighlightVideo = async (publicId: string): Promise<boolean> => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: 'video'
    })
    return result.result === 'ok'
  } catch (error) {
    console.error('Error deleting video from Cloudinary:', error)
    return false
  }
}

// Get video transformation URL for different quality
export const getVideoUrl = (publicId: string, quality: 'auto' | 'low' | 'medium' | 'high' = 'auto'): string => {
  return cloudinary.url(publicId, {
    resource_type: 'video',
    quality: quality,
    format: 'mp4',
    video_codec: 'h264',
    audio_codec: 'aac'
  })
}

// Get video thumbnail
export const getVideoThumbnail = (publicId: string): string => {
  return cloudinary.url(publicId, {
    resource_type: 'video',
    format: 'jpg',
    start_offset: '10%', // Take thumbnail at 10% of video duration
    quality: 'auto',
    width: 400,
    height: 225,
    crop: 'fill'
  })
}

export default cloudinary