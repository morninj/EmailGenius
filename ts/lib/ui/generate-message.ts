import debugLog from '../debug';
import { showBaseState, showGeneratingState } from './state';
import generateStreamingMessage from '../inference';
import { validatePromptInput } from '../util';
import { validateTokenBalance } from '../user';

interface MessageGenerationParams {
  containerId: string;
  inputElement?: JQuery<HTMLElement>;
  prompt?: string;
  previousPrompt?: string;
  previousMessage?: string;
  tryAgainUrl?: string;
}

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
export default async function handleMessageGeneration({
  containerId,
  inputElement,
  prompt,
  previousPrompt,
  previousMessage,
  tryAgainUrl,
}: MessageGenerationParams) {
  debugLog('handleMessageGeneration() called');

  // Check if inputElement is disabled; if so, don't do anything
  if (inputElement && inputElement.prop('disabled')) {
    debugLog('Input is disabled; not generating message');
    return;
  }

  if (tryAgainUrl) {
    // If the user clicked "try again," use the URL saved in the "try again" button
    showGeneratingState(containerId);
    if (await validateTokenBalance(containerId)) {
      generateStreamingMessage({ containerId, tryAgainUrl });
    } else {
      showBaseState(containerId);
    }
  } else {
    // Otherwise, pass all prompt data to generateStreamingMessage()

    // Validate prompt input
    if (!validatePromptInput(prompt || '', containerId)) {
      debugLog('Prompt is invalid; not generating message');
      return;
    }
    debugLog('Prompt is valid; continuing to generation...');

    showGeneratingState(containerId);

    // Validate token balance
    if (!(await validateTokenBalance(containerId))) {
      showBaseState(containerId);
      return;
    }

    // Save the prompt in a hidden div
    $(`.eg-previous-prompt-${containerId}`).attr(
      'data-previous-prompt',
      prompt || '',
    );

    // Send an API request to start generating a message and stream it to the UI
    generateStreamingMessage({
      containerId,
      prompt,
      previousPrompt,
      previousMessage,
    });
  }
}
