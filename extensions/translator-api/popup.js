document.addEventListener('DOMContentLoaded', function() {
    const sourceTextArea = document.getElementById('sourceText');
    const sourceLanguageSelect = document.getElementById('sourceLanguage');
    const targetLanguageSelect = document.getElementById('targetLanguage');
    const translateBtn = document.getElementById('translateBtn');
    const swapBtn = document.getElementById('swapBtn');
    const resultArea = document.getElementById('result');
    const statusDiv = document.getElementById('status');
    const detectedLangDiv = document.getElementById('detectedLang');

    // Language names for display
    const languageNames = {
        'auto': 'Auto-detect',
        'en': 'English',
        'es': 'Spanish',
        'fr': 'French',
        'de': 'German',
        'it': 'Italian',
        'pt': 'Portuguese',
        'ru': 'Russian',
        'ja': 'Japanese',
        'ko': 'Korean',
        'zh': 'Chinese',
        'ar': 'Arabic',
        'hi': 'Hindi'
    };

    // Sample texts for different scenarios
    const sampleTexts = {
        greeting: "Hello, how are you today? I hope you are having a wonderful day!",
        business: "Thank you for your email. I would like to schedule a meeting to discuss our collaboration. Please let me know your availability for next week.",
        travel: "Excuse me, where is the nearest train station? I need to get to the airport. Can you help me with directions?",
        technical: "The application requires authentication before accessing the database. Please ensure your credentials are valid and try again."
    };

    // Load sample text function (global scope for onclick handlers)
    window.loadSampleText = function(type) {
        if (sampleTexts[type]) {
            sourceTextArea.value = sampleTexts[type];
            chrome.storage.local.set({translatorText: sourceTextArea.value});
        }
    };

    // Swap languages function
    swapBtn.addEventListener('click', function() {
        if (sourceLanguageSelect.value !== 'auto') {
            const temp = sourceLanguageSelect.value;
            sourceLanguageSelect.value = targetLanguageSelect.value;
            targetLanguageSelect.value = temp;
            
            // Also swap the text if there's a translation
            if (resultArea.value && resultArea.value !== 'Translation will appear here...') {
                const tempText = sourceTextArea.value;
                sourceTextArea.value = resultArea.value;
                resultArea.value = tempText;
            }
            
            // Save new settings
            saveSettings();
        }
    });

    translateBtn.addEventListener('click', async function() {
        const text = sourceTextArea.value.trim();
        const sourceLang = sourceLanguageSelect.value;
        const targetLang = targetLanguageSelect.value;
        
        if (!text) {
            resultArea.value = 'Please enter text to translate';
            statusDiv.textContent = 'Error: No text provided';
            statusDiv.className = 'status error';
            return;
        }

        if (sourceLang === targetLang && sourceLang !== 'auto') {
            resultArea.value = 'Source and target languages cannot be the same';
            statusDiv.textContent = 'Error: Same source and target language';
            statusDiv.className = 'status error';
            return;
        }

        translateBtn.disabled = true;
        translateBtn.textContent = 'Translating...';
        statusDiv.textContent = 'Checking Gemini Nano Translator API availability...';
        statusDiv.className = 'status';
        resultArea.value = 'Translating...';
        detectedLangDiv.textContent = '';

        try {
            // Check if the Translator API is available
            if (!('ai' in window) || !('translator' in window.ai)) {
                throw new Error('Gemini Nano Translator API not available. Make sure you\'re using Chrome Canary with the Translator API flag enabled.');
            }

            statusDiv.textContent = 'Creating translator session...';
            
            // Create translator options
            const translatorOptions = {
                sourceLanguage: sourceLang === 'auto' ? undefined : sourceLang,
                targetLanguage: targetLang
            };

            const translator = await window.ai.translator.create(translatorOptions);

            statusDiv.textContent = 'Translating text...';
            
            // Translate the text
            const translation = await translator.translate(text);
            
            resultArea.value = translation;
            
            // If auto-detect was used, try to show detected language
            if (sourceLang === 'auto') {
                try {
                    const detectedLang = await translator.getDetectedLanguage();
                    if (detectedLang && languageNames[detectedLang]) {
                        detectedLangDiv.textContent = `Detected: ${languageNames[detectedLang]}`;
                    }
                } catch (e) {
                    // Ignore detection errors
                }
            }
            
            statusDiv.textContent = `Translation completed! (${languageNames[sourceLang] || 'Auto'} → ${languageNames[targetLang]})`;
            
            // Clean up session
            translator.destroy();
            
        } catch (error) {
            console.error('Translator API Error:', error);
            resultArea.value = `Error: ${error.message}`;
            statusDiv.textContent = 'Error occurred. Check console for details.';
            statusDiv.className = 'status error';
        } finally {
            translateBtn.disabled = false;
            translateBtn.textContent = 'Translate Text';
        }
    });

    function saveSettings() {
        chrome.storage.local.set({
            translatorText: sourceTextArea.value,
            sourceLang: sourceLanguageSelect.value,
            targetLang: targetLanguageSelect.value
        });
    }

    // Load saved settings
    chrome.storage.local.get(['translatorText', 'sourceLang', 'targetLang'], function(result) {
        if (result.translatorText) sourceTextArea.value = result.translatorText;
        if (result.sourceLang) sourceLanguageSelect.value = result.sourceLang;
        if (result.targetLang) targetLanguageSelect.value = result.targetLang;
    });

    // Save settings when changed
    sourceTextArea.addEventListener('input', saveSettings);
    sourceLanguageSelect.addEventListener('change', saveSettings);
    targetLanguageSelect.addEventListener('change', saveSettings);
});