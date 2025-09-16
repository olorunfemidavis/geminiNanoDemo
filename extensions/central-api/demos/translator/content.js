// Content script for Gemini Nano Translator API Demo

importScripts('../shared/content-helpers.js');

console.log('Gemini Nano Translator API content script loaded');

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getSelectedText') {
        sendResponse({text: getSelectedText()});
    }
});
