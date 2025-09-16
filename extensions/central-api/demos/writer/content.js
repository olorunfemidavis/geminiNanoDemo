// Content script for Gemini Nano Writer API Demo

importScripts('../shared/content-helpers.js');

console.log('Gemini Nano Writer API content script loaded');

// Listen for messages from popup or background
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getSelectedText') {
        sendResponse({text: getSelectedText()});
    }
});
