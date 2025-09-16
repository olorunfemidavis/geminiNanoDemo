let summarizer;

async function generateSummary(text, options) {
    try {
        const availability = await Summarizer.availability();
        if (availability === 'unavailable') {
            return 'Summarizer API is not available';
        }
        if (availability === 'available') {
            summarizer = await Summarizer.create(options);
        } else {
            summarizer = await Summarizer.create(options);
            if (typeof summarizer.addEventListener === 'function') {
                summarizer.addEventListener('downloadprogress', (e) => {
                    console.log(`Downloaded ${e.loaded * 100}%`);
                });
            }
            if (summarizer.ready) {
                await summarizer.ready;
            }
        }
        const summary = await summarizer.summarize(text);
        summarizer.destroy();
        return summary;
    } catch (e) {
        console.log('Summary generation failed');
        console.error(e);
        return 'Error: ' + e.message;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const textArea = document.getElementById('textToSummarize');
    const summaryTypeSelect = document.getElementById('summaryType');
    const summaryLengthSelect = document.getElementById('summaryLength');
    const summarizeBtn = document.getElementById('summarizeBtn');
    const resultArea = document.getElementById('result');
    const statusDiv = document.getElementById('status');

    // Sample texts for quick testing
    const sampleTexts = {
        article: "Climate change refers to long-term shifts in global temperatures and weather patterns. While climate variations are natural, human activities have been the main driver since the 1800s, primarily through burning fossil fuels like coal, oil and gas. This produces greenhouse gas emissions that act like a blanket wrapped around the Earth, trapping the sun's heat and raising temperatures. The consequences include more frequent droughts, water scarcity, severe fires, rising sea levels, flooding, melting polar ice, catastrophic storms and declining biodiversity. People are experiencing climate change in diverse ways including changing weather patterns, rising sea level, and more extreme weather events. Despite the challenges, there are solutions available including renewable energy sources, energy efficiency improvements, protecting natural habitats, and sustainable agriculture practices.",
        research: "A recent study published in the Journal of Environmental Science examined the effects of microplastics on marine ecosystems over a five-year period. Researchers collected samples from 150 different locations across three major ocean basins and analyzed the concentration of plastic particles smaller than 5mm in diameter. The findings revealed a 300% increase in microplastic concentration since 2018, with the highest levels found near urban coastal areas. The study also documented impacts on marine life, including reduced feeding efficiency in filter-feeding organisms and potential bioaccumulation in the food chain. The research team concluded that immediate action is needed to reduce plastic pollution at its source, including improved waste management systems and the development of biodegradable alternatives to conventional plastics. The study's methodology involved advanced spectroscopy techniques and collaboration with marine biology experts from twelve international institutions."
    };

    // Load sample text function (global scope for onclick handlers)
    window.loadSampleText = function(type) {
        if (sampleTexts[type]) {
            textArea.value = sampleTexts[type];
            chrome.storage.local.set({summarizerText: textArea.value});
        }
    };

    // Summarize current page function
    window.summarizeCurrentPage = function() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {action: 'getPageContent'}, function(response) {
                if (response && response.content) {
                    textArea.value = response.content;
                    chrome.storage.local.set({summarizerText: textArea.value});
                    statusDiv.textContent = 'Page content loaded. Click "Generate Summary" to proceed.';
                } else {
                    statusDiv.textContent = 'Could not extract page content. Try copying and pasting text manually.';
                    statusDiv.className = 'status error';
                }
            });
        });
    };

    summarizeBtn.addEventListener('click', async function() {
        const text = textArea.value.trim();
        const summaryType = summaryTypeSelect.value;
        const summaryLength = summaryLengthSelect.value;
        
        if (!text) {
            resultArea.value = 'Please enter text to summarize';
            statusDiv.textContent = 'Error: No text provided';
            statusDiv.className = 'status error';
            return;
        }

        summarizeBtn.disabled = true;
        summarizeBtn.textContent = 'Summarizing...';
        statusDiv.textContent = 'Checking Gemini Nano Summarizer API availability...';
        statusDiv.className = 'status';
        resultArea.value = 'Generating summary...';

        try {
            if (!('Summarizer' in window)) {
                throw new Error('Gemini Nano Summarizer API not available. Make sure you\'re using Chrome Canary with the Summarizer API flag enabled.');
            }
            const options = {
                sharedContext: 'this is a website',
                type: summaryType,
                length: summaryLength
            };
            statusDiv.textContent = 'Generating summary...';
            const summary = await generateSummary(text, options);
            resultArea.value = summary;
            statusDiv.textContent = 'Summary generated successfully!';
        } catch (error) {
            console.error('Error:', error);
            resultArea.value = `Error: ${error.message}`;
            statusDiv.textContent = 'Error occurred. Check console for details.';
            statusDiv.className = 'status error';
        } finally {
            summarizeBtn.disabled = false;
            summarizeBtn.textContent = 'Generate Summary';
        }
    });

    // Sample button event listeners
    document.getElementById('sampleArticleBtn').addEventListener('click', function() {
        loadSampleText('article');
    });
    document.getElementById('sampleResearchBtn').addEventListener('click', function() {
        loadSampleText('research');
    });
    document.getElementById('summarizePageBtn').addEventListener('click', function() {
        summarizeCurrentPage();
    });

    // Load saved text
    chrome.storage.local.get(['summarizerText'], function(result) {
        if (result.summarizerText) {
            textArea.value = result.summarizerText;
        }
    });

    textArea.addEventListener('input', function() {
        chrome.storage.local.set({summarizerText: textArea.value});
    });
});
