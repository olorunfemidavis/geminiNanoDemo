// Content script for Gemini Nano Prompt API Demo
// This script can interact with the page content if needed

importScripts('../shared/content-helpers.js');

console.log('Gemini Nano Prompt API content script loaded');

// Listen for messages from popup or background
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getPageContent') {
        const pageText = extractMainContent(['body'], 1000);
        sendResponse({content: pageText});
    }
});
