// Content script for Gemini Nano Language Detector API Demo

console.log('Gemini Nano Language Detector API content script loaded');

importScripts('../shared/content-helpers.js');

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getPageContent') {
        const selectors = [
            'article', 'main', '[role="main"]', '.content', '.post-content', '.entry-content', '.article-content', 'p', 'h1, h2, h3, h4, h5, h6'
        ];
        let text = extractMainContent(selectors, 1000);
        text = cleanText(text, 1000);
        sendResponse({content: text});
    }
});
