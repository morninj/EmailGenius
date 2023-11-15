import handleMessageGeneration from './generate-message';
import {
  showBaseState,
  showEditingState,
  showPreviewState,
  toggleMinimizedState,
} from './state';
import { getContainerId } from '../util';
import { focusOnComposeArea } from './general';
import debugLog from '../debug';
import showInputSuggestions from './input-suggestions';
import { showAuthenticationFlow } from '../auth';

// Handle "Edit -> Regenerate" actions
function processRegenerateAction(containerId: string) {
  debugLog('processRegenerateAction() called');
  const inputElement = $(`.eg-edit-input-${containerId}`);
  const prompt = inputElement.val() as string;

  const previousPrompt = $(`.eg-previous-prompt-${containerId}`).attr(
    'data-previous-prompt',
  );
  debugLog(`Retrieved previous prompt: "${previousPrompt}"`);

  const previousHTMLMessage = $(`.eg-preview-message-contents-${containerId}`)
    .find('.eg-stream-output')
    .html();
  const previousMessage = previousHTMLMessage.replace(/<br>/g, '\n');
  debugLog(`Retrieved previous message: "${previousMessage}"`);

  inputElement.val('');

  handleMessageGeneration({
    containerId,
    inputElement,
    prompt,
    previousPrompt,
    previousMessage,
  });
}

// Attach event handlers when the extension initializes
export default function attachEventHandlers() {
  // Handle "Minimze" button clicks
  $(document).on('click', '.eg-wand', function () {
    const containerId = getContainerId($(this));
    if (!containerId) return;
    toggleMinimizedState(containerId);
  });

  // Handle "Generate" button clicks
  $(document).on('click', '.eg-generate-input-create-button', function () {
    const containerId = getContainerId($(this));
    if (!containerId) return;
    const inputElement = $(`.eg-generate-input-${containerId}`);
    const prompt = inputElement.val() as string;
    handleMessageGeneration({ containerId, inputElement, prompt });
  });

  // Handle "Enter" keypresses in the generate prompt input
  let lastKeypressTime = 0;
  $(document).on('focusin', (e) => {
    if ($(e.target).hasClass('eg-generate-input')) {
      $(e.target).on('keydown', function (e2) {
        const containerId = getContainerId($(this));
        if (!containerId) return;
        if (e2.key === 'Enter') {
          const currentTime = new Date().getTime();
          if (currentTime - lastKeypressTime > 2000) {
            const inputElement = $(`.eg-generate-input-${containerId}`);
            const prompt = inputElement.val() as string;
            handleMessageGeneration({ containerId, inputElement, prompt });
            lastKeypressTime = currentTime;
          }
        }
      });
    }
  });

  // Handle "Edit" button clicks
  $(document).on('click', '.eg-revise-button', function () {
    const containerId = getContainerId($(this));
    if (!containerId) return;
    showEditingState(containerId);
    const editInputElement = document.querySelector(
      `.eg-edit-input-${containerId}`,
    );
    if (editInputElement) {
      (editInputElement as HTMLElement).focus();
    }

    // Only call "show suggestions" once; otherwise, it'll get called repeatedly
    // and will show updated suggestions too often
    if (
      $(`.eg-edit-input-${containerId}`).attr('data-suggestions-shown') !==
      'true'
    ) {
      showInputSuggestions(`.eg-edit-input-${containerId}`, 'edit');
      $(`.eg-edit-input-${containerId}`).attr('data-suggestions-shown', 'true');
    }
  });

  // Handle "Enter" keypresses in the edit prompt input
  let lastEditKeypressTime = 0;
  $(document).on('focusin', (e) => {
    if ($(e.target).hasClass('eg-edit-input')) {
      $(e.target).on('keydown', function (e2) {
        const containerId = getContainerId($(this));
        if (!containerId) return;
        if (e2.key === 'Enter') {
          const currentTime = new Date().getTime();
          if (currentTime - lastEditKeypressTime > 2000) {
            debugLog('"Enter" keypress detected');
            processRegenerateAction(containerId);
            lastEditKeypressTime = currentTime;
          }
        }
      });
    }
  });

  // Handle editing "regenerate" button clicks
  $(document).on('click', '.eg-regenerate-button', function () {
    const containerId = getContainerId($(this));
    if (!containerId) return;
    processRegenerateAction(containerId);
  });

  // Handle "Try Again" button clicks
  $(document).on('click', '.eg-try-again-button', function () {
    const containerId = getContainerId($(this));
    if (!containerId) return;
    const tryAgainUrl = $(this).attr('try-again-url');
    handleMessageGeneration({ containerId, tryAgainUrl });
  });

  // Handle "Stop Generating" button clicks
  $(document).on('click', '.eg-stop-generating-button', function () {
    const containerId = getContainerId($(this));
    if (!containerId) return;
    $(this).attr('data-generation-cancelled', 'true');
    showPreviewState(containerId);
    $(this).hide();
  });

  // Handle "Insert" button clicks
  $(document).on('click', '.eg-preview-insert-button', function () {
    const containerId = getContainerId($(this));
    if (!containerId) return;

    // Get the message contents
    const messageContents = $(
      `.eg-preview-container-${containerId} .eg-preview-message-contents`,
    ).html();

    // Remove p tags (and any attributes) and replace them with divs
    const cleanedMessageContents = messageContents
      .replace(/<p[^>]*>/g, '<div>')
      .replace(/<\/p>/g, '</div>');

    /** 
     * Wrap paragraphs in divs and replace "<br><br>" with an empty div
     * (this is necessary for integration with Gmail's message styles)
     */
    const paragraphs = cleanedMessageContents.split('<br><br>');
    const wrappedParagraphs = paragraphs.map(
      (paragraph) => `<div>${paragraph}</div><div><br></div>`,
    );

    // Insert the message contents into the compose area
    $(`.eg-compose-area-${containerId}`).prepend(
      `${wrappedParagraphs.join('')}<div><br></div>`,
    );

    // Clear the prompt input
    $(`.eg-generate-input-${containerId}`).val('');

    // Show the base state and focus on the compose area
    showBaseState(containerId);
    focusOnComposeArea(containerId);
  });

  // Handle "Cancel" button clicks in the preview state
  $(document).on('click', '.eg-preview-cancel-button', function () {
    const containerId = getContainerId($(this));
    if (!containerId) return;
    showBaseState(containerId);

    // Clear the prompt input
    $(`.eg-generate-input-${containerId}`).val('');
  });

  // Handle "Cancel" button clicks in the generate state
  $(document).on('click', '.eg-generate-input-cancel-button', function () {
    const containerId = getContainerId($(this));
    if (!containerId) return;
    showBaseState(containerId);
  });

  // Handle "Close Message" button clicks
  $(document).on('click', '.eg-close-message', function () {
    $(this).parent().hide();
  });

  // Handle "please log in" clicks
  $(document).on('click', '.eg-auth-link', (event) => {
    event.preventDefault();
    showAuthenticationFlow();
  });
}
