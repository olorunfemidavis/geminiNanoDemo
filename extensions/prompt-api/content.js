// Content script for Gemini Nano Prompt API Demo
// This script can interact with the page content if needed

console.log('Gemini Nano Prompt API content script loaded');

// Listen for messages from popup or background
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getPageContent') {
        // Get page text content for context if needed
        const pageText = document.body.innerText.slice(0, 1000); // First 1000 chars
        sendResponse({content: pageText});
    }
});