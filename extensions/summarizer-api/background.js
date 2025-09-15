// Background service worker for Gemini Nano Summarizer API Demo

chrome.runtime.onInstalled.addListener(() => {
    console.log('Gemini Nano Summarizer API Extension installed');
});

chrome.action.onClicked.addListener((tab) => {
    chrome.action.openPopup();
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'checkSummarizerAvailability') {
        sendResponse({available: true});
    }
});