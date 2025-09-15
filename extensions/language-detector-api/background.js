// Background service worker for Gemini Nano Language Detector API Demo

chrome.runtime.onInstalled.addListener(() => {
    console.log('Gemini Nano Language Detector API Extension installed');
});

chrome.action.onClicked.addListener((tab) => {
    chrome.action.openPopup();
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'checkLanguageDetectorAvailability') {
        sendResponse({available: true});
    }
});