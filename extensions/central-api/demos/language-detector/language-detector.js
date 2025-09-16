// Full code for language-detector-api/popup.js
document.addEventListener('DOMContentLoaded', function() {
    const textArea = document.getElementById('textToDetect');
    const detectBtn = document.getElementById('detectBtn');
    const resultDiv = document.getElementById('result');
    const statusDiv = document.getElementById('status');

    // Language names and information
    const languageInfo = {
        'en': { name: 'English', nativeName: 'English', family: 'Germanic' },
        'es': { name: 'Spanish', nativeName: 'Español', family: 'Romance' },
        'fr': { name: 'French', nativeName: 'Français', family: 'Romance' },
        'de': { name: 'German', nativeName: 'Deutsch', family: 'Germanic' },
        'it': { name: 'Italian', nativeName: 'Italiano', family: 'Romance' },
        'pt': { name: 'Portuguese', nativeName: 'Português', family: 'Romance' },
        'ru': { name: 'Russian', nativeName: 'Русский', family: 'Slavic' },
        'ja': { name: 'Japanese', nativeName: '日本語', family: 'Japonic' },
        'ko': { name: 'Korean', nativeName: '한국어', family: 'Koreanic' },
        'zh': { name: 'Chinese', nativeName: '中文', family: 'Sino-Tibetan' },
        'ar': { name: 'Arabic', nativeName: 'العربية', family: 'Semitic' },
        'hi': { name: 'Hindi', nativeName: 'हिन्दी', family: 'Indo-Aryan' },
        'nl': { name: 'Dutch', nativeName: 'Nederlands', family: 'Germanic' },
        'sv': { name: 'Swedish', nativeName: 'Svenska', family: 'Germanic' },
        'no': { name: 'Norwegian', nativeName: 'Norsk', family: 'Germanic' },
        'da': { name: 'Danish', nativeName: 'Dansk', family: 'Germanic' },
        'fi': { name: 'Finnish', nativeName: 'Suomi', family: 'Finno-Ugric' },
        'pl': { name: 'Polish', nativeName: 'Polski', family: 'Slavic' },
        'tr': { name: 'Turkish', nativeName: 'Türkçe', family: 'Turkic' }
    };

    // Sample texts in different languages
    const sampleTexts = {
        french: "Bonjour, comment allez-vous? J'espère que vous passez une excellente journée!",
        spanish: "Hola, ¿cómo estás? Espero que tengas un día maravilloso.",
        german: "Guten Tag, wie geht es Ihnen? Ich hoffe, Sie haben einen schönen Tag.",
        japanese: "こんにちは、お元気ですか？素晴らしい一日をお過ごしください。",
        mixed: "Hello, comment ça va? Wie geht's? こんにちは! This text contains multiple languages."
    };

    // Load sample text function (global scope for onclick handlers)
    window.loadSampleText = function(type) {
        if (sampleTexts[type]) {
            textArea.value = sampleTexts[type];
            chrome.storage.local.set({detectorText: textArea.value});
        }
    };

    // Detect page language function
    window.detectPageLanguage = function() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {action: 'getPageContent'}, function(response) {
                if (response && response.content) {
                    textArea.value = response.content.slice(0, 500); // First 500 chars
                    chrome.storage.local.set({detectorText: textArea.value});
                    statusDiv.textContent = 'Page content loaded. Click "Detect Language" to analyze.';
                } else {
                    statusDiv.textContent = 'Could not extract page content.';
                    statusDiv.className = 'status error';
                }
            });
        });
    };

    // Attach event listeners for sample text buttons
    document.getElementById('sampleFrenchBtn').addEventListener('click', function() {
        textArea.value = sampleTexts.french;
        chrome.storage.local.set({detectorText: textArea.value});
    });
    document.getElementById('sampleSpanishBtn').addEventListener('click', function() {
        textArea.value = sampleTexts.spanish;
        chrome.storage.local.set({detectorText: textArea.value});
    });
    document.getElementById('sampleGermanBtn').addEventListener('click', function() {
        textArea.value = sampleTexts.german;
        chrome.storage.local.set({detectorText: textArea.value});
    });
    document.getElementById('sampleJapaneseBtn').addEventListener('click', function() {
        textArea.value = sampleTexts.japanese;
        chrome.storage.local.set({detectorText: textArea.value});
    });
    document.getElementById('sampleMixedBtn').addEventListener('click', function() {
        textArea.value = sampleTexts.mixed;
        chrome.storage.local.set({detectorText: textArea.value});
    });
    document.getElementById('detectPageLanguageBtn').addEventListener('click', function() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {action: 'getPageContent'}, function(response) {
                if (response && response.content) {
                    textArea.value = response.content.slice(0, 500); // First 500 chars
                    chrome.storage.local.set({detectorText: textArea.value});
                    statusDiv.textContent = 'Page content fetched. You can now detect the language.';
                } else {
                    statusDiv.textContent = 'Could not fetch page content.';
                    statusDiv.className = 'status error';
                }
            });
        });
    });

    detectBtn.addEventListener('click', async function() {
        const text = textArea.value.trim();
        if (!text) {
            resultDiv.innerHTML = 'Please enter text to analyze';
            statusDiv.textContent = 'Error: No text provided';
            statusDiv.className = 'status error';
            return;
        }
        detectBtn.disabled = true;
        detectBtn.textContent = 'Detecting...';
        statusDiv.textContent = 'Checking Gemini Nano Language Detector API availability...';
        statusDiv.className = 'status';
        resultDiv.innerHTML = 'Analyzing language...';
        try {
            if (!('LanguageDetector' in self)) {
                throw new Error('Gemini Nano Language Detector API not available. Make sure you\'re using Chrome Canary with the Language Detector API flag enabled.');
            }
            statusDiv.textContent = 'Checking model availability...';
            const options = {
                monitor(m) {
                    if (typeof m.addEventListener === 'function') {
                        m.addEventListener('downloadprogress', e => {
                            statusDiv.textContent = `Downloaded ${Math.round(e.loaded * 100)}%`;
                        });
                    }
                }
            };
            const available = await LanguageDetector.availability();
            if (available === 'unavailable') {
                throw new Error('Language Detector API is not usable.');
            }
            statusDiv.textContent = 'Creating language detector session...';
            const detector = await LanguageDetector.create(options);
            statusDiv.textContent = 'Detecting language...';
            const results = await detector.detect(text);
            // Display top result and alternatives
            if (!results || results.length === 0) {
                resultDiv.innerHTML = '<div class="error">Could not detect language</div>';
            } else {
                const top = results[0];
                const detectedLangCode = top.detectedLanguage;
                const confidence = top.confidence;
                const langInfo = languageInfo[detectedLangCode] || { 
                    name: detectedLangCode.toUpperCase(), 
                    nativeName: detectedLangCode.toUpperCase(),
                    family: 'Unknown'
                };
                let html = `
                    <div class="detected-language">${langInfo.name} (${detectedLangCode})</div>
                    <div class="confidence">Confidence: ${Math.round(confidence * 100)}%</div>
                    <div class="language-details">
                        <span class="label">Native Name:</span>
                        <span class="value">${langInfo.nativeName}</span>
                        <span class="label">Language Family:</span>
                        <span class="value">${langInfo.family}</span>
                        <span class="label">Text Length:</span>
                        <span class="value">${text.length} characters</span>
                    </div>
                `;
                if (results.length > 1) {
                    html += '<div class="alternatives"><h4>Alternative Detections:</h4>';
                    results.slice(1, 4).forEach(alt => {
                        const altInfo = languageInfo[alt.detectedLanguage] || { name: alt.detectedLanguage.toUpperCase() };
                        html += `
                            <div class="alt-language">
                                <span class="alt-name">${altInfo.name} (${alt.detectedLanguage})</span>
                                <span class="alt-confidence">${Math.round(alt.confidence * 100)}%</span>
                            </div>
                        `;
                    });
                    html += '</div>';
                }
                resultDiv.innerHTML = html;
            }
            statusDiv.textContent = 'Language detection completed successfully!';
            detector.destroy();
        } catch (error) {
            console.error('Language Detector API Error:', error);
            resultDiv.innerHTML = `<div class="error">Error: ${error.message}</div>`;
            statusDiv.textContent = 'Error occurred. Check console for details.';
            statusDiv.className = 'status error';
        } finally {
            detectBtn.disabled = false;
            detectBtn.textContent = 'Detect Language';
        }
    });

    // Load saved text
    chrome.storage.local.get(['detectorText'], function(result) {
        if (result.detectorText) {
            textArea.value = result.detectorText;
        }
    });

    // Save text when changed
    textArea.addEventListener('input', () => {
        chrome.storage.local.set({detectorText: textArea.value});
    });
});
