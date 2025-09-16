# Installation Guide

## Step-by-Step Installation Instructions

### 1. Download Chrome Canary
1. Visit [Chrome Canary Download Page](https://www.google.com/chrome/canary/)
2. Download and install Chrome Canary
3. Launch Chrome Canary

### 2. Enable Required Chrome Flags
1. Open Chrome Canary
2. Navigate to `chrome://flags/`
3. Search for and enable the following flags (set to "Enabled"):

   **Required Flags:**
   - `optimization-guide-on-device-model`
   - `prompt-api-for-gemini-nano`
   - `writer-api-for-gemini-nano`
   - `rewriter-api-for-gemini-nano`
   - `summarizer-api-for-gemini-nano`
   - `translation-api`
   - `language-detection-api`

4. Click "Relaunch" at the bottom of the page

### 3. Download the Repository
```bash
git clone https://github.com/olorunfemidavis/geminiNanoDemo.git
cd geminiNanoDemo
```

### 4. Load Extensions in Chrome Canary

#### Option A: Load Individual Extensions
1. Open Chrome Canary
2. Navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top-right corner)
4. Click "Load unpacked"
5. Navigate to the repository folder and select one extension folder:
   - `extensions/prompt-api/`
   - `extensions/writer-api/`
   - `extensions/rewriter-api/`
   - `extensions/summarizer-api/`
   - `extensions/proofreader-api/`
   - `extensions/translator-api/`
   - `extensions/language-detector-api/`

#### Option B: Load All Extensions
Repeat steps 4-5 for each extension folder to load all extensions simultaneously.

### 5. Verify Installation
1. Check that the extension(s) appear in the Chrome toolbar
2. Click on any extension icon to open its popup
3. Try the sample functionality to ensure APIs are working

## Troubleshooting

### Issue: "API not available" Error
**Solution:**
- Ensure you're using Chrome Canary (not regular Chrome)
- Verify all required flags are enabled in `chrome://flags/`
- Restart Chrome Canary completely
- Wait for model download to complete (may take a few minutes on first use)

### Issue: Extension Not Loading
**Solution:**
- Ensure "Developer mode" is enabled in `chrome://extensions/`
- Check that you selected the correct extension folder (contains manifest.json)
- Look for error messages in the Extensions page

### Issue: No Model Response
**Solution:**
- Check your internet connection (initial model download required)
- Wait longer for the response (first requests may be slow)
- Try with simpler/shorter text first

### Issue: Permission Errors
**Solution:**
- Ensure the extension has proper permissions
- Try reloading the extension in `chrome://extensions/`
- Check browser console for specific error messages

## Verification Checklist

✅ Chrome Canary installed and running  
✅ All required Chrome flags enabled  
✅ Chrome Canary restarted after enabling flags  
✅ Repository cloned locally  
✅ Extension(s) loaded in Developer mode  
✅ Extension icons visible in toolbar  
✅ Sample functionality works correctly  

## Need Help?

If you encounter issues:
1. Check the [main README](README.md) for additional troubleshooting
2. Verify you're using the latest Chrome Canary build
3. Ensure all Chrome flags are properly enabled
4. Try testing with one extension at a time

## API-Specific Notes

- **First Use**: Models may need to download on first API call
- **Internet Required**: Initial setup and model downloads require internet
- **Offline Capable**: Once models are downloaded, APIs work offline
- **Experimental**: These APIs are experimental and may change