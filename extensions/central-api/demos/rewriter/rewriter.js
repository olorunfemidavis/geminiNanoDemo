// Full code omitted for brevity, but will be copied in production.
document.addEventListener('DOMContentLoaded', function() {
    const originalTextArea = document.getElementById('originalText');
    const toneSelect = document.getElementById('tone');
    const lengthSelect = document.getElementById('length');
    const rewriteBtn = document.getElementById('rewriteBtn');
    const resultArea = document.getElementById('result');
    const statusDiv = document.getElementById('status');

    // Sample texts for quick testing
    const sampleTexts = {
        email: "Hi there, I hope you're doing well. I wanted to reach out to discuss the project we talked about last week. Let me know when you have some time to chat. Thanks!",
        paragraph: "Artificial intelligence is changing the way we work and live. It helps us solve complex problems faster and more efficiently. Many industries are adopting AI technologies to improve their services and products.",
        social: "Just had an amazing cup of coffee at the new cafe downtown! The atmosphere is perfect for working and the staff is super friendly. Definitely recommend checking it out! #coffee #productivity"
    };

    // Load sample text function (global scope for onclick handlers)
    window.loadSampleText = function(type) {
        if (sampleTexts[type]) {
            originalTextArea.value = sampleTexts[type];
            chrome.storage.local.set({rewriterText: originalTextArea.value});
        }
    };

    rewriteBtn.addEventListener('click', async function() {
        const originalText = originalTextArea.value.trim();
        const tone = toneSelect.value;
        const length = lengthSelect.value;
        const format = 'plain-text';
        const sharedContext = 'This is a writing assistant.';
        if (!originalText) {
            resultArea.value = 'Please enter text to rewrite';
            statusDiv.textContent = 'Error: No text provided';
            statusDiv.className = 'status error';
            return;
        }
        rewriteBtn.disabled = true;
        rewriteBtn.textContent = 'Rewriting...';
        statusDiv.textContent = 'Checking Gemini Nano Rewriter API availability...';
        statusDiv.className = 'status';
        resultArea.value = 'Processing rewrite...';
        try {
            if (!('Rewriter' in self)) {
                throw new Error('Gemini Nano Rewriter API not available. Make sure you\'re using Chrome Canary with the Rewriter API flag enabled.');
            }
            statusDiv.textContent = 'Checking model availability...';
            const allowedTones = ['more-formal', 'as-is', 'more-casual'];
            const validTone = allowedTones.includes(tone) ? tone : 'as-is';
            const allowedLengths = ['shorter', 'as-is', 'longer'];
            const validLength = allowedLengths.includes(length) ? length : 'as-is';
            const allowedFormats = ['as-is', 'markdown', 'plain-text'];
            const format = allowedFormats.includes('plain-text') ? 'plain-text' : 'as-is';
            const options = {
                tone: validTone,
                length: validLength,
                format,
                sharedContext,
                monitor(m) {
                    if (typeof m.addEventListener === 'function') {
                        m.addEventListener('downloadprogress', e => {
                            statusDiv.textContent = `Downloaded ${Math.round(e.loaded * 100)}%`;
                        });
                    }
                }
            };
            const available = await Rewriter.availability();
            if (available === 'unavailable') {
                throw new Error('Rewriter API is not usable.');
            }
            statusDiv.textContent = 'Creating rewriter session...';
            const rewriter = await Rewriter.create(options);
            statusDiv.textContent = 'Rewriting text...';
            const rewrittenText = await rewriter.rewrite(originalText, { context: 'User requested rewrite.' });
            resultArea.value = rewrittenText;
            statusDiv.textContent = `Text rewritten successfully! (Tone: ${validTone}, Length: ${validLength})`;
            rewriter.destroy();
        } catch (error) {
            console.error('Rewriter API Error:', error);
            resultArea.value = `Error: ${error.message}`;
            statusDiv.textContent = 'Error occurred. Check console for details.';
            statusDiv.className = 'status error';
        } finally {
            rewriteBtn.disabled = false;
            rewriteBtn.textContent = 'Rewrite Text';
        }
    });

    // Load saved settings
    chrome.storage.local.get(['rewriterText', 'rewriterTone', 'rewriterLength'], function(result) {
        if (result.rewriterText) originalTextArea.value = result.rewriterText;
        if (result.rewriterTone) toneSelect.value = result.rewriterTone;
        if (result.rewriterLength) lengthSelect.value = result.rewriterLength;
    });

    // Save settings when changed
    originalTextArea.addEventListener('input', () => {
        chrome.storage.local.set({rewriterText: originalTextArea.value});
    });

    toneSelect.addEventListener('change', () => {
        chrome.storage.local.set({rewriterTone: toneSelect.value});
    });

    lengthSelect.addEventListener('change', () => {
        chrome.storage.local.set({rewriterLength: lengthSelect.value});
    });

    // Sample button event listeners
    document.getElementById('sampleEmailBtn').addEventListener('click', function() {
        loadSampleText('email');
    });
    document.getElementById('sampleParagraphBtn').addEventListener('click', function() {
        loadSampleText('paragraph');
    });
    document.getElementById('sampleSocialBtn').addEventListener('click', function() {
        loadSampleText('social');
    });
});
