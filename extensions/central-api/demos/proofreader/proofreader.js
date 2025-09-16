// Gemini Nano Proofreader API Demo

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
            console.log('Input to Proofreader:', text);
            if (!('Proofreader' in self)) {
                throw new Error('Gemini Nano Proofreader API not available. Make sure you\'re using Chrome Canary with the Proofreader API flag enabled.');
            }
            statusDiv.textContent = 'Checking model availability...';
            const options = {
                expectedInputLanguages: ['en'],
                monitor(m) {
                    if (typeof m.addEventListener === 'function') {
                        m.addEventListener('downloadprogress', e => {
                            statusDiv.textContent = `Downloaded ${Math.round(e.loaded * 100)}%`;
                        });
                    }
                }
            };
            const available = await Proofreader.availability();
            if (available === 'unavailable') {
                throw new Error('Proofreader API is not usable.');
            }
            statusDiv.textContent = 'Creating proofreader session...';
            const proofreader = await Proofreader.create(options);
            statusDiv.textContent = 'Analyzing and correcting text...';
            const result = await proofreader.proofread(text);
            console.log('Proofreader API output:', result);
            resultArea.value = result.correctedInput || result.corrected || result.correctedText || '';
            if (result.corrections && result.corrections.length > 0) {
                displayCorrections(result.corrections, text);
                statusDiv.textContent = `Text proofread successfully! Found ${result.corrections.length} corrections.`;
            } else if ((result.corrected || result.correctedText) && (result.corrected || result.correctedText) !== text) {
                statusDiv.textContent = 'Text proofread successfully! Corrections were made.';
            } else {
                statusDiv.textContent = 'Text proofread successfully! No corrections needed.';
            }
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

    function displayCorrections(corrections, input) {
        correctionsList.innerHTML = '';
        let inputRenderIndex = 0;
        corrections.forEach(correction => {
            // Render part of input that has no error.
            if (correction.startIndex > inputRenderIndex) {
                const unchangedInput = document.createElement('span');
                unchangedInput.textContent = input.substring(inputRenderIndex, correction.startIndex);
                correctionsList.appendChild(unchangedInput);
            }
            // Render part of input that has an error and highlight as such.
            const errorInput = document.createElement('span');
            errorInput.textContent = input.substring(correction.startIndex, correction.endIndex);
            errorInput.classList.add('error');
            correctionsList.appendChild(errorInput);
            inputRenderIndex = correction.endIndex;
        });
        // Render the rest of the input that has no error.
        if (inputRenderIndex !== input.length){
            const unchangedInput = document.createElement('span');
            unchangedInput.textContent = input.substring(inputRenderIndex, input.length);
            correctionsList.appendChild(unchangedInput);
        }
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

    // Attach event listeners for sample text buttons
    document.getElementById('sampleEmailBtn').addEventListener('click', function() {
        textArea.value = sampleTexts.email;
        chrome.storage.local.set({proofreaderText: textArea.value});
    });
    document.getElementById('sampleEssayBtn').addEventListener('click', function() {
        textArea.value = sampleTexts.essay;
        chrome.storage.local.set({proofreaderText: textArea.value});
    });
    document.getElementById('sampleBusinessBtn').addEventListener('click', function() {
        textArea.value = sampleTexts.business;
        chrome.storage.local.set({proofreaderText: textArea.value});
    });
});
