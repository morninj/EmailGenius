let popupWindowId: number | undefined;
let triggeringTabId: number | undefined;

// Handle login popup window
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === 'open_new_popup') {
    triggeringTabId = sender.tab?.id;
    chrome.windows.getCurrent((currentWindow) => {
      // Center popup window in parent
      const width = 500;
      const height = 600;
      const left = Math.round(
        currentWindow.left! + (currentWindow.width! - width) / 2,
      );
      const top = Math.round(
        currentWindow.top! + (currentWindow.height! - height) / 2,
      );

      // Create popup window
      chrome.windows.create(
        {
          url: request.url,
          type: 'popup',
          width,
          height,
          left,
          top,
        },
        (window) => {
          popupWindowId = window!.id;
        },
      );
    });
  } else if (request.message === 'close_window') {
    // Close popup window (invoked from content script in popup)
    chrome.windows.remove(popupWindowId as number);
  } else if (request.message === 'get_triggering_tab_id') {
    // Get tab ID (used to get the ID of the original parent tab)
    sendResponse({ triggeringTabId });
  } else if (request.message === 'send_tab_message') {
    chrome.tabs.sendMessage(request.tabId, request.data);
  }
});
