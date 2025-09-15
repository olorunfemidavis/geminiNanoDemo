// Background service worker for Gemini Nano Writer API Demo

chrome.runtime.onInstalled.addListener(() => {
    console.log('Gemini Nano Writer API Extension installed');
});

// Handle extension icon click
chrome.action.onClicked.addListener((tab) => {
    chrome.action.openPopup();
});

// Listen for messages from content script or popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'checkWriterAvailability') {
        sendResponse({available: true});
    }
});