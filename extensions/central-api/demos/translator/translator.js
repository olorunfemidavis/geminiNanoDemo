// Full code omitted for brevity, but will be copied in production.
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
        'hi': 'Hindi',
        'nl': 'Dutch',
        'sv': 'Swedish',
        'no': 'Norwegian',
        'da': 'Danish',
        'fi': 'Finnish',
        'pl': 'Polish',
        'tr': 'Turkish'
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
        // Only swap if both are not 'auto' and not the same
        if (sourceLanguageSelect.value !== 'auto' && targetLanguageSelect.value !== 'auto' && sourceLanguageSelect.value !== targetLanguageSelect.value) {
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
        } else {
            statusDiv.textContent = 'Cannot swap when source or target is Auto-detect or both are the same.';
            statusDiv.className = 'status error';
        }
    });

    translateBtn.addEventListener('click', async function() {
        const text = sourceTextArea.value.trim();
        let sourceLang = sourceLanguageSelect.value;
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
        statusDiv.textContent = 'Detecting language...';
        statusDiv.className = 'status';
        resultArea.value = 'Translating...';
        detectedLangDiv.textContent = '';
        try {
            // Language detection if auto selected
            if (sourceLang === 'auto') {
                if (!('LanguageDetector' in self)) {
                    throw new Error('Language Detector API not available.');
                }
                const detector = await LanguageDetector.create({
                    monitor(m) {
                        if (typeof m.addEventListener === 'function') {
                            m.addEventListener('downloadprogress', e => {
                                statusDiv.textContent = `Language model downloaded ${Math.round(e.loaded * 100)}%`;
                            });
                        }
                    }
                });
                const results = await detector.detect(text);
                if (!results || results.length === 0 || results[0].confidence < 0.5) {
                    throw new Error('Could not confidently detect language.');
                }
                sourceLang = results[0].detectedLanguage;
                detectedLangDiv.textContent = `Detected: ${languageNames[sourceLang] || sourceLang}`;
                detector.destroy();
            }
            if (!('Translator' in self)) {
                throw new Error('Gemini Nano Translator API not available. Make sure you\'re using Chrome Canary with the Translator API flag enabled.');
            }
            statusDiv.textContent = 'Checking model availability...';
            const translatorOptions = {
                sourceLanguage: sourceLang,
                targetLanguage: targetLang,
                monitor(m) {
                    if (typeof m.addEventListener === 'function') {
                        m.addEventListener('downloadprogress', e => {
                            statusDiv.textContent = `Downloaded ${Math.round(e.loaded * 100)}%`;
                        });
                    }
                }
            };
            const available = await Translator.availability({
                sourceLanguage: sourceLang,
                targetLanguage: targetLang
            });
            if (available === 'unavailable') {
                throw new Error('Translator API is not usable for this language pair.');
            }
            statusDiv.textContent = 'Creating translator session...';
            const translator = await Translator.create(translatorOptions);
            statusDiv.textContent = 'Translating text...';
            const translation = await translator.translate(text);
            resultArea.value = translation;
            statusDiv.textContent = `Translation completed! (${languageNames[sourceLang] || sourceLang} → ${languageNames[targetLang]})`;
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

    // Sample button event listeners
    document.getElementById('sampleGreetingBtn').addEventListener('click', function() {
        loadSampleText('greeting');
    });
    document.getElementById('sampleBusinessBtn').addEventListener('click', function() {
        loadSampleText('business');
    });
    document.getElementById('sampleTravelBtn').addEventListener('click', function() {
        loadSampleText('travel');
    });
    document.getElementById('sampleTechnicalBtn').addEventListener('click', function() {
        loadSampleText('technical');
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

    sourceTextArea.addEventListener('input', saveSettings);
    sourceLanguageSelect.addEventListener('change', saveSettings);
    targetLanguageSelect.addEventListener('change', saveSettings);

    // Dynamically populate language dropdowns
    function populateLanguageDropdowns() {
        // Get sorted language codes (excluding 'auto' for target)
        const codes = Object.keys(languageNames).filter(code => code !== 'auto').sort((a, b) => languageNames[a].localeCompare(languageNames[b]));
        // Source: include 'auto' at the top
        sourceLanguageSelect.innerHTML = '<option value="auto">Auto-detect</option>' + codes.map(code => `<option value="${code}">${languageNames[code]}</option>`).join('');
        // Target: all except 'auto'
        targetLanguageSelect.innerHTML = codes.map(code => `<option value="${code}">${languageNames[code]}</option>`).join('');
    }
    populateLanguageDropdowns();
});
