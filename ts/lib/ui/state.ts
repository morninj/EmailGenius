import debugLog from '../debug';
import { focusOnComposeArea, isElementVisible } from './general';

// Change state back to the initial state
export function showBaseState(containerId: string = '') {
  debugLog('showBaseState() called');
  let container = $('.eg-compose-container');
  if (containerId) {
    // Change state of specific container, if provided
    container = $(`.eg-compose-container-${containerId}`);
    container.find(`.eg-buttons-bar-minimized-${containerId}`).hide();
    $(`.eg-compose-container-${containerId}`)
      .find('input')
      .prop('disabled', false);
    focusOnComposeArea(containerId);
  } else {
    // Change state overall of no container is specified
    container.find(`.eg-buttons-bar-minimized`).hide();
    $(`.eg-compose-container`).find('input').prop('disabled', false);
  }
  container.removeClass('eg-revise-buttons-disabled');
  container.find('.eg-buttons-bar-base').show();
  container.find('.eg-preview-wrapper').hide();
}

// Toggle minimized state when the user clicks the wand icon
export function toggleMinimizedState(containerId: string) {
  debugLog('toggleMinimizedState() called');
  const container = $(`.eg-compose-container-${containerId}`);
  const minimizedButton = `.eg-buttons-bar-minimized-${containerId}`;
  if (isElementVisible(minimizedButton)) {
    showBaseState(containerId);
    container
      .find(minimizedButton)
      .removeClass('eg-buttons-bar-minimized-visible');
  } else {
    container.find(minimizedButton).show();
    container
      .find(minimizedButton)
      .addClass('eg-buttons-bar-minimized-visible');
    container.find('.eg-buttons-bar-base').hide();
    container.find('.eg-preview-wrapper').hide();
  }
}

// Change state while waiting for OpenAI API response
export function showGeneratingState(containerId: string) {
  debugLog('showGeneratingState() called');
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
export function showStreamingState(containerId: string) {
  debugLog('showStreamingState() called');
  const container = $(`.eg-compose-container-${containerId}`);
  container.find('.eg-preview-loading').hide();
  container.find('.eg-preview-content').show();
  container.find('.eg-stream-output').addClass('eg-stream-output-with-cursor');
  container.find('.eg-preview-button').hide();
  container.find('.eg-stop-generating-button').show();
}

// Change state after message has been generated
export function showPreviewState(containerId: string) {
  debugLog('showPreviewState() called');
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
export function showEditingState(containerId: string) {
  debugLog('showEditingState() called');
  const container = $(`.eg-compose-container-${containerId}`);
  container.find('.eg-revise').hide();
  container.find('.eg-edit').show();
}
