// Content script for Gemini Nano Summarizer API Demo

importScripts('../shared/content-helpers.js');

console.log('Gemini Nano Summarizer API content script loaded');

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getPageContent') {
        const selectors = [
            'article', 'main', '[role="main"]', '.content', '.post-content', '.entry-content', '.article-content', 'body'
        ];
        const content = extractMainContent(selectors, 3000);
        sendResponse({content: content});
    }
});
