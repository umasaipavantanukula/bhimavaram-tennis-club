# Highlights Video Upload & YouTube Integration Guide

## ✅ Features Implemented

### 1. Video Upload to Firebase Storage
- ✅ Upload videos directly from admin panel
- ✅ Support for MP4, WebM, AVI, MOV formats
- ✅ Maximum file size: 100MB
- ✅ Automatic thumbnail generation support
- ✅ Progress indicators during upload

### 2. YouTube Link Integration
- ✅ Add YouTube video links as alternative to file upload
- ✅ Support for multiple YouTube URL formats:
  - `https://www.youtube.com/watch?v=VIDEO_ID`
  - `https://youtu.be/VIDEO_ID`
- ✅ Automatic embedding with proper iframe
- ✅ Links stored in Firebase Firestore

### 3. Database Structure
The `highlights` collection in Firestore now includes:
```javascript
{
  title: "Match Title",
  description: "Match description",
  videoUrl: "https://firebasestorage.../video.mp4", // For uploaded videos
  youtubeUrl: "https://www.youtube.com/watch?v=...", // For YouTube links
  thumbnailUrl: "https://firebasestorage.../thumbnail.jpg",
  imageUrls: [],
  players: ["Player 1", "Player 2"],
  matchType: "tournament", // or "championship", "friendly", "training"
  date: Timestamp,
  featured: false,
  createdAt: Timestamp
}
```

## 🔧 Setup Instructions

### Step 1: Apply CORS Configuration to Firebase Storage

The video upload requires proper CORS configuration. Follow these steps:

#### Option A: Using Google Cloud Console (Easiest)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select project: `bhimavaramtennis`
3. Navigate to **Cloud Storage** → **Browser**
4. Click on your bucket: `bhimavaramtennis.firebasestorage.app`
5. Go to **Configuration** tab
6. Scroll to **CORS configuration**
7. Click **Edit CORS**
8. Paste this JSON:

```json
[
  {
    "origin": [
      "http://localhost:3000",
      "http://localhost:3001",
      "https://bhimavaram-tennis-club.vercel.app",
      "https://*.vercel.app"
    ],
    "method": ["GET", "POST", "PUT", "DELETE", "HEAD", "OPTIONS"],
    "responseHeader": [
      "Content-Type",
      "Content-Length",
      "Access-Control-Allow-Origin",
      "Access-Control-Allow-Headers",
      "Access-Control-Allow-Methods"
    ],
    "maxAgeSeconds": 3600
  }
]
```

9. Click **Save**

#### Option B: Using gsutil Command Line

```bash
# Install Google Cloud SDK if needed
# Then run:
gcloud auth login
gcloud config set project bhimavaramtennis
gsutil cors set firebase-cors-config.json gs://bhimavaramtennis.firebasestorage.app
```

### Step 2: Verify Storage Rules

The Firebase Storage rules have been updated in `storage.rules`. Deploy them:

```bash
firebase deploy --only storage
```

Or verify in Firebase Console:
1. Go to Firebase Console → Storage → Rules
2. Ensure these rules are active:

```
match /highlights/videos/{videoId} {
  allow read: if true;
  allow write: if request.auth != null
             && request.resource.size < 100 * 1024 * 1024
             && request.resource.contentType.matches('video/.*');
  allow delete: if request.auth != null;
}
```

### Step 3: Test Video Upload

1. Login to admin panel at `/admin`
2. Go to **Manage Highlights**
3. Click **Add Highlight**
4. Fill in the form:
   - **Title**: Test Match
   - **Description**: Test description
   - **Players**: Player1, Player2
   - **Date**: Select date
   - **Match Type**: Tournament
   
5. **For Video Upload**:
   - Click "Choose Video" button
   - Select a video file (max 100MB)
   - Wait for upload progress
   - ✅ Success message should appear

6. **For YouTube Link**:
   - Paste YouTube URL in "YouTube Video URL" field
   - Example: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
   - ✅ Blue indicator shows "YouTube video will be embedded"

### Step 4: Verify on Highlights Page

1. Go to `/highlights` page
2. Find your newly added highlight
3. Click the play button
4. Video should play in embedded player

## 🎥 Usage Guide

### Adding a Highlight with Video Upload

1. **Login** to admin panel
2. Navigate to **Highlights Manager**
3. Click **Add Highlight**
4. Fill in all required fields
5. Upload thumbnail image (optional)
6. **Choose Video** - Select video file from computer
7. Wait for upload completion (progress shown)
8. Click **Save Highlight**

### Adding a Highlight with YouTube Link

1. **Login** to admin panel
2. Navigate to **Highlights Manager**
3. Click **Add Highlight**
4. Fill in all required fields
5. Upload thumbnail image (optional)
6. **Paste YouTube URL** in the "YouTube Video URL" field
7. Click **Save Highlight**

### Priority: YouTube vs Uploaded Video

- If **both** `youtubeUrl` and `videoUrl` are provided, **YouTube link takes priority**
- This allows you to switch from uploaded video to YouTube without deleting the file

## 🐛 Troubleshooting

### Video Upload Fails with CORS Error

**Symptoms:**
```
Access to XMLHttpRequest has been blocked by CORS policy
POST https://firebasestorage.googleapis.com/... net::ERR_FAILED
```

**Solution:**
1. Apply CORS configuration (see Step 1 above)
2. Clear browser cache (Ctrl+Shift+R)
3. Try upload again

### Video Shows But Won't Play

**Possible Causes:**
1. **File size too large**: Reduce video size to under 100MB
2. **Unsupported format**: Convert to MP4 (H.264 codec)
3. **Browser compatibility**: Try different browser

**Solution:**
```bash
# Convert video using ffmpeg
ffmpeg -i input.mov -vcodec h264 -acodec aac output.mp4
```

### YouTube Video Not Embedding

**Check URL Format:**
- ✅ Valid: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
- ✅ Valid: `https://youtu.be/dQw4w9WgXcQ`
- ❌ Invalid: `https://www.youtube.com/user/...`

**Ensure Public Access:**
- Video must not be private
- Video must allow embedding

### Authentication Required Error

**Solution:**
1. Verify you're logged in as admin
2. Check Firebase Authentication in console
3. Ensure storage rules allow authenticated writes

## 📊 Storage Limits

### Firebase Storage Free Tier (Spark Plan)
- **Storage**: 5 GB
- **Downloads**: 1 GB/day
- **Uploads**: 1 GB/day

### Recommendations
- Use YouTube links for long videos (saves storage)
- Compress videos before upload
- Delete old highlights to free space
- Consider upgrading to Blaze plan for production

### Video Optimization Tips

```bash
# Compress video to 720p
ffmpeg -i input.mp4 -vf scale=-2:720 -c:v libx264 -crf 23 -preset medium output.mp4

# Reduce file size
ffmpeg -i input.mp4 -c:v libx264 -crf 28 -c:a aac -b:a 128k output.mp4

# Convert to WebM
ffmpeg -i input.mp4 -c:v libvpx-vp9 -crf 30 -b:v 0 output.webm
```

## 🎯 Best Practices

1. **Use YouTube for Long Videos**: Videos > 50MB should be uploaded to YouTube
2. **Upload Thumbnail**: Always provide a custom thumbnail for better UX
3. **Compress Videos**: Use video compression tools before upload
4. **Test Before Publishing**: Use "Featured" checkbox to highlight important matches
5. **Descriptive Titles**: Use clear titles like "Finals: Player A vs Player B - Tournament 2025"

## 📁 File Structure

```
components/
  admin/
    highlights-manager.tsx    # Admin UI for managing highlights
app/
  highlights/
    page.tsx                  # Public highlights page
lib/
  firebase-operations.ts      # Firebase CRUD operations
  
Database Collections:
  highlights/
    - Stores all highlight metadata
    - Includes videoUrl and youtubeUrl fields
    
Storage Buckets:
  highlights/videos/          # Uploaded video files
  highlights/thumbnails/      # Thumbnail images
```

## 🔐 Security Notes

1. **Authentication Required**: Only authenticated admin users can upload
2. **File Size Validation**: Max 100MB enforced on both client and server
3. **File Type Validation**: Only video/* mime types accepted
4. **Storage Rules**: Write access requires authentication
5. **Read Access**: Public read for all uploaded content

## 🚀 Future Enhancements

- [ ] Add support for Vimeo links
- [ ] Video preview before upload
- [ ] Automatic video compression
- [ ] Batch upload multiple videos
- [ ] Video playback analytics
- [ ] Subtitle/caption support
- [ ] Live streaming integration

## 📞 Support

If you encounter issues:
1. Check browser console for errors (F12)
2. Verify CORS configuration is applied
3. Check Firebase Storage quota
4. Review authentication status
5. Test with smaller video files first

---

**Last Updated**: October 16, 2025
**Version**: 1.0.0
