// Content script for Gemini Nano Translator API Demo

console.log('Gemini Nano Translator API content script loaded');

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getSelectedText') {
        const selectedText = window.getSelection().toString();
        sendResponse({text: selectedText});
    }
});