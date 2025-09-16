// Shared content script helpers for Gemini Nano Central API

// Get selected text from the page
function getSelectedText() {
  return window.getSelection().toString();
}

// Extract main content from the page using selectors
function extractMainContent(selectors, fallbackLength = 1000) {
  for (const selector of selectors) {
    const element = document.querySelector(selector);
    if (element) {
      const text = element.innerText || element.textContent;
      if (text && text.length > 100) {
        return text.slice(0, fallbackLength).trim();
      }
    }
  }
  return document.body.innerText.slice(0, fallbackLength).trim();
}

// Clean up text (remove extra whitespace/newlines)
function cleanText(text, maxLength = 1000) {
  return text
    .replace(/\s+/g, ' ')
    .replace(/\n+/g, ' ')
    .trim()
    .slice(0, maxLength);
}
