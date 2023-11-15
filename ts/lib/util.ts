import debugLog from './debug';
import { showStatusMessage } from './ui/status-message';

export function generateRandomString() {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 20; i += 1) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export function getContainerId(element: JQuery<HTMLElement | Document>) {
  const containerId = element.attr('data-container-id');
  if (!containerId) {
    debugLog('Error: containerId is undefined');
    return null;
  }
  return containerId;
}

export function validatePromptInput(prompt: string, containerId: string) {
  debugLog('validatePromptInput() called');
  const words = prompt.split(' ');
  if (words.length < 2) {
    showStatusMessage({
      type: 'error',
      message: 'Please enter at least 2 words',
      containerId,
      changeState: false,
    });
    return false;
  }
  if (prompt.length >= 1000) {
    showStatusMessage({
      type: 'error',
      message: 'Please enter fewer than 1000 characters',
      containerId,
      changeState: false,
    });
    return false;
  }
  return true;
}
