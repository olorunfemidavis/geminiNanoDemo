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
            // Check if the Rewriter API is available
            if (!('ai' in window) || !('rewriter' in window.ai)) {
                throw new Error('Gemini Nano Rewriter API not available. Make sure you\'re using Chrome Canary with the Rewriter API flag enabled.');
            }

            statusDiv.textContent = 'Creating rewriter session...';
            
            // Create a rewriter session with specified parameters
            const rewriterOptions = {
                tone: tone,
                length: length
            };

            const rewriter = await window.ai.rewriter.create(rewriterOptions);

            statusDiv.textContent = 'Rewriting text...';
            
            // Rewrite the text
            const rewrittenText = await rewriter.rewrite(originalText);
            
            resultArea.value = rewrittenText;
            statusDiv.textContent = `Text rewritten successfully! (Tone: ${tone}, Length: ${length})`;
            
            // Clean up session
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
});