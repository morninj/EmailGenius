import debugLog from './debug';
import { API_ROUTES } from '../config';
import { showPreviewState, showStreamingState } from './ui/state';
import { getTokenLocally, isUserLoggedIn } from './auth';
import { logApiRequestStart, logApiRequestEnd } from './api';
import { showStatusMessage } from './ui/status-message';

interface StreamingMessageGenerationParams {
  containerId: string;
  prompt?: string;
  previousPrompt?: string;
  previousMessage?: string;
  tryAgainUrl?: string;
}

/**
 * Stream a message from the API to the UI.
 *
 * @param {string} containerId - The ID of the compose area
 * @param {string} prompt - The prompt to generate a message from
 * @param {string} previousPrompt - The previous prompt (if any)
 * @param {string} previousMessage - The previous message (if any)
 * @param {string} tryAgainUrl - The URL to use for "try again" requests
 */
export default async function generateStreamingMessage({
  containerId,
  prompt,
  previousPrompt,
  previousMessage,
  tryAgainUrl,
}: StreamingMessageGenerationParams) {
  debugLog(`Generating streaming message for prompt: "${prompt}"`);

  // Clear previous preview
  $(`.eg-preview-message-contents-${containerId}`)
    .find('.eg-stream-output')
    .html('');

  logApiRequestStart();

  // Check if user is logged in; if not, abort
  if (!(await isUserLoggedIn())) {
    debugLog('User is not logged in; aborting API request');
    logApiRequestEnd();
    showStatusMessage({
      type: 'error',
      message:
        'Please <a href="#" class="eg-auth-link">log in</a> to use EmailGenius.',
      containerId,
    });
    return;
  }

  // Get token from local storage
  const chromeExtensionToken = await getTokenLocally();

  debugLog('Constructing streaming request URL...');
  debugLog(`previousPrompt: ${previousPrompt}`);
  debugLog(`previousMessage: ${previousMessage}`);

  // Construct request URL
  let url = `${API_ROUTES.generate_message_streaming}?chromeExtensionToken=${chromeExtensionToken}&prompt=${prompt}`;

  // Add previous prompt and message to URL if they exist
  if (previousPrompt) url += `&previousPrompt=${previousPrompt}`;
  if (previousMessage) url += `&previousMessage=${previousMessage}`;

  // If the user clicked "try again," use the URL saved in the "try again" button
  if (tryAgainUrl) url = tryAgainUrl;

  // Save URL to "try again" button
  $(`.eg-try-again-button-${containerId}`).attr('try-again-url', url);

  debugLog(`Initiating streaming request to ${url}`);

  // Print streaming chunks in the preview container
  function showStreamingResponse(data: string) {
    showStreamingState(containerId);
    const outputElement = $(`.eg-preview-message-contents-${containerId}`).find(
      '.eg-stream-output',
    );
    const currentOutput = outputElement.html();
    outputElement.html(currentOutput + data);
  }

  // Get streaming chunks from the server
  function streamResponse(callback: (data: string) => void) {
    const eventSource = new EventSource(url);
    debugLog(`Listening on SSE: ${eventSource}`);

    /* If it takes longer than 12 seconds to get a response from the server,
     * re-invoke the request
     */
    let isActive = true;
    const errorTimeout = setTimeout(() => {
      debugLog(
        'Delay of more than 12 seconds detected, re-invoking streamResponse...',
      );
      isActive = false;
      eventSource.close();
      streamResponse(callback);
    }, 12000);

    // Handle errors
    let hasErrorOccurred = false;
    eventSource.onerror = (error: Event) => {
      if (!isActive) return;
      clearTimeout(errorTimeout);
      if (!hasErrorOccurred) {
        hasErrorOccurred = true;
        const errorEvent = error as ErrorEvent;
        const errorObj = {
          type: errorEvent.type,
          message: errorEvent.message,
        };
        debugLog(`API response error: ${JSON.stringify(errorObj)}`);
        showStatusMessage({
          type: 'error',
          message: 'Something went wrong. Please try again.',
          containerId,
        });
        logApiRequestEnd();
        eventSource.close();
      }
    };

    // Handle streamed message chunks
    eventSource.onmessage = (event) => {
      if (!isActive) return;
      clearTimeout(errorTimeout);
      const { data } = event;
      // debugLog(data);
      if (data === '[DONE]') {
        eventSource.close();
        logApiRequestEnd();
        showPreviewState(containerId);
      } else {
        const jsonData = JSON.parse(data);
        const { content } = jsonData.choices[0].delta;
        if (content) {
          const formattedContent = content?.replace(/\n/g, '<br>');
          callback(formattedContent);
        }
        // Cancel generation if user clicks "cancel"
        if (
          $(`.eg-stop-generating-button-${containerId}`).attr(
            'data-generation-cancelled',
          ) === 'true'
        ) {
          logApiRequestEnd();
          eventSource.close();
          showPreviewState(containerId);
        }
      }
    };
    return {
      close: () => {
        eventSource.close();
        logApiRequestEnd();
        showPreviewState(containerId);
      },
    };
  }

  try {
    streamResponse(showStreamingResponse);
  } catch (error) {
    debugLog(`API response error: ${error}`);
    showStatusMessage({
      type: 'error',
      message: 'Something went wrong. Please try again.',
      containerId,
    });
    logApiRequestEnd();
  }
}
