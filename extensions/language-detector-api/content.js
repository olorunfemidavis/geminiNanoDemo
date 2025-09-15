// Content script for Gemini Nano Language Detector API Demo

console.log('Gemini Nano Language Detector API content script loaded');

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getPageContent') {
        // Extract meaningful text content from the page
        const content = extractPageText();
        sendResponse({content: content});
    }
});

function extractPageText() {
    // Try to get content from common content containers
    const selectors = [
        'article',
        'main',
        '[role="main"]',
        '.content',
        '.post-content',
        '.entry-content',
        '.article-content',
        'p',
        'h1, h2, h3, h4, h5, h6'
    ];
    
    let text = '';
    
    // First try structured content
    for (const selector of selectors.slice(0, 7)) {
        const element = document.querySelector(selector);
        if (element) {
            const elementText = element.innerText || element.textContent;
            if (elementText && elementText.length > 50) {
                text = elementText;
                break;
            }
        }
    }
    
    // If no structured content found, collect from paragraphs and headings
    if (!text) {
        const elements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6');
        const textParts = [];
        elements.forEach(el => {
            const elementText = (el.innerText || el.textContent).trim();
            if (elementText && elementText.length > 10) {
                textParts.push(elementText);
            }
        });
        text = textParts.slice(0, 10).join(' '); // First 10 elements
    }
    
    // Fallback to body if nothing else works
    if (!text) {
        text = document.body.innerText || document.body.textContent;
    }
    
    // Clean up the text
    return text
        .replace(/\s+/g, ' ') // Replace multiple whitespace with single space
        .replace(/\n+/g, ' ') // Replace newlines with spaces
        .trim()
        .slice(0, 1000); // Limit to 1000 characters
}