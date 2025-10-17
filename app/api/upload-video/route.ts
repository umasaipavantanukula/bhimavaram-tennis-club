import { NextRequest, NextResponse } from 'next/server'
import { uploadHighlightVideo } from '@/lib/cloudinary-server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('video') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No video file provided' }, 
        { status: 400 }
      )
    }

    // Validate file type (only videos)
    if (!file.type.startsWith('video/')) {
      return NextResponse.json(
        { error: 'File must be a video' }, 
        { status: 400 }
      )
    }

    // Validate file size (max 100MB for videos)
    const maxSize = 100 * 1024 * 1024 // 100MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'Video file too large. Maximum size is 100MB' }, 
        { status: 400 }
      )
    }

    // Upload to Cloudinary
    const videoUrl = await uploadHighlightVideo(file)

    return NextResponse.json({ 
      success: true, 
      videoUrl,
      message: 'Video uploaded successfully to Cloudinary' 
    })
  } catch (error) {
    console.error('Video upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload video' }, 
      { status: 500 }
    )
  }
}

// Handle preflight requests for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}