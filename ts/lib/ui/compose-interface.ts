import debugLog from '../debug';
import { generateRandomString } from '../util';
import showInputSuggestions from './input-suggestions';
import { initializeStatusMessageContainer } from './status-message';
import { authenticationCheck } from '../auth';

// Create the primary interface bar; this lives at the top of the compose area
export function initializeButtonsBar(
  containerId: string,
  composeContainer: JQuery<HTMLElement>,
) {
  /**
   * Is this a reply composition window (as opposed to a fresh composition
   * window)? If so, we'll add additional styling
   */
  let isReply = false;
  if (
    composeContainer.closest('.aoP').has('div[aria-label="Type of response"]')
      .length > 0
  ) {
    isReply = true;
  }

  // Generate message buttons HTML
  const buttonsBarHTML = `
<div class="eg-compose-container eg-compose-container-${containerId} ${
    isReply ? ' eg-compose-container-reply' : ''
  }">
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
export function initializePreviewContainer(containerId: string): void {
  debugLog(`Creating preview container for ${containerId}...`);

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
export function initializeComposeInterface(composeArea: HTMLElement): void {
  // Get the container for the message composition area
  const container = $(composeArea).closest('.iN');

  // If the message buttons are already attached, don't attach them again
  if (container.hasClass('eg-buttons-attached')) return;

  // Add a class to indicate that the message buttons are attached
  container.addClass('eg-buttons-attached');

  // Generate a unique ID for this container
  const containerId = generateRandomString();
  $(composeArea).addClass(`eg-compose-area-${containerId}`);

  // Inject message buttons
  const messageButtonsHTML = initializeButtonsBar(containerId, container);
  debugLog('Prepending message buttons...');
  container.before(messageButtonsHTML);

  // Create the message preview container (hidden initially)
  initializePreviewContainer(containerId);

  // Create the error/info message container (hidden initially)
  initializeStatusMessageContainer(containerId);

  // Check if user is authenticated, and if not, show login prompt
  authenticationCheck(containerId);

  // Show suggestions in the input placeholder attribute
  showInputSuggestions('.eg-generate-input', 'generate');
}

// Show the generated message in the preview container
export function injectMessagePreview(
  containerId: string,
  message: string,
): void {
  $(`.eg-preview-container-${containerId}`)
    .find('.eg-preview-message-contents')
    .html(message);
}
