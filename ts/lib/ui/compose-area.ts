import { isElementVisible } from './general';
import { initializeComposeInterface } from './compose-interface';

/**
 *  Check whether we're in a Gmail compose area;
 *  if so, inject and show the EmailGenius interface
 */
export default function listenForGmailComposeArea() {
  const listenInterval = 1000;
  setTimeout(function checkForComposeElements() {
    // Loop through message composition elements
    $('div[aria-label="Message Body"]').each((index, composeArea) => {
      if (isElementVisible('div[aria-label="Message Body"]')) {
        initializeComposeInterface(composeArea);
      }
    });
    setTimeout(checkForComposeElements, listenInterval);
  }, listenInterval);
}
