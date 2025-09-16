// Gemini Nano API Setup & Availability

document.addEventListener('DOMContentLoaded', async function() {
    const statusMap = {
        prompt: document.getElementById('promptStatus'),
        summarizer: document.getElementById('summarizerStatus'),
        writer: document.getElementById('writerStatus'),
        translator: document.getElementById('translatorStatus'),
        rewriter: document.getElementById('rewriterStatus'),
        proofreader: document.getElementById('proofreaderStatus'),
        languageDetector: document.getElementById('languageDetectorStatus'),
    };
    const setupDetails = document.getElementById('setupDetails');

    // Helper to set status and show/hide download button
    function setStatus(api, status, progress) {
        statusMap[api].textContent = status.charAt(0).toUpperCase() + status.slice(1);
        statusMap[api].className = 'api-status ' + status;
        const downloadBtn = document.getElementById(api + 'Download');
        if (downloadBtn) {
            if (status === 'downloadable') {
                downloadBtn.style.display = '';
            } else {
                downloadBtn.style.display = 'none';
            }
        }
        if (progress) {
            statusMap[api].insertAdjacentHTML('beforeend', `<span class="progress">${progress}</span>`);
        }
    }

    // Check API availability
    async function checkAPI(api, apiObj, options = {}) {
        if (!apiObj || typeof apiObj.availability !== 'function') {
            setStatus(api, 'unavailable');
            return;
        }
        try {
            let availability = await apiObj.availability(options);
            setStatus(api, availability);
            if (availability === 'downloadable') {
                // Trigger download and show progress
                const session = await apiObj.create({
                    ...options,
                    monitor(m) {
                        if (typeof m.addEventListener === 'function') {
                            m.addEventListener('downloadprogress', e => {
                                setStatus(api, 'downloading', `Downloaded ${Math.round(e.loaded * 100)}%`);
                            });
                        }
                    }
                });
                setStatus(api, 'available');
                session.destroy();
            }
        } catch (e) {
            console.error(`${api} API check error:`, e);
            setStatus(api, 'unavailable');
        }
    }

    // Manual download handler for each API
    async function manualDownload(api, apiObj, options = {}) {
        setStatus(api, 'downloading', 'Starting...');
        try {
            const session = await apiObj.create({
                ...options,
                monitor(m) {
                    if (typeof m.addEventListener === 'function') {
                        m.addEventListener('downloadprogress', e => {
                            setStatus(api, 'downloading', `Downloaded ${Math.round(e.loaded * 100)}%`);
                        });
                    }
                }
            });
            setStatus(api, 'available');
            session.destroy();
        } catch (e) {
            setStatus(api, 'unavailable');
        }
    }

    // Attach download button listeners
    [
        {api: 'prompt', obj: self.LanguageModel},
        {api: 'summarizer', obj: self.Summarizer},
        {api: 'writer', obj: self.Writer},
        {api: 'translator', obj: self.Translator, options: {sourceLanguage: 'en', targetLanguage: 'es'}},
        {api: 'rewriter', obj: self.Rewriter},
        {api: 'proofreader', obj: self.Proofreader},
        {api: 'languageDetector', obj: self.LanguageDetector}
    ].forEach(({api, obj, options}) => {
        const btn = document.getElementById(api + 'Download');
        if (btn) {
            btn.addEventListener('click', () => manualDownload(api, obj, options || {}));
        }
    });

    // Feature detection for all APIs
    const apiFeatureMap = [
        {api: 'prompt', key: 'LanguageModel'},
        {api: 'summarizer', key: 'Summarizer'},
        {api: 'writer', key: 'Writer'},
        {api: 'translator', key: 'Translator'},
        {api: 'rewriter', key: 'Rewriter'},
        {api: 'proofreader', key: 'Proofreader'},
        {api: 'languageDetector', key: 'LanguageDetector'}
    ];
    for (const {api, key} of apiFeatureMap) {
        if (!(key in self)) {
            setStatus(api, 'unavailable');
            const downloadBtn = document.getElementById(api + 'Download');
            if (downloadBtn) downloadBtn.style.display = 'none';
            statusMap[api].textContent = 'Browser not supported';
            statusMap[api].className = 'api-status unavailable';
        }
    }

    // Check all APIs (only if feature detected)
    if ('LanguageModel' in self) await checkAPI('prompt', self.LanguageModel);
    if ('Summarizer' in self) await checkAPI('summarizer', self.Summarizer);
    if ('Writer' in self) await checkAPI('writer', self.Writer);
    if ('Translator' in self) await checkAPI('translator', self.Translator, { sourceLanguage: 'en', targetLanguage: 'es' });
    if ('Rewriter' in self) await checkAPI('rewriter', self.Rewriter);
    if ('Proofreader' in self) await checkAPI('proofreader', self.Proofreader);
    if ('LanguageDetector' in self) await checkAPI('languageDetector', self.LanguageDetector);

    // Details
    setupDetails.innerHTML = `<p><b>Legend:</b> <span class='available'>Available</span>, <span class='downloadable'>Downloadable</span>, <span class='downloading'>Downloading</span>, <span class='unavailable'>Unavailable</span></p>
    <p>If an API is <b>downloadable</b>, the extension will trigger the download and show progress. If <b>unavailable</b>, check Chrome flags and browser version.</p>`;
});
