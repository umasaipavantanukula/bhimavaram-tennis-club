# Quick Commands to Apply CORS

## Option 1: Using Google Cloud Console (EASIEST - RECOMMENDED)

I've already opened the console for you. Follow these steps:

1. **Login** to your Google account
2. You should see the bucket: `bhimavaramtennis.firebasestorage.app`
3. Click on **Configuration** tab
4. Scroll to "**CORS configuration**" section
5. Click "**Edit CORS**"
6. **Paste this JSON:**

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

7. Click **SAVE**
8. Done! ✅

---

## Option 2: Using PowerShell Script

### Step 1: Open PowerShell as Administrator
- Press `Windows + X`
- Click "Windows PowerShell (Admin)" or "Terminal (Admin)"

### Step 2: Navigate to project directory
```powershell
cd C:\Users\sujay\Desktop\bhimavaram-tennis-club
```

### Step 3: Allow script execution (one time only)
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Step 4: Run the script
```powershell
.\apply-cors.ps1
```

The script will:
- Check if Google Cloud SDK is installed
- Guide you through installation if needed
- Authenticate your account
- Apply CORS configuration
- Verify it was applied correctly

---

## Option 3: Install Google Cloud SDK and use gsutil

### Step 1: Download and Install Google Cloud SDK
```powershell
# Open download page
Start-Process "https://cloud.google.com/sdk/docs/install"
```

### Step 2: After installation, restart terminal and run:
```powershell
# Initialize and login
gcloud init

# Set project
gcloud config set project bhimavaramtennis

# Apply CORS
gsutil cors set firebase-cors-config.json gs://bhimavaramtennis.firebasestorage.app

# Verify
gsutil cors get gs://bhimavaramtennis.firebasestorage.app
```

---

## Verification

After applying CORS, verify it works:

1. **Clear browser cache:**
   ```
   Ctrl + Shift + R (or Ctrl + F5)
   ```

2. **Test video upload:**
   - Go to: http://localhost:3000/admin
   - Navigate to Highlights Manager
   - Try uploading a small video file

3. **Check for success:**
   - You should see "[v0] Video upload successful"
   - No CORS errors in browser console (F12)

---

## Troubleshooting

### If you see "Permission Denied" or "Access Denied":
- Make sure you're logged in with the correct Google account
- Ensure your account has Owner or Editor role in the Firebase project

### If CORS still doesn't work after applying:
1. Wait 2-3 minutes for changes to propagate
2. Clear browser cache completely
3. Try in incognito mode
4. Check if your Vercel domain is correct

### To check current CORS configuration:
```powershell
gsutil cors get gs://bhimavaramtennis.firebasestorage.app
```

---

## Summary

✅ **Easiest:** Use Google Cloud Console (already opened for you)
🔧 **Alternative:** Run PowerShell script: `.\apply-cors.ps1`
⚡ **Manual:** Install Google Cloud SDK and use gsutil commands

**Choose whichever method you're most comfortable with!**
