// Background service worker for Gemini Nano Proofreader API Demo

chrome.runtime.onInstalled.addListener(() => {
    console.log('Gemini Nano Proofreader API Extension installed');
});

chrome.action.onClicked.addListener((tab) => {
    chrome.action.openPopup();
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'checkProofreaderAvailability') {
        sendResponse({available: true});
    }
});