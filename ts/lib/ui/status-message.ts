import debugLog from '../debug';
import { showBaseState } from './state';


// Prepare the status message container
export function initializeStatusMessageContainer(containerId: string) {
  debugLog(`Creating preview container for ${containerId}...`);

  const statusMessageContainerHTML = `
<div class="eg-status-message-container eg-status-message-container-${containerId}"></div>
`;

  $(`.eg-compose-container-${containerId}`).prepend(statusMessageContainerHTML);
}

interface ShowStatusMessageParams {
  type: 'info' | 'warning' | 'error' | 'welcome';
  message: string;
  containerId?: string;
  changeState?: boolean;
  cancellable?: boolean;
}

// Clear all status messages
export function clearAllStatusMessages() {
  debugLog('Clearing all status messages...');
  $('.eg-status-message-container').html('');
}

// Show a status message
export function showStatusMessage({
  type,
  message,
  containerId,
  changeState = true,
  cancellable = true,
}: ShowStatusMessageParams) {
  clearAllStatusMessages();
  const statusMessageHTML = `
<div class="eg-status-message eg-${type}-message">
  ${message}
  <span class="eg-close-message">${cancellable ? '&#10005;' : ''}</span>
</div>
  `;
  if (containerId) {
    const statusMessageContainer = $(
      `.eg-status-message-container-${containerId}`,
    );
    statusMessageContainer.append(statusMessageHTML);
    if (changeState) showBaseState();
  } else {
    $('.eg-status-message-container').append(statusMessageHTML);
    if (changeState) showBaseState();
  }
}
