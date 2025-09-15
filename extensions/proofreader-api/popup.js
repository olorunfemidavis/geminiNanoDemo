document.addEventListener('DOMContentLoaded', function() {
    const textArea = document.getElementById('textToProofread');
    const proofreadBtn = document.getElementById('proofreadBtn');
    const resultArea = document.getElementById('result');
    const statusDiv = document.getElementById('status');
    const correctionsDiv = document.getElementById('corrections');
    const correctionsList = document.getElementById('correctionsList');

    // Sample texts with intentional errors for demonstration
    const sampleTexts = {
        email: "Dear Mr. Johnson, I hope this email finds you well. I wanted to folowup on our conversation from last weak. The proposal you sent was very intresting and I beleive it aligns perfectly with our companys goals. Could we schedual a meeting for next tuesday to discuss the detailes further? I look foward to hearing from you soon. Best reguards, John Smith",
        essay: "Climate chang is one of the most presing issues of our time. The effects of global warming are becomming increasingly aparent, with riasing sea levels, extreem weather events, and shifts in ecosistems. Scientists have been studyng this phenomena for decades and the evidance is overwelming. We must take imediate action to reduce greenhouse gas emisions and transition to renewable energy sorces.",
        business: "Our compny has seen signifigant growth over the past quater. Revenue has incresed by 25% compared to the previus year, and we've sucessfully expended into three new markts. However, we face challanges in maintaing our competative advantge in the face of incresing competetion. Our strategik plan for the next fical year focueses on inovation and custmer satisfacton."
    };

    // Load sample text function (global scope for onclick handlers)
    window.loadSampleText = function(type) {
        if (sampleTexts[type]) {
            textArea.value = sampleTexts[type];
            chrome.storage.local.set({proofreaderText: textArea.value});
        }
    };

    proofreadBtn.addEventListener('click', async function() {
        const text = textArea.value.trim();
        
        if (!text) {
            resultArea.value = 'Please enter text to proofread';
            statusDiv.textContent = 'Error: No text provided';
            statusDiv.className = 'status error';
            return;
        }

        proofreadBtn.disabled = true;
        proofreadBtn.textContent = 'Proofreading...';
        statusDiv.textContent = 'Checking Gemini Nano Proofreader API availability...';
        statusDiv.className = 'status';
        resultArea.value = 'Analyzing text for errors...';
        correctionsDiv.style.display = 'none';

        try {
            // Check if the Proofreader API is available
            if (!('ai' in window) || !('proofreader' in window.ai)) {
                throw new Error('Gemini Nano Proofreader API not available. Make sure you\'re using Chrome Canary with the Proofreader API flag enabled.');
            }

            statusDiv.textContent = 'Creating proofreader session...';
            
            // Create a proofreader session
            const proofreader = await window.ai.proofreader.create();

            statusDiv.textContent = 'Analyzing and correcting text...';
            
            // Proofread the text and get corrections
            const result = await proofreader.proofread(text);
            
            // Display corrected text
            resultArea.value = result.correctedText || result;
            
            // Show corrections if available
            if (result.corrections && result.corrections.length > 0) {
                displayCorrections(result.corrections);
                statusDiv.textContent = `Text proofread successfully! Found ${result.corrections.length} corrections.`;
            } else {
                statusDiv.textContent = 'Text proofread successfully! No corrections needed.';
            }
            
            // Clean up session
            proofreader.destroy();
            
        } catch (error) {
            console.error('Proofreader API Error:', error);
            resultArea.value = `Error: ${error.message}`;
            statusDiv.textContent = 'Error occurred. Check console for details.';
            statusDiv.className = 'status error';
        } finally {
            proofreadBtn.disabled = false;
            proofreadBtn.textContent = 'Proofread Text';
        }
    });

    function displayCorrections(corrections) {
        correctionsList.innerHTML = '';
        corrections.forEach(correction => {
            const item = document.createElement('div');
            item.className = 'correction-item';
            item.innerHTML = `
                <span class="original">${correction.original}</span> → 
                <span class="corrected">${correction.corrected}</span>
                ${correction.reason ? `<br><small>${correction.reason}</small>` : ''}
            `;
            correctionsList.appendChild(item);
        });
        correctionsDiv.style.display = 'block';
    }

    // Load saved text
    chrome.storage.local.get(['proofreaderText'], function(result) {
        if (result.proofreaderText) {
            textArea.value = result.proofreaderText;
        }
    });

    // Save text when changed
    textArea.addEventListener('input', () => {
        chrome.storage.local.set({proofreaderText: textArea.value});
    });
});