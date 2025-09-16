// Background script for Gemini Nano Central API Demo

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'generateAltText',
    title: 'Generate alt text',
    contexts: ['image']
  });
  console.log('Gemini Nano Central API Extension installed');
});

chrome.action.onClicked.addListener(() => {
  chrome.tabs.create({
    url: chrome.runtime.getURL('popup.html')
  });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'checkAIAvailability' ||
      request.action === 'checkSummarizerAvailability' ||
      request.action === 'checkWriterAvailability' ||
      request.action === 'checkTranslatorAvailability' ||
      request.action === 'checkRewriterAvailability' ||
      request.action === 'checkProofreaderAvailability' ||
      request.action === 'checkLanguageDetectorAvailability') {
    sendResponse({available: true});
  }
});

// Alt Texter context menu integration
async function generateAltText(imgSrc) {
  const availability = await self.LanguageModel.availability();
  if (availability === 'unavailable') {
    throw new Error('Gemini Nano model is not available on this device.');
  }
  let session;
  if (availability === 'available') {
    session = await self.LanguageModel.create({
      temperature: 0.0,
      topK: 1.0,
      expectedInputs: [{ type: 'image' }]
    });
  } else {
    session = await self.LanguageModel.create({
      temperature: 0.0,
      topK: 1.0,
      expectedInputs: [{ type: 'image' }],
      monitor(m) {
        if (typeof m.addEventListener === 'function') {
          m.addEventListener('downloadprogress', e => {
            console.log(`Downloaded ${Math.round(e.loaded * 100)}%`);
          });
        }
      }
    });
  }

  // Create an image bitmap to pass it to the prompt
  const response = await fetch(imgSrc);
  const blob = await response.blob();
  const imageBitmap = await createImageBitmap(blob);

  // Run the prompt
  const prompt = [
    {
      role: 'user',
      content: [
        {
          type: 'text',
          value: `Please provide a functional, objective description of the provided image in no more than around 30 words so that someone who could not see it would be able to imagine it. If possible, follow an object-action-context framework. The object is the main focus. The action describes what’s happening, usually what the object is doing. The context describes the surrounding environment. If there is text found in the image, do your best to transcribe the important bits, even if it extends the word count beyond 30 words. It should not contain quotation marks, as those tend to cause issues when rendered on the web. If there is no text found in the image, then there is no need to mention it. You should not begin the description with any variation of “The image”.`
        },
        { type: 'image', value: imageBitmap }
      ]
    }
  ];
  return await session.prompt(prompt);
}

chrome.contextMenus.onClicked.addListener(async (info, _tab) => {
  if (info.menuItemId === 'generateAltText' && info.srcUrl) {
    // Start opening the popup
    const [result] = await Promise.allSettled([
      generateAltText(info.srcUrl),
      chrome.action.openPopup()
    ]);
    chrome.runtime.sendMessage({
      action: 'alt-text',
      text: result.status === 'fulfilled' ? result.value : result.reason.message
    });
  }
});
