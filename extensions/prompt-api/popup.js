document.addEventListener('DOMContentLoaded', function() {
    const promptInput = document.getElementById('prompt');
    const generateBtn = document.getElementById('generateBtn');
    const resultDiv = document.getElementById('result');
    const statusDiv = document.getElementById('status');

    generateBtn.addEventListener('click', async function() {
        const prompt = promptInput.value.trim();
        
        if (!prompt) {
            resultDiv.textContent = 'Please enter a prompt';
            resultDiv.className = 'result error';
            return;
        }

        generateBtn.disabled = true;
        generateBtn.textContent = 'Generating...';
        statusDiv.textContent = 'Checking Gemini Nano availability...';
        resultDiv.className = 'result';
        resultDiv.textContent = 'Processing...';

        try {
            // Check if the Prompt API is available
            if (!('ai' in window) || !('languageModel' in window.ai)) {
                throw new Error('Gemini Nano Prompt API not available. Make sure you\'re using Chrome Canary with the appropriate flags enabled.');
            }

            statusDiv.textContent = 'Creating AI session...';
            
            // Create a new AI session
            const session = await window.ai.languageModel.create({
                temperature: 0.7,
                topK: 3
            });

            statusDiv.textContent = 'Generating response...';
            
            // Generate response
            const response = await session.prompt(prompt);
            
            resultDiv.textContent = response;
            statusDiv.textContent = 'Response generated successfully!';
            
            // Clean up session
            session.destroy();
            
        } catch (error) {
            console.error('Error:', error);
            resultDiv.textContent = `Error: ${error.message}`;
            resultDiv.className = 'result error';
            statusDiv.textContent = 'Error occurred. Check console for details.';
        } finally {
            generateBtn.disabled = false;
            generateBtn.textContent = 'Generate Response';
        }
    });

    // Load saved prompt on startup
    chrome.storage.local.get(['lastPrompt'], function(result) {
        if (result.lastPrompt) {
            promptInput.value = result.lastPrompt;
        }
    });

    // Save prompt when changed
    promptInput.addEventListener('input', function() {
        chrome.storage.local.set({lastPrompt: promptInput.value});
    });
});