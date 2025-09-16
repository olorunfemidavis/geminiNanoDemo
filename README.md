# Gemini Nano Demo - Chrome Extension

A unified Chrome extension demonstrating all Google Gemini Nano AI APIs for offline & fully client-side AI integrations.

## 🚀 Overview

This extension provides a single, centralized UI to test and explore all Gemini Nano APIs:

- Prompt API (General AI chat and Q&A)
- Writer API (AI-powered content creation)
- Rewriter API (Text rewriting and style transformation)
- Summarizer API (Text summarization)
- Proofreader API (Grammar and spelling correction)
- Translator API (Multi-language translation)
- Language Detector API (Automatic language identification)
- Alt Texter (Image alt text generation leveraging other APIs)

## 📋 Prerequisites

- **Chrome 138 or newer**
- Enable experimental AI features in Chrome flags:
  - `chrome://flags/#optimization-guide-on-device-model`
  - `chrome://flags/#prompt-api-for-gemini-nano`
  - `chrome://flags/#writer-api-for-gemini-nano`
  - `chrome://flags/#rewriter-api-for-gemini-nano`
  - `chrome://flags/#summarizer-api-for-gemini-nano`
  - `chrome://flags/#translation-api`
  - `chrome://flags/#language-detection-api`

## 🛠️ Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/olorunfemidavis/geminiNanoDemo.git
   cd geminiNanoDemo
   ```
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top right)
4. Click "Load unpacked" and select the folder:
   - `extensions/central-api/`
5. The extension will appear in your Chrome toolbar

## 🎯 Features

### 1. Prompt API
- General AI conversation and question answering
- Customizable temperature and topK settings
- Response storage and history
- Creative writing, brainstorming, general Q&A

### 2. Writer API
- Multiple writing tones (neutral, formal, casual, creative, persuasive)
- Adjustable content length (short, medium, long)
- Topic-based content generation
- Blog posts, articles, marketing copy

### 3. Rewriter API
- Tone modification (formal, casual, professional, creative)
- Length adjustment (shorter, longer, as-is)
- Sample text templates for testing
- Email refinement, content adaptation, style consistency

### 4. Summarizer API
- Multiple summary types (key points, TL;DR, teaser, headline)
- Length control (short, medium, long)
- Current page summarization
- Document review, research, content curation

### 5. Proofreader API
- Automatic error detection and correction
- Detailed correction explanations
- Sample texts with intentional errors for testing
- Email polishing, document review, writing assistance

### 6. Translator API
- Support for 12+ languages
- Auto-detection of source language
- Language pair swapping
- Confidence scoring
- International communication, content localization

### 7. Language Detector API
- Confidence scoring for detected languages
- Alternative language suggestions
- Current page language detection
- Support for mixed-language text
- Content analysis, internationalization, language learning

### 8. Alt Texter
- Image alt text generation leveraging other APIs
- Context menu integration
- Language selection and translation
- Accessibility and SEO improvements

## 🔧 Technical Details

- **Manifest Version**: 3
- **Permissions**: Storage, activeTab, host permissions
- **Components**: 
  - `popup.html/js/css` - Main UI
  - `background.js` - Service worker
  - `content.js` - Page interaction
  - `manifest.json` - Extension config

## 🧪 Testing

1. Load the extension in Chrome
2. Click the extension icon in the toolbar
3. Use the vertical tabs to test each API/module
4. Try sample text and verify responses

## 🔍 Troubleshooting

- Ensure Chrome 138 or newer is used
- Enable all required Chrome flags
- Restart Chrome after enabling flags
- Wait for model downloads on first use
- Check browser console for errors

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly with Chrome
5. Submit a pull request

## 📝 License

MIT License - see LICENSE file for details

## 🔗 Resources

- [Chrome Extensions Developer Guide](https://developer.chrome.com/docs/extensions/)
- [Gemini Nano API Documentation](https://developer.chrome.com/docs/ai/)

---

**Note**: These APIs are experimental and may change. Always test with the latest Chrome build.
