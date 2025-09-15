// Content script for Gemini Nano Writer API Demo

console.log('Gemini Nano Writer API content script loaded');

// Listen for messages from popup or background
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getSelectedText') {
        const selectedText = window.getSelection().toString();
        sendResponse({text: selectedText});
    }
});