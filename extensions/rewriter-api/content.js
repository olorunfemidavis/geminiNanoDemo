// Content script for Gemini Nano Rewriter API Demo

console.log('Gemini Nano Rewriter API content script loaded');

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getSelectedText') {
        const selectedText = window.getSelection().toString();
        sendResponse({text: selectedText});
    }
});