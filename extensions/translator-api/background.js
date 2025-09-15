// Background service worker for Gemini Nano Translator API Demo

chrome.runtime.onInstalled.addListener(() => {
    console.log('Gemini Nano Translator API Extension installed');
});

chrome.action.onClicked.addListener((tab) => {
    chrome.action.openPopup();
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'checkTranslatorAvailability') {
        sendResponse({available: true});
    }
});