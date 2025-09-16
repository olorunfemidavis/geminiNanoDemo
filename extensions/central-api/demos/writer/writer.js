document.addEventListener('DOMContentLoaded', function() {
    const topicInput = document.getElementById('topic');
    const toneSelect = document.getElementById('tone');
    const lengthSelect = document.getElementById('length');
    const formatSelect = document.getElementById('format'); // Add format if present in HTML
    const writeBtn = document.getElementById('writeBtn');
    const resultArea = document.getElementById('result');
    const statusDiv = document.getElementById('status');

    writeBtn.addEventListener('click', async function() {
        const topic = topicInput.value.trim();
        const tone = toneSelect.value;
        const length = lengthSelect.value;
        const allowedFormats = ['plain-text', 'markdown'];
        const format = formatSelect && allowedFormats.includes(formatSelect.value) ? formatSelect.value : 'plain-text';
        const sharedContext = 'This is a writing assistant.';
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
            if (!('Writer' in self)) {
                throw new Error('Gemini Nano Writer API not available. Make sure you\'re using Chrome Canary with the Writer API flag enabled.');
            }
            statusDiv.textContent = 'Checking model availability...';
            const allowedTones = ['formal', 'neutral', 'casual'];
            const validTone = allowedTones.includes(tone) ? tone : 'neutral';
            const options = {
                tone: validTone,
                length,
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
            const available = await Writer.availability();
            let writer;
            if (available === 'unavailable') {
                throw new Error('Writer API is not usable.');
            }
            statusDiv.textContent = 'Creating writer session...';
            writer = await Writer.create(options);
            statusDiv.textContent = 'Generating content...';
            const content = await writer.write(topic, { context: 'User requested writing task.' });
            resultArea.value = content;
            statusDiv.textContent = `Content generated successfully! (Tone: ${tone}, Length: ${length})`;
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
