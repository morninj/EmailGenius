import debugLog from './debug';
import { DASHBOARD_URL, LOGIN_POPUP_URL, SIGNED_OUT_URL } from '../config';
import { clearAllStatusMessages, showStatusMessage } from './ui/status-message';

// Save token in Chrome local storage
export function saveTokenLocally(token: string) {
  debugLog(`Saving token: ${token}`);
  chrome.storage.local.set({ token }, () => {
    debugLog('Token is saved in local storage');
  });
}

// Get token from Chrome local storage
export async function getTokenLocally() {
  debugLog('Getting token from local storage...');
  return new Promise((resolve) => {
    chrome.storage.local.get(['token'], (result) => {
      resolve(result.token);
    });
  });
}

// Remove token from Chrome local storage
export function removeTokenLocally() {
  debugLog('Removing token from local storage...');
  chrome.storage.local.remove('token');
}

// Check if the user is logged in by checking for a locally stored token
export async function isUserLoggedIn() {
  const token = await getTokenLocally();
  return !!token;
}

// Show login prompt if the user is not logged in
export async function authenticationCheck(containerId: string) {
  if (!(await isUserLoggedIn())) {
    showStatusMessage({
      type: 'welcome',
      message:
        'Welcome to EmailGenius! Please <a href="#" class="eg-auth-link">log in</a> to continue.',
      containerId,
      changeState: false,
      cancellable: false,
    });
  }
}

// Show welcome message upon login
export function showLoggedInWelcomeMessage() {
  debugLog('Showing logged-in welcome message...');
  showStatusMessage({
    type: 'welcome',
    message:
      "To use EmailGenius, type instructions in the box below, like &ldquo;write a thank-you note&rdquo; or &ldquo;ask a friend for book recommendations.&rdquo;<br /><br />After the message is created, you can give more instructions, like &ldquo;make it shorter&rdquo; or &ldquo;make it funnier.&rdquo;<br /><br />When you're ready, you can add the message to your email, edit it, and send it.",
  });
}

// Grab and save the Chrome extension token from the EmailGenius login flow
export function listenForTokenActions() {
  const listenInterval = 200;
  const maxAttempts = 1000;
  let attempts = 0;

  // If we're on a token display page, check for token (up to `maxAttempts` times)
  if (
    (window.location.href.includes(DASHBOARD_URL) ||
      window.location.href.includes(LOGIN_POPUP_URL)) &&
    !window.location.href.includes(SIGNED_OUT_URL)
  ) {
    debugLog('Trying to extract token from page...');

    setTimeout(function checkForToken() {
      attempts += 1;
      if (attempts < maxAttempts) {
        // The token will be embedded in an element with id #chrome-extension-token
        const tokenElement = $('#chrome-extension-token');
        if (tokenElement.length) {
          const token = tokenElement.text();
          debugLog(`Token found: ${token}`);
          saveTokenLocally(token);

          // Close the login popup window and show logged-in welcome message
          if (window.location.href.includes(LOGIN_POPUP_URL)) {
            /** Show the logged-in welcome message (via the background script)
             * This is necessary because this block is getting invoked in the
             * popup window, not in the parent tab
             */
            debugLog('Showing logged-in welcome message...');
            chrome.runtime.sendMessage(
              { message: 'get_triggering_tab_id' },
              (response) => {
                const { triggeringTabId } = response;
                chrome.runtime.sendMessage({
                  message: 'send_tab_message',
                  tabId: triggeringTabId,
                  data: { message: 'show_logged_in_welcome_message' },
                });
              },
            );

            // Close the login popup window
            debugLog('Closing login popup window...');
            chrome.runtime.sendMessage({ message: 'close_window' });
          }
        } else {
          debugLog(
            `Token not found; trying again (attempt ${attempts} of ${maxAttempts})...`,
          );
          setTimeout(checkForToken, listenInterval);
        }
      }
    }, listenInterval);
  }

  // Remove token if we're on the signout page
  if (window.location.href.includes(SIGNED_OUT_URL)) {
    removeTokenLocally();
  }
}

// Show a popup window and authenticate the user
export function showAuthenticationFlow() {
  chrome.runtime.sendMessage({
    message: 'open_new_popup',
    url: LOGIN_POPUP_URL,
  });
}

// Listen for the "logged in" message from the background script
export function attachLoggedInMessageListener() {
  chrome.runtime.onMessage.addListener((request) => {
    debugLog(`Received message: ${request.message}`);
    if (request.message === 'show_logged_in_welcome_message') {
      clearAllStatusMessages();
      showLoggedInWelcomeMessage();
    }
  });
}
