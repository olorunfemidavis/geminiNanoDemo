// Content script for Gemini Nano Summarizer API Demo

console.log('Gemini Nano Summarizer API content script loaded');

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getPageContent') {
        // Extract main text content from the page
        const content = extractMainContent();
        sendResponse({content: content});
    }
});

function extractMainContent() {
    // Try to get content from common article containers first
    const selectors = [
        'article',
        'main',
        '[role="main"]',
        '.content',
        '.post-content',
        '.entry-content',
        '.article-content',
        'body'
    ];
    
    for (const selector of selectors) {
        const element = document.querySelector(selector);
        if (element) {
            const text = element.innerText || element.textContent;
            if (text && text.length > 100) {
                // Return first 3000 characters to avoid overwhelming the API
                return text.slice(0, 3000).trim();
            }
        }
    }
    
    // Fallback to body text
    return document.body.innerText.slice(0, 3000).trim();
}