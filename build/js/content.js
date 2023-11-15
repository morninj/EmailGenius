/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./ts/config.ts":
/*!**********************!*\
  !*** ./ts/config.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ALLOW_DEBUG_MESSAGES: () => (/* binding */ ALLOW_DEBUG_MESSAGES),
/* harmony export */   API_ROUTES: () => (/* binding */ API_ROUTES),
/* harmony export */   BACK_END_HOST: () => (/* binding */ BACK_END_HOST),
/* harmony export */   DASHBOARD_URL: () => (/* binding */ DASHBOARD_URL),
/* harmony export */   DEV_BACK_END_HOST: () => (/* binding */ DEV_BACK_END_HOST),
/* harmony export */   LOGIN_POPUP_URL: () => (/* binding */ LOGIN_POPUP_URL),
/* harmony export */   PROD_BACK_END_HOST: () => (/* binding */ PROD_BACK_END_HOST),
/* harmony export */   SIGNED_OUT_URL: () => (/* binding */ SIGNED_OUT_URL),
/* harmony export */   SUBSCRIPTION_URL: () => (/* binding */ SUBSCRIPTION_URL),
/* harmony export */   USE_DEV_BACK_END: () => (/* binding */ USE_DEV_BACK_END)
/* harmony export */ });
/**
 * Use the development back end (localhost:3000) and allow debugging messages
 *
 * Don't touch these. The build script will temporarily set these to false during
 * the build process, and then set them back to true when the build is complete.
 *
 * This allows us to use the production back end for the production build and
 * the development back end for the development build.
 */
const USE_DEV_BACK_END = false;
const ALLOW_DEBUG_MESSAGES = false;
// Back-end hosts
const DEV_BACK_END_HOST = 'http://localhost:3000';
const PROD_BACK_END_HOST = 'https://app.emailgenius.app';
const BACK_END_HOST = USE_DEV_BACK_END
    ? DEV_BACK_END_HOST
    : PROD_BACK_END_HOST;
// API endpoints
const createApiUrl = (endpoint) => `${BACK_END_HOST}/api/chrome-extension/${endpoint}`;
const API_ROUTES = {
    generate_message_streaming: createApiUrl('messages/generate-streaming'),
    generate_message: createApiUrl('messages/generate'),
    get_user_data: createApiUrl('users/get-user-data'),
};
// Other URLs
const LOGIN_POPUP_URL = `${BACK_END_HOST}/login-popup`;
const DASHBOARD_URL = `${BACK_END_HOST}/dashboard`;
const SIGNED_OUT_URL = `${BACK_END_HOST}/dashboard/signed-out`;
const SUBSCRIPTION_URL = `${BACK_END_HOST}/api/payment/create-checkout-session`;


/***/ }),

/***/ "./ts/lib/api.ts":
/*!***********************!*\
  !*** ./ts/lib/api.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ apiRequest),
/* harmony export */   logApiRequestEnd: () => (/* binding */ logApiRequestEnd),
/* harmony export */   logApiRequestStart: () => (/* binding */ logApiRequestStart)
/* harmony export */ });
/* harmony import */ var _debug__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./debug */ "./ts/lib/debug.ts");
/* harmony import */ var _auth__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./auth */ "./ts/lib/auth.ts");


function logApiRequestStart() {
    const separator = '='.repeat(80);
    (0,_debug__WEBPACK_IMPORTED_MODULE_0__["default"])(`\n\n${separator}\nBegin API request\n${separator}\n\n`);
}
function logApiRequestEnd() {
    const separator = '='.repeat(80);
    (0,_debug__WEBPACK_IMPORTED_MODULE_0__["default"])(`\n\n${separator}\nEnd API request\n${separator}\n\n`);
}
// Send API requests to the back end
async function apiRequest(endpoint, data = {}) {
    logApiRequestStart();
    (0,_debug__WEBPACK_IMPORTED_MODULE_0__["default"])(`Initializing API request to ${endpoint}...`);
    if (!(await (0,_auth__WEBPACK_IMPORTED_MODULE_1__.isUserLoggedIn)())) {
        (0,_debug__WEBPACK_IMPORTED_MODULE_0__["default"])('User is not logged in; aborting API request');
        logApiRequestEnd();
        throw new Error('User is not logged in');
    }
    const token = await (0,_auth__WEBPACK_IMPORTED_MODULE_1__.getTokenLocally)();
    // Add token to request data
    const apiRequestData = Object.assign(Object.assign({}, data), { chromeExtensionToken: token });
    // Log API request parameters
    let apiRequestDataString = `Sending API request to ${endpoint} with data:\n\n{\n`;
    Object.entries(apiRequestData).forEach(([key, value]) => {
        apiRequestDataString += `  ${key}: ${value}\n`;
    });
    apiRequestDataString += '}';
    (0,_debug__WEBPACK_IMPORTED_MODULE_0__["default"])(apiRequestDataString);
    try {
        // Send API request
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(Object.assign({}, apiRequestData)),
        });
        // Save data from response
        const responseData = await response.json();
        // Response succeeded; return data
        if (response.ok) {
            (0,_debug__WEBPACK_IMPORTED_MODULE_0__["default"])(`API response received:\n\n${JSON.stringify(responseData, null, 2)}`);
            logApiRequestEnd();
            return responseData;
        }
        // Response failed; throw error
        throw new Error(response.statusText);
    }
    catch (error) {
        (0,_debug__WEBPACK_IMPORTED_MODULE_0__["default"])(`API response error: ${error}`);
        logApiRequestEnd();
        throw error;
    }
}


/***/ }),

/***/ "./ts/lib/auth.ts":
/*!************************!*\
  !*** ./ts/lib/auth.ts ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   attachLoggedInMessageListener: () => (/* binding */ attachLoggedInMessageListener),
/* harmony export */   authenticationCheck: () => (/* binding */ authenticationCheck),
/* harmony export */   getTokenLocally: () => (/* binding */ getTokenLocally),
/* harmony export */   isUserLoggedIn: () => (/* binding */ isUserLoggedIn),
/* harmony export */   listenForTokenActions: () => (/* binding */ listenForTokenActions),
/* harmony export */   removeTokenLocally: () => (/* binding */ removeTokenLocally),
/* harmony export */   saveTokenLocally: () => (/* binding */ saveTokenLocally),
/* harmony export */   showAuthenticationFlow: () => (/* binding */ showAuthenticationFlow),
/* harmony export */   showLoggedInWelcomeMessage: () => (/* binding */ showLoggedInWelcomeMessage)
/* harmony export */ });
/* harmony import */ var _debug__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./debug */ "./ts/lib/debug.ts");
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../config */ "./ts/config.ts");
/* harmony import */ var _ui_status_message__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ui/status-message */ "./ts/lib/ui/status-message.ts");



// Save token in Chrome local storage
function saveTokenLocally(token) {
    (0,_debug__WEBPACK_IMPORTED_MODULE_0__["default"])(`Saving token: ${token}`);
    chrome.storage.local.set({ token }, () => {
        (0,_debug__WEBPACK_IMPORTED_MODULE_0__["default"])('Token is saved in local storage');
    });
}
// Get token from Chrome local storage
async function getTokenLocally() {
    (0,_debug__WEBPACK_IMPORTED_MODULE_0__["default"])('Getting token from local storage...');
    return new Promise((resolve) => {
        chrome.storage.local.get(['token'], (result) => {
            resolve(result.token);
        });
    });
}
// Remove token from Chrome local storage
function removeTokenLocally() {
    (0,_debug__WEBPACK_IMPORTED_MODULE_0__["default"])('Removing token from local storage...');
    chrome.storage.local.remove('token');
}
// Check if the user is logged in by checking for a locally stored token
async function isUserLoggedIn() {
    const token = await getTokenLocally();
    return !!token;
}
// Show login prompt if the user is not logged in
async function authenticationCheck(containerId) {
    if (!(await isUserLoggedIn())) {
        (0,_ui_status_message__WEBPACK_IMPORTED_MODULE_2__.showStatusMessage)({
            type: 'welcome',
            message: 'Welcome to EmailGenius! Please <a href="#" class="eg-auth-link">log in</a> to continue.',
            containerId,
            changeState: false,
            cancellable: false,
        });
    }
}
// Show welcome message upon login
function showLoggedInWelcomeMessage() {
    (0,_debug__WEBPACK_IMPORTED_MODULE_0__["default"])('Showing logged-in welcome message...');
    (0,_ui_status_message__WEBPACK_IMPORTED_MODULE_2__.showStatusMessage)({
        type: 'welcome',
        message: "To use EmailGenius, type instructions in the box below, like &ldquo;write a thank-you note&rdquo; or &ldquo;ask a friend for book recommendations.&rdquo;<br /><br />After the message is created, you can give more instructions, like &ldquo;make it shorter&rdquo; or &ldquo;make it funnier.&rdquo;<br /><br />When you're ready, you can add the message to your email, edit it, and send it.",
    });
}
// Grab and save the Chrome extension token from the EmailGenius login flow
function listenForTokenActions() {
    const listenInterval = 200;
    const maxAttempts = 1000;
    let attempts = 0;
    // If we're on a token display page, check for token (up to `maxAttempts` times)
    if ((window.location.href.includes(_config__WEBPACK_IMPORTED_MODULE_1__.DASHBOARD_URL) ||
        window.location.href.includes(_config__WEBPACK_IMPORTED_MODULE_1__.LOGIN_POPUP_URL)) &&
        !window.location.href.includes(_config__WEBPACK_IMPORTED_MODULE_1__.SIGNED_OUT_URL)) {
        (0,_debug__WEBPACK_IMPORTED_MODULE_0__["default"])('Trying to extract token from page...');
        setTimeout(function checkForToken() {
            attempts += 1;
            if (attempts < maxAttempts) {
                // The token will be embedded in an element with id #chrome-extension-token
                const tokenElement = $('#chrome-extension-token');
                if (tokenElement.length) {
                    const token = tokenElement.text();
                    (0,_debug__WEBPACK_IMPORTED_MODULE_0__["default"])(`Token found: ${token}`);
                    saveTokenLocally(token);
                    // Close the login popup window and show logged-in welcome message
                    if (window.location.href.includes(_config__WEBPACK_IMPORTED_MODULE_1__.LOGIN_POPUP_URL)) {
                        /** Show the logged-in welcome message (via the background script)
                         * This is necessary because this block is getting invoked in the
                         * popup window, not in the parent tab
                         */
                        (0,_debug__WEBPACK_IMPORTED_MODULE_0__["default"])('Showing logged-in welcome message...');
                        chrome.runtime.sendMessage({ message: 'get_triggering_tab_id' }, (response) => {
                            const { triggeringTabId } = response;
                            chrome.runtime.sendMessage({
                                message: 'send_tab_message',
                                tabId: triggeringTabId,
                                data: { message: 'show_logged_in_welcome_message' },
                            });
                        });
                        // Close the login popup window
                        (0,_debug__WEBPACK_IMPORTED_MODULE_0__["default"])('Closing login popup window...');
                        chrome.runtime.sendMessage({ message: 'close_window' });
                    }
                }
                else {
                    (0,_debug__WEBPACK_IMPORTED_MODULE_0__["default"])(`Token not found; trying again (attempt ${attempts} of ${maxAttempts})...`);
                    setTimeout(checkForToken, listenInterval);
                }
            }
        }, listenInterval);
    }
    // Remove token if we're on the signout page
    if (window.location.href.includes(_config__WEBPACK_IMPORTED_MODULE_1__.SIGNED_OUT_URL)) {
        removeTokenLocally();
    }
}
// Show a popup window and authenticate the user
function showAuthenticationFlow() {
    chrome.runtime.sendMessage({
        message: 'open_new_popup',
        url: _config__WEBPACK_IMPORTED_MODULE_1__.LOGIN_POPUP_URL,
    });
}
// Listen for the "logged in" message from the background script
function attachLoggedInMessageListener() {
    chrome.runtime.onMessage.addListener((request) => {
        (0,_debug__WEBPACK_IMPORTED_MODULE_0__["default"])(`Received message: ${request.message}`);
        if (request.message === 'show_logged_in_welcome_message') {
            (0,_ui_status_message__WEBPACK_IMPORTED_MODULE_2__.clearAllStatusMessages)();
            showLoggedInWelcomeMessage();
        }
    });
}


/***/ }),

/***/ "./ts/lib/debug.ts":
/*!*************************!*\
  !*** ./ts/lib/debug.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ debugLog)
/* harmony export */ });
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../config */ "./ts/config.ts");

// Log a debugging message to the console
function debugLog(message) {
    if (_config__WEBPACK_IMPORTED_MODULE_0__.ALLOW_DEBUG_MESSAGES) {
        // eslint-disable-next-line no-console
        console.log(`[EmailGenius extension] ${message}`);
    }
}


/***/ }),

/***/ "./ts/lib/inference.ts":
/*!*****************************!*\
  !*** ./ts/lib/inference.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ generateStreamingMessage)
/* harmony export */ });
/* harmony import */ var _debug__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./debug */ "./ts/lib/debug.ts");
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../config */ "./ts/config.ts");
/* harmony import */ var _ui_state__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ui/state */ "./ts/lib/ui/state.ts");
/* harmony import */ var _auth__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./auth */ "./ts/lib/auth.ts");
/* harmony import */ var _api__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./api */ "./ts/lib/api.ts");
/* harmony import */ var _ui_status_message__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./ui/status-message */ "./ts/lib/ui/status-message.ts");






/**
 * Stream a message from the API to the UI.
 *
 * @param {string} containerId - The ID of the compose area
 * @param {string} prompt - The prompt to generate a message from
 * @param {string} previousPrompt - The previous prompt (if any)
 * @param {string} previousMessage - The previous message (if any)
 * @param {string} tryAgainUrl - The URL to use for "try again" requests
 */
async function generateStreamingMessage({ containerId, prompt, previousPrompt, previousMessage, tryAgainUrl, }) {
    (0,_debug__WEBPACK_IMPORTED_MODULE_0__["default"])(`Generating streaming message for prompt: "${prompt}"`);
    // Clear previous preview
    $(`.eg-preview-message-contents-${containerId}`)
        .find('.eg-stream-output')
        .html('');
    (0,_api__WEBPACK_IMPORTED_MODULE_4__.logApiRequestStart)();
    // Check if user is logged in; if not, abort
    if (!(await (0,_auth__WEBPACK_IMPORTED_MODULE_3__.isUserLoggedIn)())) {
        (0,_debug__WEBPACK_IMPORTED_MODULE_0__["default"])('User is not logged in; aborting API request');
        (0,_api__WEBPACK_IMPORTED_MODULE_4__.logApiRequestEnd)();
        (0,_ui_status_message__WEBPACK_IMPORTED_MODULE_5__.showStatusMessage)({
            type: 'error',
            message: 'Please <a href="#" class="eg-auth-link">log in</a> to use EmailGenius.',
            containerId,
        });
        return;
    }
    // Get token from local storage
    const chromeExtensionToken = await (0,_auth__WEBPACK_IMPORTED_MODULE_3__.getTokenLocally)();
    (0,_debug__WEBPACK_IMPORTED_MODULE_0__["default"])('Constructing streaming request URL...');
    (0,_debug__WEBPACK_IMPORTED_MODULE_0__["default"])(`previousPrompt: ${previousPrompt}`);
    (0,_debug__WEBPACK_IMPORTED_MODULE_0__["default"])(`previousMessage: ${previousMessage}`);
    // Construct request URL
    let url = `${_config__WEBPACK_IMPORTED_MODULE_1__.API_ROUTES.generate_message_streaming}?chromeExtensionToken=${chromeExtensionToken}&prompt=${prompt}`;
    // Add previous prompt and message to URL if they exist
    if (previousPrompt)
        url += `&previousPrompt=${previousPrompt}`;
    if (previousMessage)
        url += `&previousMessage=${previousMessage}`;
    // If the user clicked "try again," use the URL saved in the "try again" button
    if (tryAgainUrl)
        url = tryAgainUrl;
    // Save URL to "try again" button
    $(`.eg-try-again-button-${containerId}`).attr('try-again-url', url);
    (0,_debug__WEBPACK_IMPORTED_MODULE_0__["default"])(`Initiating streaming request to ${url}`);
    // Print streaming chunks in the preview container
    function showStreamingResponse(data) {
        (0,_ui_state__WEBPACK_IMPORTED_MODULE_2__.showStreamingState)(containerId);
        const outputElement = $(`.eg-preview-message-contents-${containerId}`).find('.eg-stream-output');
        const currentOutput = outputElement.html();
        outputElement.html(currentOutput + data);
    }
    // Get streaming chunks from the server
    function streamResponse(callback) {
        const eventSource = new EventSource(url);
        (0,_debug__WEBPACK_IMPORTED_MODULE_0__["default"])(`Listening on SSE: ${eventSource}`);
        /* If it takes longer than 12 seconds to get a response from the server,
         * re-invoke the request
         */
        let isActive = true;
        const errorTimeout = setTimeout(() => {
            (0,_debug__WEBPACK_IMPORTED_MODULE_0__["default"])('Delay of more than 12 seconds detected, re-invoking streamResponse...');
            isActive = false;
            eventSource.close();
            streamResponse(callback);
        }, 12000);
        // Handle errors
        let hasErrorOccurred = false;
        eventSource.onerror = (error) => {
            if (!isActive)
                return;
            clearTimeout(errorTimeout);
            if (!hasErrorOccurred) {
                hasErrorOccurred = true;
                const errorEvent = error;
                const errorObj = {
                    type: errorEvent.type,
                    message: errorEvent.message,
                };
                (0,_debug__WEBPACK_IMPORTED_MODULE_0__["default"])(`API response error: ${JSON.stringify(errorObj)}`);
                (0,_ui_status_message__WEBPACK_IMPORTED_MODULE_5__.showStatusMessage)({
                    type: 'error',
                    message: 'Something went wrong. Please try again.',
                    containerId,
                });
                (0,_api__WEBPACK_IMPORTED_MODULE_4__.logApiRequestEnd)();
                eventSource.close();
            }
        };
        // Handle streamed message chunks
        eventSource.onmessage = (event) => {
            if (!isActive)
                return;
            clearTimeout(errorTimeout);
            const { data } = event;
            // debugLog(data);
            if (data === '[DONE]') {
                eventSource.close();
                (0,_api__WEBPACK_IMPORTED_MODULE_4__.logApiRequestEnd)();
                (0,_ui_state__WEBPACK_IMPORTED_MODULE_2__.showPreviewState)(containerId);
            }
            else {
                const jsonData = JSON.parse(data);
                const { content } = jsonData.choices[0].delta;
                if (content) {
                    const formattedContent = content === null || content === void 0 ? void 0 : content.replace(/\n/g, '<br>');
                    callback(formattedContent);
                }
                // Cancel generation if user clicks "cancel"
                if ($(`.eg-stop-generating-button-${containerId}`).attr('data-generation-cancelled') === 'true') {
                    (0,_api__WEBPACK_IMPORTED_MODULE_4__.logApiRequestEnd)();
                    eventSource.close();
                    (0,_ui_state__WEBPACK_IMPORTED_MODULE_2__.showPreviewState)(containerId);
                }
            }
        };
        return {
            close: () => {
                eventSource.close();
                (0,_api__WEBPACK_IMPORTED_MODULE_4__.logApiRequestEnd)();
                (0,_ui_state__WEBPACK_IMPORTED_MODULE_2__.showPreviewState)(containerId);
            },
        };
    }
    try {
        streamResponse(showStreamingResponse);
    }
    catch (error) {
        (0,_debug__WEBPACK_IMPORTED_MODULE_0__["default"])(`API response error: ${error}`);
        (0,_ui_status_message__WEBPACK_IMPORTED_MODULE_5__.showStatusMessage)({
            type: 'error',
            message: 'Something went wrong. Please try again.',
            containerId,
        });
        (0,_api__WEBPACK_IMPORTED_MODULE_4__.logApiRequestEnd)();
    }
}


/***/ }),

/***/ "./ts/lib/ui/compose-area.ts":
/*!***********************************!*\
  !*** ./ts/lib/ui/compose-area.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ listenForGmailComposeArea)
/* harmony export */ });
/* harmony import */ var _general__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./general */ "./ts/lib/ui/general.ts");
/* harmony import */ var _compose_interface__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./compose-interface */ "./ts/lib/ui/compose-interface.ts");


/**
 *  Check whether we're in a Gmail compose area;
 *  if so, inject and show the EmailGenius interface
 */
function listenForGmailComposeArea() {
    const listenInterval = 1000;
    setTimeout(function checkForComposeElements() {
        // Loop through message composition elements
        $('div[aria-label="Message Body"]').each((index, composeArea) => {
            if ((0,_general__WEBPACK_IMPORTED_MODULE_0__.isElementVisible)('div[aria-label="Message Body"]')) {
                (0,_compose_interface__WEBPACK_IMPORTED_MODULE_1__.initializeComposeInterface)(composeArea);
            }
        });
        setTimeout(checkForComposeElements, listenInterval);
    }, listenInterval);
}


/***/ }),

/***/ "./ts/lib/ui/compose-interface.ts":
/*!****************************************!*\
  !*** ./ts/lib/ui/compose-interface.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   initializeButtonsBar: () => (/* binding */ initializeButtonsBar),
/* harmony export */   initializeComposeInterface: () => (/* binding */ initializeComposeInterface),
/* harmony export */   initializePreviewContainer: () => (/* binding */ initializePreviewContainer),
/* harmony export */   injectMessagePreview: () => (/* binding */ injectMessagePreview)
/* harmony export */ });
/* harmony import */ var _debug__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../debug */ "./ts/lib/debug.ts");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../util */ "./ts/lib/util.ts");
/* harmony import */ var _input_suggestions__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./input-suggestions */ "./ts/lib/ui/input-suggestions.ts");
/* harmony import */ var _status_message__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./status-message */ "./ts/lib/ui/status-message.ts");
/* harmony import */ var _auth__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../auth */ "./ts/lib/auth.ts");





// Create the primary interface bar; this lives at the top of the compose area
function initializeButtonsBar(containerId, composeContainer) {
    /**
     * Is this a reply composition window (as opposed to a fresh composition
     * window)? If so, we'll add additional styling
     */
    let isReply = false;
    if (composeContainer.closest('.aoP').has('div[aria-label="Type of response"]')
        .length > 0) {
        isReply = true;
    }
    // Generate message buttons HTML
    const buttonsBarHTML = `
<div class="eg-compose-container eg-compose-container-${containerId} ${isReply ? ' eg-compose-container-reply' : ''}">
  <div class="eg-buttons-bar eg-buttons-bar-minimized eg-buttons-bar-minimized-${containerId}">
    <i class="fa-solid fa-wand-magic-sparkles eg-wand" data-container-id="${containerId}"></i>
  </div>
  
  <div class="eg-buttons-bar eg-buttons-bar-base eg-buttons-bar-${containerId}">
  
    <div class="eg-buttons-left">

      <div class="eg-generate-input-container">
        <i class="fa-solid fa-wand-magic-sparkles eg-wand" data-container-id="${containerId}"></i><input class="eg-generate-input eg-input eg-generate-input-${containerId}" placeholder="" data-container-id="${containerId}" />
      </div>

    </div><!-- /.eg-buttons-left -->
    
    <div class="eg-buttons-right">
      <div class="eg-generate-input-buttons">
        <div class="eg-button eg-generate-input-create-button eg-primary-button" data-container-id="${containerId}">
          Generate
        </div> 
      </div>
      <!-- <div class="eg-button eg-settings-button eg-settings-button-${containerId}">
        <i class="fa-solid fa-gear"></i>
      </div> -->
    </div><!-- /.eg-buttons-right -->

  </div><!-- /.eg-buttons-bar-base -->



  <div class="eg-preview-wrapper">
    <div class="eg-buttons-bar eg-buttons-bar-preview eg-buttons-bar-${containerId} eg-buttons-bar-preview-${containerId}">
    
      <div class="eg-buttons-left">
        <div class="eg-revise-buttons eg-revise-buttons-${containerId}">

          <div class="eg-edit-input-container">
            <input class="eg-edit eg-edit-input eg-input eg-edit-input-${containerId}" placeholder="" data-container-id="${containerId}" />
          </div>

          <div class="eg-revise">
            <div class="eg-button eg-revise-button eg-revise-button-${containerId}" data-container-id="${containerId}">
              <i class="fa-solid fa-pen-to-square eg-button-icon"></i>
              Edit
            </div>

            <span class="eg-button-separator">|</span>

            <div class="eg-button eg-try-again-button eg-try-again-button-${containerId}" data-container-id="${containerId}">
              <i class="fa-solid fa-rotate-right eg-button-icon"></i>
              Try Again
            </div>
          </div>

        </div>
      </div><!-- /.eg-buttons-left -->

      <div class="eg-buttons-right">
        <div class="eg-button eg-edit eg-edit-input-create-button eg-regenerate-button eg-primary-button" data-container-id="${containerId}">
          Regenerate
        </div> 
        <!--
        <div class="eg-button eg-revise eg-edit eg-settings-button eg-settings-button-${containerId}">
          <i class="fa-solid fa-gear"></i>
        </div>
        -->
      </div><!-- /.eg-buttons-right -->

    </div><!-- /.eg-buttons-bar-preview -->

    <div class="eg-preview-loading-bar eg-preview-loading-bar-${containerId}"></div>

  </div><!-- /.eg-preview-wrapper -->

</div><!-- /.eg-compose-container -->
  `;
    return buttonsBarHTML;
}
/**
 * Create the preview container; this is where the preview of the generated
 * message will be displayed to the user, with "Add to Message" and "Cancel"
 * buttons
 */
function initializePreviewContainer(containerId) {
    (0,_debug__WEBPACK_IMPORTED_MODULE_0__["default"])(`Creating preview container for ${containerId}...`);
    const previewContainerHTML = `
<div class="eg-preview-container eg-preview-container-${containerId}">
  <div class="eg-previous-prompt eg-previous-prompt-${containerId}" data-previous-prompt="" style="display: none;"></div>
  <div class="eg-preview-loading">
    <p>Generating...</p>
    <i class="fa-solid fa-circle-notch fa-spin fa-xl"></i>
  </div>
  <div class="eg-preview-content">
  <div class="eg-stop-generating-button eg-stop-generating-button-${containerId} eg-streaming-button" data-container-id="${containerId}"><i class="fa-solid fa-ban"></i>Stop Generating</div>  
  <div class="eg-preview-message-contents eg-preview-message-contents-${containerId}"><p class="eg-stream-output eg-stream-output-with-cursor"></p></div>
    <div class="eg-preview-button eg-preview-insert-button eg-primary-button" data-container-id="${containerId}">Add to Message</div>
    <div class="eg-preview-button eg-preview-cancel-button" data-container-id="${containerId}">Cancel</div>
  </div>
</div>
  `;
    // Inject the preview container
    $(`.eg-preview-loading-bar-${containerId}`).after(previewContainerHTML);
}
/**
 * Initialize main composition interface; there could be several of these (e.g.,
 * one for a fresh composition window and one for a reply)
 */
function initializeComposeInterface(composeArea) {
    // Get the container for the message composition area
    const container = $(composeArea).closest('.iN');
    // If the message buttons are already attached, don't attach them again
    if (container.hasClass('eg-buttons-attached'))
        return;
    // Add a class to indicate that the message buttons are attached
    container.addClass('eg-buttons-attached');
    // Generate a unique ID for this container
    const containerId = (0,_util__WEBPACK_IMPORTED_MODULE_1__.generateRandomString)();
    $(composeArea).addClass(`eg-compose-area-${containerId}`);
    // Inject message buttons
    const messageButtonsHTML = initializeButtonsBar(containerId, container);
    (0,_debug__WEBPACK_IMPORTED_MODULE_0__["default"])('Prepending message buttons...');
    container.before(messageButtonsHTML);
    // Create the message preview container (hidden initially)
    initializePreviewContainer(containerId);
    // Create the error/info message container (hidden initially)
    (0,_status_message__WEBPACK_IMPORTED_MODULE_3__.initializeStatusMessageContainer)(containerId);
    // Check if user is authenticated, and if not, show login prompt
    (0,_auth__WEBPACK_IMPORTED_MODULE_4__.authenticationCheck)(containerId);
    // Show suggestions in the input placeholder attribute
    (0,_input_suggestions__WEBPACK_IMPORTED_MODULE_2__["default"])('.eg-generate-input', 'generate');
}
// Show the generated message in the preview container
function injectMessagePreview(containerId, message) {
    $(`.eg-preview-container-${containerId}`)
        .find('.eg-preview-message-contents')
        .html(message);
}


/***/ }),

/***/ "./ts/lib/ui/event-handlers.ts":
/*!*************************************!*\
  !*** ./ts/lib/ui/event-handlers.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ attachEventHandlers)
/* harmony export */ });
/* harmony import */ var _generate_message__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./generate-message */ "./ts/lib/ui/generate-message.ts");
/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./state */ "./ts/lib/ui/state.ts");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../util */ "./ts/lib/util.ts");
/* harmony import */ var _general__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./general */ "./ts/lib/ui/general.ts");
/* harmony import */ var _debug__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../debug */ "./ts/lib/debug.ts");
/* harmony import */ var _input_suggestions__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./input-suggestions */ "./ts/lib/ui/input-suggestions.ts");
/* harmony import */ var _auth__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../auth */ "./ts/lib/auth.ts");







// Handle "Edit -> Regenerate" actions
function processRegenerateAction(containerId) {
    (0,_debug__WEBPACK_IMPORTED_MODULE_4__["default"])('processRegenerateAction() called');
    const inputElement = $(`.eg-edit-input-${containerId}`);
    const prompt = inputElement.val();
    const previousPrompt = $(`.eg-previous-prompt-${containerId}`).attr('data-previous-prompt');
    (0,_debug__WEBPACK_IMPORTED_MODULE_4__["default"])(`Retrieved previous prompt: "${previousPrompt}"`);
    const previousHTMLMessage = $(`.eg-preview-message-contents-${containerId}`)
        .find('.eg-stream-output')
        .html();
    const previousMessage = previousHTMLMessage.replace(/<br>/g, '\n');
    (0,_debug__WEBPACK_IMPORTED_MODULE_4__["default"])(`Retrieved previous message: "${previousMessage}"`);
    inputElement.val('');
    (0,_generate_message__WEBPACK_IMPORTED_MODULE_0__["default"])({
        containerId,
        inputElement,
        prompt,
        previousPrompt,
        previousMessage,
    });
}
// Attach event handlers when the extension initializes
function attachEventHandlers() {
    // Handle "Minimze" button clicks
    $(document).on('click', '.eg-wand', function () {
        const containerId = (0,_util__WEBPACK_IMPORTED_MODULE_2__.getContainerId)($(this));
        if (!containerId)
            return;
        (0,_state__WEBPACK_IMPORTED_MODULE_1__.toggleMinimizedState)(containerId);
    });
    // Handle "Generate" button clicks
    $(document).on('click', '.eg-generate-input-create-button', function () {
        const containerId = (0,_util__WEBPACK_IMPORTED_MODULE_2__.getContainerId)($(this));
        if (!containerId)
            return;
        const inputElement = $(`.eg-generate-input-${containerId}`);
        const prompt = inputElement.val();
        (0,_generate_message__WEBPACK_IMPORTED_MODULE_0__["default"])({ containerId, inputElement, prompt });
    });
    // Handle "Enter" keypresses in the generate prompt input
    let lastKeypressTime = 0;
    $(document).on('focusin', (e) => {
        if ($(e.target).hasClass('eg-generate-input')) {
            $(e.target).on('keydown', function (e2) {
                const containerId = (0,_util__WEBPACK_IMPORTED_MODULE_2__.getContainerId)($(this));
                if (!containerId)
                    return;
                if (e2.key === 'Enter') {
                    const currentTime = new Date().getTime();
                    if (currentTime - lastKeypressTime > 2000) {
                        const inputElement = $(`.eg-generate-input-${containerId}`);
                        const prompt = inputElement.val();
                        (0,_generate_message__WEBPACK_IMPORTED_MODULE_0__["default"])({ containerId, inputElement, prompt });
                        lastKeypressTime = currentTime;
                    }
                }
            });
        }
    });
    // Handle "Edit" button clicks
    $(document).on('click', '.eg-revise-button', function () {
        const containerId = (0,_util__WEBPACK_IMPORTED_MODULE_2__.getContainerId)($(this));
        if (!containerId)
            return;
        (0,_state__WEBPACK_IMPORTED_MODULE_1__.showEditingState)(containerId);
        const editInputElement = document.querySelector(`.eg-edit-input-${containerId}`);
        if (editInputElement) {
            editInputElement.focus();
        }
        // Only call "show suggestions" once; otherwise, it'll get called repeatedly
        // and will show updated suggestions too often
        if ($(`.eg-edit-input-${containerId}`).attr('data-suggestions-shown') !==
            'true') {
            (0,_input_suggestions__WEBPACK_IMPORTED_MODULE_5__["default"])(`.eg-edit-input-${containerId}`, 'edit');
            $(`.eg-edit-input-${containerId}`).attr('data-suggestions-shown', 'true');
        }
    });
    // Handle "Enter" keypresses in the edit prompt input
    let lastEditKeypressTime = 0;
    $(document).on('focusin', (e) => {
        if ($(e.target).hasClass('eg-edit-input')) {
            $(e.target).on('keydown', function (e2) {
                const containerId = (0,_util__WEBPACK_IMPORTED_MODULE_2__.getContainerId)($(this));
                if (!containerId)
                    return;
                if (e2.key === 'Enter') {
                    const currentTime = new Date().getTime();
                    if (currentTime - lastEditKeypressTime > 2000) {
                        (0,_debug__WEBPACK_IMPORTED_MODULE_4__["default"])('"Enter" keypress detected');
                        processRegenerateAction(containerId);
                        lastEditKeypressTime = currentTime;
                    }
                }
            });
        }
    });
    // Handle editing "regenerate" button clicks
    $(document).on('click', '.eg-regenerate-button', function () {
        const containerId = (0,_util__WEBPACK_IMPORTED_MODULE_2__.getContainerId)($(this));
        if (!containerId)
            return;
        processRegenerateAction(containerId);
    });
    // Handle "Try Again" button clicks
    $(document).on('click', '.eg-try-again-button', function () {
        const containerId = (0,_util__WEBPACK_IMPORTED_MODULE_2__.getContainerId)($(this));
        if (!containerId)
            return;
        const tryAgainUrl = $(this).attr('try-again-url');
        (0,_generate_message__WEBPACK_IMPORTED_MODULE_0__["default"])({ containerId, tryAgainUrl });
    });
    // Handle "Stop Generating" button clicks
    $(document).on('click', '.eg-stop-generating-button', function () {
        const containerId = (0,_util__WEBPACK_IMPORTED_MODULE_2__.getContainerId)($(this));
        if (!containerId)
            return;
        $(this).attr('data-generation-cancelled', 'true');
        (0,_state__WEBPACK_IMPORTED_MODULE_1__.showPreviewState)(containerId);
        $(this).hide();
    });
    // Handle "Insert" button clicks
    $(document).on('click', '.eg-preview-insert-button', function () {
        const containerId = (0,_util__WEBPACK_IMPORTED_MODULE_2__.getContainerId)($(this));
        if (!containerId)
            return;
        // Get the message contents
        const messageContents = $(`.eg-preview-container-${containerId} .eg-preview-message-contents`).html();
        // Remove p tags (and any attributes) and replace them with divs
        const cleanedMessageContents = messageContents
            .replace(/<p[^>]*>/g, '<div>')
            .replace(/<\/p>/g, '</div>');
        /**
         * Wrap paragraphs in divs and replace "<br><br>" with an empty div
         * (this is necessary for integration with Gmail's message styles)
         */
        const paragraphs = cleanedMessageContents.split('<br><br>');
        const wrappedParagraphs = paragraphs.map((paragraph) => `<div>${paragraph}</div><div><br></div>`);
        // Insert the message contents into the compose area
        $(`.eg-compose-area-${containerId}`).prepend(`${wrappedParagraphs.join('')}<div><br></div>`);
        // Clear the prompt input
        $(`.eg-generate-input-${containerId}`).val('');
        // Show the base state and focus on the compose area
        (0,_state__WEBPACK_IMPORTED_MODULE_1__.showBaseState)(containerId);
        (0,_general__WEBPACK_IMPORTED_MODULE_3__.focusOnComposeArea)(containerId);
    });
    // Handle "Cancel" button clicks in the preview state
    $(document).on('click', '.eg-preview-cancel-button', function () {
        const containerId = (0,_util__WEBPACK_IMPORTED_MODULE_2__.getContainerId)($(this));
        if (!containerId)
            return;
        (0,_state__WEBPACK_IMPORTED_MODULE_1__.showBaseState)(containerId);
        // Clear the prompt input
        $(`.eg-generate-input-${containerId}`).val('');
    });
    // Handle "Cancel" button clicks in the generate state
    $(document).on('click', '.eg-generate-input-cancel-button', function () {
        const containerId = (0,_util__WEBPACK_IMPORTED_MODULE_2__.getContainerId)($(this));
        if (!containerId)
            return;
        (0,_state__WEBPACK_IMPORTED_MODULE_1__.showBaseState)(containerId);
    });
    // Handle "Close Message" button clicks
    $(document).on('click', '.eg-close-message', function () {
        $(this).parent().hide();
    });
    // Handle "please log in" clicks
    $(document).on('click', '.eg-auth-link', (event) => {
        event.preventDefault();
        (0,_auth__WEBPACK_IMPORTED_MODULE_6__.showAuthenticationFlow)();
    });
}


/***/ }),

/***/ "./ts/lib/ui/general.ts":
/*!******************************!*\
  !*** ./ts/lib/ui/general.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   focusOnComposeArea: () => (/* binding */ focusOnComposeArea),
/* harmony export */   injectFontAwesome: () => (/* binding */ injectFontAwesome),
/* harmony export */   isElementVisible: () => (/* binding */ isElementVisible)
/* harmony export */ });
// Check whether a given element is visible
function isElementVisible(selector) {
    const element = document.querySelector(selector);
    if (element &&
        getComputedStyle(element).display !== 'none' &&
        getComputedStyle(element).visibility !== 'hidden') {
        return true;
    }
    return false;
}
// Inject FontAwesome icons from Cloudflare CDN
function injectFontAwesome() {
    $('head').append('<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">');
}
// Focus on the message composition area
function focusOnComposeArea(containerId) {
    const composeAreaElement = document.querySelector(`.eg-compose-area-${containerId}`);
    if (composeAreaElement)
        composeAreaElement.focus();
}


/***/ }),

/***/ "./ts/lib/ui/generate-message.ts":
/*!***************************************!*\
  !*** ./ts/lib/ui/generate-message.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ handleMessageGeneration)
/* harmony export */ });
/* harmony import */ var _debug__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../debug */ "./ts/lib/debug.ts");
/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./state */ "./ts/lib/ui/state.ts");
/* harmony import */ var _inference__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../inference */ "./ts/lib/inference.ts");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../util */ "./ts/lib/util.ts");
/* harmony import */ var _user__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../user */ "./ts/lib/user.ts");





/** Generate a message and handle state changes. This function handles message
 * generation events and then calls generateStreamingMessage() to stream the
 * message from the API to the UI.
 * @param {string} containerId - The ID of the compose area
 * @param {JQuery<HTMLElement>} inputElement - The input element containing the prompt
 * @param {string} prompt - The prompt to generate a message from
 * @param {string} previousPrompt - The previous prompt (if any)
 * @param {string} previousMessage - The previous message (if any)
 * @param {string} tryAgainUrl - The URL to use for "try again" requests
 *
 * @returns {void}
 */
async function handleMessageGeneration({ containerId, inputElement, prompt, previousPrompt, previousMessage, tryAgainUrl, }) {
    (0,_debug__WEBPACK_IMPORTED_MODULE_0__["default"])('handleMessageGeneration() called');
    // Check if inputElement is disabled; if so, don't do anything
    if (inputElement && inputElement.prop('disabled')) {
        (0,_debug__WEBPACK_IMPORTED_MODULE_0__["default"])('Input is disabled; not generating message');
        return;
    }
    if (tryAgainUrl) {
        // If the user clicked "try again," use the URL saved in the "try again" button
        (0,_state__WEBPACK_IMPORTED_MODULE_1__.showGeneratingState)(containerId);
        if (await (0,_user__WEBPACK_IMPORTED_MODULE_4__.validateTokenBalance)(containerId)) {
            (0,_inference__WEBPACK_IMPORTED_MODULE_2__["default"])({ containerId, tryAgainUrl });
        }
        else {
            (0,_state__WEBPACK_IMPORTED_MODULE_1__.showBaseState)(containerId);
        }
    }
    else {
        // Otherwise, pass all prompt data to generateStreamingMessage()
        // Validate prompt input
        if (!(0,_util__WEBPACK_IMPORTED_MODULE_3__.validatePromptInput)(prompt || '', containerId)) {
            (0,_debug__WEBPACK_IMPORTED_MODULE_0__["default"])('Prompt is invalid; not generating message');
            return;
        }
        (0,_debug__WEBPACK_IMPORTED_MODULE_0__["default"])('Prompt is valid; continuing to generation...');
        (0,_state__WEBPACK_IMPORTED_MODULE_1__.showGeneratingState)(containerId);
        // Validate token balance
        if (!(await (0,_user__WEBPACK_IMPORTED_MODULE_4__.validateTokenBalance)(containerId))) {
            (0,_state__WEBPACK_IMPORTED_MODULE_1__.showBaseState)(containerId);
            return;
        }
        // Save the prompt in a hidden div
        $(`.eg-previous-prompt-${containerId}`).attr('data-previous-prompt', prompt || '');
        // Send an API request to start generating a message and stream it to the UI
        (0,_inference__WEBPACK_IMPORTED_MODULE_2__["default"])({
            containerId,
            prompt,
            previousPrompt,
            previousMessage,
        });
    }
}


/***/ }),

/***/ "./ts/lib/ui/input-suggestions.ts":
/*!****************************************!*\
  !*** ./ts/lib/ui/input-suggestions.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ showInputSuggestions)
/* harmony export */ });
/* harmony import */ var _debug__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../debug */ "./ts/lib/debug.ts");

const generatePlaceholderText = [
    'Catch up with a friend',
    'Invite friends to a party',
    'Write a thank-you note',
    'Send congratulations',
    'Send holiday greetings',
    'Ask for book recommendations',
    'Send an apology',
    'Ask for advice',
    'Send an introduction',
];
const editPlaceholderText = [
    'Make it shorter',
    'Make it funnier',
    'Add bullet points',
    'Include a question',
    'Add a quotation from an expert',
    'Add data or statistics',
    'Add emojis',
    'Use metaphors or analogies',
    'Add a sense of urgency',
    'Add a summary at the top',
];
// Show suggestions as placeholder text in the input field
function showInputSuggestions(element, inputType) {
    const refreshInterval = 2500;
    (0,_debug__WEBPACK_IMPORTED_MODULE_0__["default"])(`Showing input suggestions for ${inputType} input on ${element}`);
    let placeholderText = [];
    if (inputType === 'generate')
        placeholderText = generatePlaceholderText;
    if (inputType === 'edit')
        placeholderText = editPlaceholderText;
    const lastFive = [];
    const inputElement = document.querySelector(element);
    function updatePlaceholder() {
        (0,_debug__WEBPACK_IMPORTED_MODULE_0__["default"])('updatePlaceholder() called');
        if (inputElement) {
            let newText;
            do {
                newText =
                    placeholderText[Math.floor(Math.random() * placeholderText.length)];
            } while (lastFive.includes(newText));
            lastFive.push(newText);
            if (lastFive.length > 5) {
                lastFive.shift();
            }
            inputElement.setAttribute('placeholder', newText);
        }
    }
    if (inputElement) {
        setTimeout(updatePlaceholder, 0);
    }
    setInterval(() => {
        if (inputElement) {
            updatePlaceholder();
        }
    }, refreshInterval);
}


/***/ }),

/***/ "./ts/lib/ui/state.ts":
/*!****************************!*\
  !*** ./ts/lib/ui/state.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   showBaseState: () => (/* binding */ showBaseState),
/* harmony export */   showEditingState: () => (/* binding */ showEditingState),
/* harmony export */   showGeneratingState: () => (/* binding */ showGeneratingState),
/* harmony export */   showPreviewState: () => (/* binding */ showPreviewState),
/* harmony export */   showStreamingState: () => (/* binding */ showStreamingState),
/* harmony export */   toggleMinimizedState: () => (/* binding */ toggleMinimizedState)
/* harmony export */ });
/* harmony import */ var _debug__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../debug */ "./ts/lib/debug.ts");
/* harmony import */ var _general__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./general */ "./ts/lib/ui/general.ts");


// Change state back to the initial state
function showBaseState(containerId = '') {
    (0,_debug__WEBPACK_IMPORTED_MODULE_0__["default"])('showBaseState() called');
    let container = $('.eg-compose-container');
    if (containerId) {
        // Change state of specific container, if provided
        container = $(`.eg-compose-container-${containerId}`);
        container.find(`.eg-buttons-bar-minimized-${containerId}`).hide();
        $(`.eg-compose-container-${containerId}`)
            .find('input')
            .prop('disabled', false);
        (0,_general__WEBPACK_IMPORTED_MODULE_1__.focusOnComposeArea)(containerId);
    }
    else {
        // Change state overall of no container is specified
        container.find(`.eg-buttons-bar-minimized`).hide();
        $(`.eg-compose-container`).find('input').prop('disabled', false);
    }
    container.removeClass('eg-revise-buttons-disabled');
    container.find('.eg-buttons-bar-base').show();
    container.find('.eg-preview-wrapper').hide();
}
// Toggle minimized state when the user clicks the wand icon
function toggleMinimizedState(containerId) {
    (0,_debug__WEBPACK_IMPORTED_MODULE_0__["default"])('toggleMinimizedState() called');
    const container = $(`.eg-compose-container-${containerId}`);
    const minimizedButton = `.eg-buttons-bar-minimized-${containerId}`;
    if ((0,_general__WEBPACK_IMPORTED_MODULE_1__.isElementVisible)(minimizedButton)) {
        showBaseState(containerId);
        container
            .find(minimizedButton)
            .removeClass('eg-buttons-bar-minimized-visible');
    }
    else {
        container.find(minimizedButton).show();
        container
            .find(minimizedButton)
            .addClass('eg-buttons-bar-minimized-visible');
        container.find('.eg-buttons-bar-base').hide();
        container.find('.eg-preview-wrapper').hide();
    }
}
// Change state while waiting for OpenAI API response
function showGeneratingState(containerId) {
    (0,_debug__WEBPACK_IMPORTED_MODULE_0__["default"])('showGeneratingState() called');
    const container = $(`.eg-compose-container-${containerId}`);
    container.find('.eg-buttons-bar-base').hide();
    container.find('.eg-revise-buttons').show();
    container.find('.eg-revise').show();
    container.find('.eg-edit').hide();
    container.find('.eg-preview-wrapper').show();
    container.find('.eg-preview-loading-bar').show();
    container.find('.eg-preview-loading').show();
    container
        .find('.eg-stop-generating-button')
        .attr('data-generation-cancelled', 'false');
    container.find('.eg-preview-content').hide();
    $(`.eg-compose-container-${containerId}`)
        .find('input')
        .prop('disabled', true);
    container.addClass('eg-revise-buttons-disabled');
}
// Change state while OpenAI API response is streaming
function showStreamingState(containerId) {
    (0,_debug__WEBPACK_IMPORTED_MODULE_0__["default"])('showStreamingState() called');
    const container = $(`.eg-compose-container-${containerId}`);
    container.find('.eg-preview-loading').hide();
    container.find('.eg-preview-content').show();
    container.find('.eg-stream-output').addClass('eg-stream-output-with-cursor');
    container.find('.eg-preview-button').hide();
    container.find('.eg-stop-generating-button').show();
}
// Change state after message has been generated
function showPreviewState(containerId) {
    (0,_debug__WEBPACK_IMPORTED_MODULE_0__["default"])('showPreviewState() called');
    const container = $(`.eg-compose-container-${containerId}`);
    container.find('.eg-preview-loading-bar').hide();
    container.find('.eg-preview-loading').hide();
    container.find('.eg-preview-content').show();
    container.find('.eg-stop-generating-button').hide();
    container
        .find('.eg-stream-output')
        .removeClass('eg-stream-output-with-cursor');
    container.find('.eg-revise-buttons').show();
    container.find('.eg-preview-button').show();
    $(`.eg-compose-container-${containerId}`)
        .find('input')
        .prop('disabled', false);
    container.removeClass('eg-revise-buttons-disabled');
}
// Change state while editing a prompt
function showEditingState(containerId) {
    (0,_debug__WEBPACK_IMPORTED_MODULE_0__["default"])('showEditingState() called');
    const container = $(`.eg-compose-container-${containerId}`);
    container.find('.eg-revise').hide();
    container.find('.eg-edit').show();
}


/***/ }),

/***/ "./ts/lib/ui/status-message.ts":
/*!*************************************!*\
  !*** ./ts/lib/ui/status-message.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   clearAllStatusMessages: () => (/* binding */ clearAllStatusMessages),
/* harmony export */   initializeStatusMessageContainer: () => (/* binding */ initializeStatusMessageContainer),
/* harmony export */   showStatusMessage: () => (/* binding */ showStatusMessage)
/* harmony export */ });
/* harmony import */ var _debug__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../debug */ "./ts/lib/debug.ts");
/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./state */ "./ts/lib/ui/state.ts");


// Prepare the status message container
function initializeStatusMessageContainer(containerId) {
    (0,_debug__WEBPACK_IMPORTED_MODULE_0__["default"])(`Creating preview container for ${containerId}...`);
    const statusMessageContainerHTML = `
<div class="eg-status-message-container eg-status-message-container-${containerId}"></div>
`;
    $(`.eg-compose-container-${containerId}`).prepend(statusMessageContainerHTML);
}
// Clear all status messages
function clearAllStatusMessages() {
    (0,_debug__WEBPACK_IMPORTED_MODULE_0__["default"])('Clearing all status messages...');
    $('.eg-status-message-container').html('');
}
// Show a status message
function showStatusMessage({ type, message, containerId, changeState = true, cancellable = true, }) {
    clearAllStatusMessages();
    const statusMessageHTML = `
<div class="eg-status-message eg-${type}-message">
  ${message}
  <span class="eg-close-message">${cancellable ? '&#10005;' : ''}</span>
</div>
  `;
    if (containerId) {
        const statusMessageContainer = $(`.eg-status-message-container-${containerId}`);
        statusMessageContainer.append(statusMessageHTML);
        if (changeState)
            (0,_state__WEBPACK_IMPORTED_MODULE_1__.showBaseState)();
    }
    else {
        $('.eg-status-message-container').append(statusMessageHTML);
        if (changeState)
            (0,_state__WEBPACK_IMPORTED_MODULE_1__.showBaseState)();
    }
}


/***/ }),

/***/ "./ts/lib/user.ts":
/*!************************!*\
  !*** ./ts/lib/user.ts ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getUserData),
/* harmony export */   validateTokenBalance: () => (/* binding */ validateTokenBalance)
/* harmony export */ });
/* harmony import */ var _debug__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./debug */ "./ts/lib/debug.ts");
/* harmony import */ var _api__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./api */ "./ts/lib/api.ts");
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../config */ "./ts/config.ts");
/* harmony import */ var _ui_status_message__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./ui/status-message */ "./ts/lib/ui/status-message.ts");




// Get user data from back end
async function getUserData() {
    (0,_debug__WEBPACK_IMPORTED_MODULE_0__["default"])(`Fetching user data...`);
    try {
        const user = await (0,_api__WEBPACK_IMPORTED_MODULE_1__["default"])(_config__WEBPACK_IMPORTED_MODULE_2__.API_ROUTES.get_user_data);
        return user;
    }
    catch (error) {
        (0,_debug__WEBPACK_IMPORTED_MODULE_0__["default"])(`Error fetching user data: "${error}"`);
        throw error;
    }
}
// Make sure the user has enough credits to generate a message
async function validateTokenBalance(containerId) {
    const user = await getUserData();
    if (!user)
        return false;
    if (user.paidSubscriber && user.remainingCredits < 50) {
        (0,_ui_status_message__WEBPACK_IMPORTED_MODULE_3__.showStatusMessage)({
            type: 'info',
            message: `You have ${user.remainingCredits} out of 1000 messages left this month.`,
            containerId,
            changeState: false,
            cancellable: true,
        });
    }
    if (!user.paidSubscriber && user.remainingCredits < 30) {
        (0,_ui_status_message__WEBPACK_IMPORTED_MODULE_3__.showStatusMessage)({
            type: 'info',
            message: `You have ${user.remainingCredits} free message${user.remainingCredits === 1 ? '' : 's'} left.<br /><br /><a class="eg-upgrade-button" href="${_config__WEBPACK_IMPORTED_MODULE_2__.SUBSCRIPTION_URL}?email=${user.email}" target="_blank">Upgrade for $5/month</a><br /><br />Subscribers get 1000 messages per month. Cancel anytime.`,
            containerId,
            changeState: false,
            cancellable: true,
        });
    }
    if (user.remainingCredits > 0)
        return true;
    return false;
}


/***/ }),

/***/ "./ts/lib/util.ts":
/*!************************!*\
  !*** ./ts/lib/util.ts ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   generateRandomString: () => (/* binding */ generateRandomString),
/* harmony export */   getContainerId: () => (/* binding */ getContainerId),
/* harmony export */   validatePromptInput: () => (/* binding */ validatePromptInput)
/* harmony export */ });
/* harmony import */ var _debug__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./debug */ "./ts/lib/debug.ts");
/* harmony import */ var _ui_status_message__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ui/status-message */ "./ts/lib/ui/status-message.ts");


function generateRandomString() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 20; i += 1) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}
function getContainerId(element) {
    const containerId = element.attr('data-container-id');
    if (!containerId) {
        (0,_debug__WEBPACK_IMPORTED_MODULE_0__["default"])('Error: containerId is undefined');
        return null;
    }
    return containerId;
}
function validatePromptInput(prompt, containerId) {
    (0,_debug__WEBPACK_IMPORTED_MODULE_0__["default"])('validatePromptInput() called');
    const words = prompt.split(' ');
    if (words.length < 2) {
        (0,_ui_status_message__WEBPACK_IMPORTED_MODULE_1__.showStatusMessage)({
            type: 'error',
            message: 'Please enter at least 2 words',
            containerId,
            changeState: false,
        });
        return false;
    }
    if (prompt.length >= 1000) {
        (0,_ui_status_message__WEBPACK_IMPORTED_MODULE_1__.showStatusMessage)({
            type: 'error',
            message: 'Please enter fewer than 1000 characters',
            containerId,
            changeState: false,
        });
        return false;
    }
    return true;
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!***********************!*\
  !*** ./ts/content.ts ***!
  \***********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _lib_auth__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./lib/auth */ "./ts/lib/auth.ts");
/* harmony import */ var _lib_ui_compose_area__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./lib/ui/compose-area */ "./ts/lib/ui/compose-area.ts");
/* harmony import */ var _lib_ui_general__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./lib/ui/general */ "./ts/lib/ui/general.ts");
/* harmony import */ var _lib_ui_event_handlers__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./lib/ui/event-handlers */ "./ts/lib/ui/event-handlers.ts");




/**
 * This is the primary content script that gets invoked when the extension
 * loads. Here, we'll initialize the extension when the DOM loads.
 */
$(() => {
    async function initializeExtension() {
        // Add Font Awesome icons
        (0,_lib_ui_general__WEBPACK_IMPORTED_MODULE_2__.injectFontAwesome)();
        /**
         * Check whether Gmail reply elements are visible; this runs continuously in
         * the background, and will initialize the EmailGenius interface whenever it
         * detects a Gmail compose area
         */
        (0,_lib_ui_compose_area__WEBPACK_IMPORTED_MODULE_1__["default"])();
        /**
         * Grab and save the Chrome extension token from the EmailGenius website;
         * this also runs continuously in the background
         */
        await (0,_lib_auth__WEBPACK_IMPORTED_MODULE_0__.listenForTokenActions)();
        // Attach event handlers for UI events
        (0,_lib_ui_event_handlers__WEBPACK_IMPORTED_MODULE_3__["default"])();
        // Attach listener for "logged in" message from the background script
        (0,_lib_auth__WEBPACK_IMPORTED_MODULE_0__.attachLoggedInMessageListener)();
    }
    initializeExtension();
});

})();

/******/ })()
;
//# sourceMappingURL=content.js.map