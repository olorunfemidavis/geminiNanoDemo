// Content script for Gemini Nano Proofreader API Demo

importScripts('../shared/content-helpers.js');

console.log('Gemini Nano Proofreader API content script loaded');

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getSelectedText') {
        sendResponse({text: getSelectedText()});
    }
});
