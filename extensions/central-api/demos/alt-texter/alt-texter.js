// Gemini Nano Alt Texter API Demo - Real Translation Service & Dynamic Language Loading

document.addEventListener('DOMContentLoaded', function() {
    const altTextArea = document.getElementById('altText');
    const altTextResult = document.getElementById('altTextResult');
    const langSelect = document.getElementById('lang');
    const loading = document.getElementById('loading');
    const copyCloseBtn = document.getElementById('copyClose');
    const discardBtn = document.getElementById('discard');

    // Language names for display
    const languageNames = {
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
        'tr': 'Turkish',
        'bn': 'Bengali',
        'zh-Hant': 'Taiwanese Mandarin (Traditional)',
        'vi': 'Vietnamese'
    };

    // Dynamically populate language dropdown
    function populateLanguageDropdown() {
        const codes = Object.keys(languageNames).sort((a, b) => languageNames[a].localeCompare(languageNames[b]));
        langSelect.innerHTML = codes.map(code => `<option value="${code}"${code === 'en' ? ' selected' : ''}>${languageNames[code]}</option>`).join('');
    }
    populateLanguageDropdown();

    // Listen for context menu alt text from background.js
    chrome.runtime.onMessage.addListener((message) => {
        if (message.action === 'alt-text') {
            showLoading();
            let output = message.text;
            // Save the raw alt text in storage
            chrome.storage.local.set({ altTexterRawText: output });
            // Translate if needed
            if (langSelect && langSelect.value !== 'en') {
                translate(output, langSelect.value).then(translated => {
                    showAltText(translated);
                });
            } else {
                showAltText(output);
            }
        }
    });

    // On language change, always translate the stored raw value
    langSelect.addEventListener('change', async function () {
        chrome.storage.local.get(['altTexterRawText'], async function(result) {
            const rawText = result.altTexterRawText || '';
            if (rawText) {
                showLoading();
                try {
                    const translated = await translate(rawText, langSelect.value);
                    showAltText(translated);
                } catch (e) {
                    showAltText('[Translation error] ' + rawText);
                }
            } else {
                altTextArea.value = '';
                altTextResult.textContent = '';
                loading.style.display = 'none';
            }
        });
    });

    // On load, restore last alt text if present
    chrome.storage.local.get(['altTexterRawText'], function(result) {
        const rawText = result.altTexterRawText || '';
        if (rawText) {
            if (langSelect && langSelect.value !== 'en') {
                translate(rawText, langSelect.value).then(translated => {
                    showAltText(translated);
                });
            } else {
                showAltText(rawText);
            }
        }
    });

    function showLoading() {
        loading.style.display = '';
        altTextArea.hidden = false;
        altTextArea.value = '';
        altTextResult.textContent = '';
    }
    function showAltText(text) {
        loading.style.display = 'none';
        altTextArea.hidden = false;
        altTextArea.value = text;
        altTextResult.textContent = '';
    }
    discardBtn.addEventListener('click', function() {
        altTextArea.value = '';
        altTextArea.hidden = false;
        altTextResult.textContent = '';
    });

    copyCloseBtn.addEventListener('click', function() {
        if (!altTextArea.hidden && altTextArea.value) {
            navigator.clipboard.writeText(altTextArea.value);
        }
    });
    discardBtn.addEventListener('click', function() {
        altTextArea.value = '';
        altTextArea.hidden = false;
        altTextResult.textContent = '';
    });
});

// Real Gemini Nano Translator API integration
async function translate(string, targetLang) {
    if (targetLang === 'en') return string;
    if (!('Translator' in self)) {
        return '[Translation API not available] ' + string;
    }
    try {
        const available = await Translator.availability({
            sourceLanguage: 'en',
            targetLanguage: targetLang
        });
        if (available === 'unavailable') {
            return '[Translation unavailable] ' + string;
        }
        let translator;
        if (available === 'available') {
            translator = await Translator.create({
                sourceLanguage: 'en',
                targetLanguage: targetLang
            });
        } else {
            translator = await Translator.create({
                sourceLanguage: 'en',
                targetLanguage: targetLang,
                monitor(m) {
                    if (typeof m.addEventListener === 'function') {
                        m.addEventListener('downloadprogress', e => {
                            loading.textContent = `Downloaded ${Math.round(e.loaded * 100)}%`;
                        });
                    }
                }
            });
        }
        const result = await translator.translate(string);
        translator.destroy();
        return result;
    } catch (e) {
        console.error(e);
        return '[Translation error] ' + string;
    }
}
