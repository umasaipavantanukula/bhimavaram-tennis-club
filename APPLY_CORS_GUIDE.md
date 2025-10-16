# Apply CORS Configuration to Firebase Storage

## Method 1: Google Cloud Console (EASIEST - RECOMMENDED)

### Step-by-Step Instructions:

1. **Open Google Cloud Console:**
   - Go to: https://console.cloud.google.com/

2. **Select Your Project:**
   - Click the project dropdown at the top
   - Select: **bhimavaramtennis**

3. **Navigate to Cloud Storage:**
   - In the left sidebar, click ☰ (hamburger menu)
   - Search for "Cloud Storage" or find it under "Storage"
   - Click **Cloud Storage** → **Browser**

4. **Select Your Bucket:**
   - You should see: `bhimavaramtennis.firebasestorage.app`
   - Click on the bucket name

5. **Edit CORS Configuration:**
   - Click the **CONFIGURATION** tab at the top
   - Scroll down to find **CORS configuration** section
   - Click **EDIT CORS** or **EDIT** button

6. **Paste CORS Configuration:**
   Copy and paste this JSON:

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

7. **Save:**
   - Click **SAVE** button
   - Wait for confirmation message

8. **Verify:**
   - The CORS configuration should now show in the Configuration tab
   - You're done! ✅

---

## Method 2: Using Firebase CLI (If you prefer command line)

### Step 1: Install Google Cloud SDK

Download and install from:
https://cloud.google.com/sdk/docs/install

Or use PowerShell:

```powershell
# Download the installer
(New-Object Net.WebClient).DownloadFile("https://dl.google.com/dl/cloudsdk/channels/rapid/GoogleCloudSDKInstaller.exe", "$env:Temp\GoogleCloudSDKInstaller.exe")

# Run the installer
& "$env:Temp\GoogleCloudSDKInstaller.exe"
```

### Step 2: Initialize and Authenticate

```powershell
# Initialize gcloud
gcloud init

# Login to Google Cloud
gcloud auth login

# Set your project
gcloud config set project bhimavaramtennis
```

### Step 3: Apply CORS Configuration

```powershell
# Apply CORS from the config file
gsutil cors set firebase-cors-config.json gs://bhimavaramtennis.firebasestorage.app

# Verify CORS configuration
gsutil cors get gs://bhimavaramtennis.firebasestorage.app
```

---

## Method 3: Using curl (Direct REST API)

If you have authentication issues, you can use the Storage JSON API directly:

### Step 1: Get Access Token

```powershell
# Install Firebase CLI if not already installed
npm install -g firebase-tools

# Login to Firebase
firebase login

# Get access token
firebase login:ci
```

### Step 2: Apply CORS via REST API

```powershell
# Get your access token (replace YOUR_TOKEN)
$token = "YOUR_ACCESS_TOKEN_HERE"

# Apply CORS configuration
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

$corsConfig = @'
{
  "cors": [
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
}
'@

Invoke-RestMethod -Uri "https://storage.googleapis.com/storage/v1/b/bhimavaramtennis.firebasestorage.app" -Method PATCH -Headers $headers -Body $corsConfig
```

---

## Verification Steps

After applying CORS configuration:

1. **Clear Browser Cache:**
   ```
   Ctrl + Shift + R (or Ctrl + F5)
   ```

2. **Test Video Upload:**
   - Go to admin panel: http://localhost:3000/admin
   - Navigate to Highlights Manager
   - Try uploading a small video file (< 10MB)

3. **Check Browser Console:**
   - Press F12 to open DevTools
   - Go to Console tab
   - Look for success messages or errors

4. **Expected Success Message:**
   ```
   [v0] Video upload successful: https://firebasestorage.googleapis.com/...
   ```

---

## Troubleshooting

### If CORS Still Not Working:

1. **Check Bucket Name:**
   - Ensure it's exactly: `bhimavaramtennis.firebasestorage.app`
   - No typos or extra characters

2. **Clear All Caches:**
   - Browser cache (Ctrl+Shift+R)
   - Service worker cache
   - Try in incognito mode

3. **Check Domain:**
   - Verify your Vercel domain is correct
   - Update origin list if needed

4. **Wait a Few Minutes:**
   - CORS changes can take 1-5 minutes to propagate

5. **Try Different Origin Format:**
   If wildcards don't work, list domains explicitly:
   ```json
   "origin": [
     "http://localhost:3000",
     "http://localhost:3001", 
     "https://bhimavaram-tennis-club.vercel.app",
     "https://bhimavaram-tennis-club-git-main-youruser.vercel.app"
   ]
   ```

---

## Quick Command Reference

### Check Current CORS:
```powershell
gsutil cors get gs://bhimavaramtennis.firebasestorage.app
```

### Remove CORS (if needed to reset):
```powershell
gsutil cors set cors-empty.json gs://bhimavaramtennis.firebasestorage.app
```

### Test with curl:
```powershell
curl -X OPTIONS https://firebasestorage.googleapis.com/v0/b/bhimavaramtennis.firebasestorage.app/o -H "Origin: http://localhost:3000" -H "Access-Control-Request-Method: POST" -v
```

---

## Summary

✅ **Recommended:** Use Google Cloud Console (Method 1) - Easiest and most reliable

🔧 **Alternative:** Install Google Cloud SDK for command-line access (Method 2)

⚡ **Quick Fix:** Use Firebase CLI with REST API (Method 3)

**Important:** After applying CORS, always clear your browser cache and wait 1-2 minutes for changes to propagate!

