// Background service worker for Gemini Nano Rewriter API Demo

chrome.runtime.onInstalled.addListener(() => {
    console.log('Gemini Nano Rewriter API Extension installed');
});

chrome.action.onClicked.addListener((tab) => {
    chrome.action.openPopup();
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'checkRewriterAvailability') {
        sendResponse({available: true});
    }
});