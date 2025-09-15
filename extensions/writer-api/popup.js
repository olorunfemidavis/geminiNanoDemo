document.addEventListener('DOMContentLoaded', function() {
    const topicInput = document.getElementById('topic');
    const toneSelect = document.getElementById('tone');
    const lengthSelect = document.getElementById('length');
    const writeBtn = document.getElementById('writeBtn');
    const resultArea = document.getElementById('result');
    const statusDiv = document.getElementById('status');

    writeBtn.addEventListener('click', async function() {
        const topic = topicInput.value.trim();
        const tone = toneSelect.value;
        const length = lengthSelect.value;
        
        if (!topic) {
            resultArea.value = 'Please enter a topic to write about';
            statusDiv.textContent = 'Error: No topic provided';
            statusDiv.className = 'status error';
            return;
        }

        writeBtn.disabled = true;
        writeBtn.textContent = 'Writing...';
        statusDiv.textContent = 'Checking Gemini Nano Writer API availability...';
        statusDiv.className = 'status';
        resultArea.value = 'Generating content...';

        try {
            // Check if the Writer API is available
            if (!('ai' in window) || !('writer' in window.ai)) {
                throw new Error('Gemini Nano Writer API not available. Make sure you\'re using Chrome Canary with the Writer API flag enabled.');
            }

            statusDiv.textContent = 'Creating writer session...';
            
            // Create a writer session with specified parameters
            const writerOptions = {
                tone: tone,
                length: length
            };

            const writer = await window.ai.writer.create(writerOptions);

            statusDiv.textContent = 'Generating content...';
            
            // Generate content based on the topic
            const content = await writer.write(topic);
            
            resultArea.value = content;
            statusDiv.textContent = `Content generated successfully! (Tone: ${tone}, Length: ${length})`;
            
            // Clean up session
            writer.destroy();
            
        } catch (error) {
            console.error('Writer API Error:', error);
            resultArea.value = `Error: ${error.message}`;
            statusDiv.textContent = 'Error occurred. Check console for details.';
            statusDiv.className = 'status error';
        } finally {
            writeBtn.disabled = false;
            writeBtn.textContent = 'Generate Content';
        }
    });

    // Load saved settings
    chrome.storage.local.get(['writerTopic', 'writerTone', 'writerLength'], function(result) {
        if (result.writerTopic) topicInput.value = result.writerTopic;
        if (result.writerTone) toneSelect.value = result.writerTone;
        if (result.writerLength) lengthSelect.value = result.writerLength;
    });

    // Save settings when changed
    topicInput.addEventListener('input', () => {
        chrome.storage.local.set({writerTopic: topicInput.value});
    });

    toneSelect.addEventListener('change', () => {
        chrome.storage.local.set({writerTone: toneSelect.value});
    });

    lengthSelect.addEventListener('change', () => {
        chrome.storage.local.set({writerLength: lengthSelect.value});
    });
});