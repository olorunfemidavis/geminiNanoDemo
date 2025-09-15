// Background service worker for Gemini Nano Prompt API Demo

chrome.runtime.onInstalled.addListener(() => {
    console.log('Gemini Nano Prompt API Extension installed');
});

// Handle extension icon click
chrome.action.onClicked.addListener((tab) => {
    chrome.action.openPopup();
});

// Listen for messages from content script or popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'checkAIAvailability') {
        // This would typically check if AI is available in the background
        // For now, we'll delegate this to the popup/content script
        sendResponse({available: true});
    }
});