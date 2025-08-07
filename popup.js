// Send message to content.js to toggle image replacement and apply custom styles
function sendMessage(message) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, message);
  });
}

// Load the saved state of the toggle switch and custom styles
function loadState() {
  chrome.storage.local.get(['imageToggle', 'fontSize', 'lineSpacing', 'fontFamily'], (result) => {
      const toggle = document.getElementById('toggle-images');
      const fontSizeSlider = document.getElementById('font-size-slider');
      const lineSpacingSlider = document.getElementById('line-spacing-slider');
      const fontFamilySelector = document.getElementById('font-family-selector');

      toggle.checked = result.imageToggle !== false; // Default to true
      fontSizeSlider.value = result.fontSize || 16;  // Default to 16px
      lineSpacingSlider.value = result.lineSpacing || 1.5;  // Default to 1.5
      fontFamilySelector.value = result.fontFamily || 'default';  // Default to browser's font
  });
}

// Save the state of the toggle switch and custom styles
function saveState(value) {
  chrome.storage.local.set(value);
}

// Add event listener for the toggle switch
document.getElementById('toggle-images').addEventListener('change', (event) => {
  const enabled = event.target.checked;
  saveState({ imageToggle: enabled });
  sendMessage({ action: "toggleImages", enabled });
});

// Add event listener for font size slider
document.getElementById('font-size-slider').addEventListener('input', (event) => {
  const fontSize = event.target.value + 'px';
  saveState({ fontSize });
  sendMessage({ action: "applyCustomStyle", fontSize, lineSpacing: document.getElementById('line-spacing-slider').value, fontFamily: document.getElementById('font-family-selector').value });
});

// Add event listener for line spacing slider
document.getElementById('line-spacing-slider').addEventListener('input', (event) => {
  const lineSpacing = event.target.value;
  saveState({ lineSpacing });
  sendMessage({ action: "applyCustomStyle", fontSize: document.getElementById('font-size-slider').value + 'px', lineSpacing, fontFamily: document.getElementById('font-family-selector').value });
});

// Add event listener for font family selector
document.getElementById('font-family-selector').addEventListener('change', (event) => {
  const fontFamily = event.target.value;
  saveState({ fontFamily });
  sendMessage({ action: "applyCustomStyle", fontSize: document.getElementById('font-size-slider').value + 'px', lineSpacing: document.getElementById('line-spacing-slider').value, fontFamily });
});

// Load the state when the popup is opened
document.addEventListener('DOMContentLoaded', loadState);

// Send message to summarize the current paragraph
document.getElementById('summarize-paragraph').addEventListener('click', () => {
  sendMessage({ action: 'summarize' }, (response) => {
      const summaryDisplay = document.getElementById('summary-display');
      summaryDisplay.textContent = response.summary; // Display the summary in the popup
  });
});

// Function to send messages to the content script
function sendMessage(message, callback) {
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  chrome.tabs.sendMessage(tabs[0].id, message, callback);
});
}
