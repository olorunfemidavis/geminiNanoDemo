# Gemini Nano Demo - Chrome Extensions

A comprehensive collection of Chrome extensions demonstrating the Google Gemini Nano AI APIs for offline & fully client-side AI integrations.

## 🚀 Overview

This repository contains **7 individual Chrome extensions**, each showcasing a different Gemini Nano API:

1. **Prompt API Extension** - General AI chat and question answering
2. **Writer API Extension** - AI-powered content creation
3. **Rewriter API Extension** - Text rewriting and style transformation
4. **Summarizer API Extension** - Text summarization and key point extraction
5. **Proofreader API Extension** - Grammar and spelling correction
6. **Translator API Extension** - Multi-language text translation
7. **Language Detector API Extension** - Automatic language identification

## 📋 Prerequisites

To use these extensions, you need:

- **Chrome Canary** (not regular Chrome)
- Enable experimental AI features in Chrome flags:
  - `chrome://flags/#optimization-guide-on-device-model`
  - `chrome://flags/#prompt-api-for-gemini-nano`
  - `chrome://flags/#writer-api-for-gemini-nano`
  - `chrome://flags/#rewriter-api-for-gemini-nano`
  - `chrome://flags/#summarizer-api-for-gemini-nano`
  - `chrome://flags/#translation-api`
  - `chrome://flags/#language-detection-api`

## 🛠️ Installation

### Option 1: Load Individual Extensions

1. Clone this repository:
   ```bash
   git clone https://github.com/olorunfemidavis/geminiNanoDemo.git
   cd geminiNanoDemo
   ```

2. Open Chrome Canary and navigate to `chrome://extensions/`

3. Enable "Developer mode" (toggle in top right)

4. Click "Load unpacked" and select the folder for the extension you want to test:
   - `extensions/prompt-api/` - For Prompt API
   - `extensions/writer-api/` - For Writer API
   - `extensions/rewriter-api/` - For Rewriter API
   - `extensions/summarizer-api/` - For Summarizer API
   - `extensions/proofreader-api/` - For Proofreader API
   - `extensions/translator-api/` - For Translator API
   - `extensions/language-detector-api/` - For Language Detector API

5. The extension will appear in your Chrome toolbar

### Option 2: Load All Extensions at Once

You can load multiple extensions simultaneously by repeating step 4 for each extension folder.

## 🎯 Features

### 1. Prompt API Extension
- **Purpose**: General AI conversation and question answering
- **Features**: 
  - Open-ended prompts and questions
  - Customizable temperature and topK settings
  - Response storage and history
- **Use Cases**: Creative writing, brainstorming, general Q&A

### 2. Writer API Extension
- **Purpose**: AI-powered content creation
- **Features**:
  - Multiple writing tones (neutral, formal, casual, creative, persuasive)
  - Adjustable content length (short, medium, long)
  - Topic-based content generation
- **Use Cases**: Blog posts, articles, marketing copy

### 3. Rewriter API Extension
- **Purpose**: Text transformation and style adjustment
- **Features**:
  - Tone modification (formal, casual, professional, creative)
  - Length adjustment (shorter, longer, as-is)
  - Sample text templates for testing
- **Use Cases**: Email refinement, content adaptation, style consistency

### 4. Summarizer API Extension
- **Purpose**: Text summarization and key point extraction
- **Features**:
  - Multiple summary types (key points, TL;DR, teaser, headline)
  - Length control (short, medium, long)
  - Current page summarization
- **Use Cases**: Document review, research, content curation

### 5. Proofreader API Extension
- **Purpose**: Grammar, spelling, and writing correction
- **Features**:
  - Automatic error detection and correction
  - Detailed correction explanations
  - Sample texts with intentional errors for testing
- **Use Cases**: Email polishing, document review, writing assistance

### 6. Translator API Extension
- **Purpose**: Multi-language text translation
- **Features**:
  - Support for 12+ languages
  - Auto-detection of source language
  - Language pair swapping
  - Confidence scoring
- **Use Cases**: International communication, content localization

### 7. Language Detector API Extension
- **Purpose**: Automatic language identification
- **Features**:
  - Confidence scoring for detected languages
  - Alternative language suggestions
  - Current page language detection
  - Support for mixed-language text
- **Use Cases**: Content analysis, internationalization, language learning

## 🔧 Technical Details

### Architecture
- **Manifest Version**: 3 (latest Chrome extension standard)
- **Permissions**: Storage, activeTab, and host permissions for full functionality
- **Components**: 
  - `popup.html/js` - Main user interface
  - `background.js` - Service worker for extension lifecycle
  - `content.js` - Page interaction capabilities
  - `manifest.json` - Extension configuration

### API Integration
Each extension uses the corresponding Gemini Nano API:
- `window.ai.languageModel` (Prompt API)
- `window.ai.writer` (Writer API)
- `window.ai.rewriter` (Rewriter API)
- `window.ai.summarizer` (Summarizer API)
- `window.ai.proofreader` (Proofreader API)
- `window.ai.translator` (Translator API)
- `window.ai.languageDetector` (Language Detector API)

### Error Handling
- Comprehensive error checking for API availability
- User-friendly error messages
- Fallback handling for unsupported features

## 🧪 Testing

### Manual Testing
1. Load the extension in Chrome Canary
2. Click the extension icon in the toolbar
3. Enter sample text or use provided examples
4. Verify the API response and functionality

### Sample Data
Each extension includes sample text and scenarios for easy testing:
- Pre-loaded example text
- Quick action buttons for common use cases
- Page content integration where applicable

## 🔍 Troubleshooting

### Common Issues

1. **"API not available" error**:
   - Ensure you're using Chrome Canary
   - Enable the required Chrome flags
   - Restart Chrome after enabling flags

2. **Extension not loading**:
   - Check Developer mode is enabled
   - Verify manifest.json is valid
   - Check browser console for errors

3. **No response from API**:
   - Wait for model download to complete
   - Check network connectivity
   - Verify API permissions in manifest

### Chrome Flags Reference
Navigate to `chrome://flags/` and enable these flags:
- `optimization-guide-on-device-model` - Enabled
- `prompt-api-for-gemini-nano` - Enabled
- `writer-api-for-gemini-nano` - Enabled
- `rewriter-api-for-gemini-nano` - Enabled
- `summarizer-api-for-gemini-nano` - Enabled
- `translation-api` - Enabled
- `language-detection-api` - Enabled

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly with Chrome Canary
5. Submit a pull request

## 📝 License

MIT License - see LICENSE file for details

## 🔗 Resources

- [Chrome Extensions Developer Guide](https://developer.chrome.com/docs/extensions/)
- [Gemini Nano API Documentation](https://developer.chrome.com/docs/ai/)
- [Chrome Canary Download](https://www.google.com/chrome/canary/)

## ⚡ Quick Start

1. Download Chrome Canary
2. Enable AI flags in `chrome://flags/`
3. Clone this repo
4. Load any extension from the `extensions/` folder
5. Start exploring AI capabilities offline!

---

**Note**: These APIs are experimental and may change. Always test with the latest Chrome Canary build. 
