let session;

async function runPrompt(prompt, params) {
    try {
        if (!session) {
            session = await LanguageModel.create(params);
        }
        return session.prompt(prompt);
    } catch (e) {
        console.log('Prompt failed');
        console.error(e);
        // Reset session
        await resetSession();
        throw e;
    }
}

async function resetSession() {
    if (session) {
        await session.destroy();
    }
    session = null;
}

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
            if (!('LanguageModel' in window)) {
                throw new Error('Gemini Nano LanguageModel not available. Make sure you\'re using Chrome Canary with the appropriate flags enabled.');
            }
            statusDiv.textContent = 'Creating AI session...';
            const params = {
                initialPrompts: [
                    { role: 'system', content: 'You are a helpful and friendly assistant.' }
                ],
                temperature: 0.7,
                topK: 3,
                outputLanguage: 'en' // Specify output language for optimal quality and safety
            };
            statusDiv.textContent = 'Generating response...';
            const response = await runPrompt(prompt, params);
            resultDiv.innerHTML = response;
            statusDiv.textContent = 'Response generated successfully!';
            await resetSession();
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

    chrome.storage.local.get(['lastPrompt'], function(result) {
        if (result.lastPrompt) {
            promptInput.value = result.lastPrompt;
        }
    });

    promptInput.addEventListener('input', function() {
        chrome.storage.local.set({lastPrompt: promptInput.value});
    });
});
