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

// Get video thumbnail - browser compatible version
export const getVideoThumbnail = (publicId: string): string => {
  return generateCloudinaryUrl(publicId, {
    resource_type: 'video',
    format: 'jpg',
    start_offset: '10%', // Take thumbnail at 10% of video duration
    quality: 'auto',
    width: 400,
    height: 225,
    crop: 'fill'
  })
}

// Get optimized video URL - browser compatible version
export const getVideoUrl = (publicId: string, quality: string = 'auto'): string => {
  return generateCloudinaryUrl(publicId, {
    resource_type: 'video',
    quality: quality,
    format: 'mp4',
    video_codec: 'h264',
    audio_codec: 'aac'
  })
}

// Helper function to extract public ID from Cloudinary URL
export const extractPublicIdFromUrl = (url: string): string | null => {
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.\w+$/)
  return match ? match[1] : null
}

// For server-side operations, these should be moved to API routes
// Upload and delete operations require the full SDK and should not run in browser