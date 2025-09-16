// Content script for Gemini Nano Rewriter API Demo

importScripts('../shared/content-helpers.js');

console.log('Gemini Nano Rewriter API content script loaded');

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getSelectedText') {
        sendResponse({text: getSelectedText()});
    }
});
