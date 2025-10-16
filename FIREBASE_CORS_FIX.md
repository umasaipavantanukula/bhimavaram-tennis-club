# Fix Firebase Storage CORS Error

## Problem
Videos cannot be uploaded to Firebase Storage due to CORS policy blocking the requests.

## Solution
Apply the updated CORS configuration to your Firebase Storage bucket.

## Steps to Fix

### Method 1: Using Google Cloud Console (Recommended)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project: **bhimavaramtennis**
3. Navigate to **Cloud Storage** → **Browser**
4. Find your bucket: `bhimavaramtennis.firebasestorage.app`
5. Click on the bucket name
6. Go to the **Configuration** tab
7. Scroll to **CORS configuration**
8. Click **Edit CORS**
9. Paste the following JSON:

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

10. Click **Save**

### Method 2: Using gsutil Command Line

1. Install [Google Cloud SDK](https://cloud.google.com/sdk/docs/install) if you haven't
2. Authenticate: `gcloud auth login`
3. Set your project: `gcloud config set project bhimavaramtennis`
4. Apply CORS configuration:

```bash
gsutil cors set firebase-cors-config.json gs://bhimavaramtennis.firebasestorage.app
```

5. Verify the configuration:

```bash
gsutil cors get gs://bhimavaramtennis.firebasestorage.app
```

## Verification

After applying the CORS configuration:
1. Clear your browser cache
2. Try uploading a video again in the highlights page
3. The upload should now work without CORS errors

## Additional Firebase Storage Rules

Make sure your `storage.rules` file allows video uploads. Check that it includes:

```
allow read, write: if request.auth != null;
```

Or update to allow video files specifically:

```
match /highlights/videos/{videoId} {
  allow read: if true;
  allow write: if request.auth != null 
              && request.resource.size < 100 * 1024 * 1024  // 100MB limit
              && request.resource.contentType.matches('video/.*');
}
```

## Troubleshooting

If the error persists:
1. Check Firebase Storage Rules are properly set
2. Verify the bucket name is correct
3. Make sure you're authenticated in Firebase
4. Try using a smaller video file first (< 10MB)
5. Check browser console for any additional errors
