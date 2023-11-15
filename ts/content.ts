import {
  attachLoggedInMessageListener,
  listenForTokenActions,
} from './lib/auth';
import listenForGmailComposeArea from './lib/ui/compose-area';
import { injectFontAwesome } from './lib/ui/general';
import attachEventHandlers from './lib/ui/event-handlers';

/**
 * This is the primary content script that gets invoked when the extension
 * loads. Here, we'll initialize the extension when the DOM loads.
 */
$(() => {
  async function initializeExtension() {
    // Add Font Awesome icons
    injectFontAwesome();

    /**
     * Check whether Gmail reply elements are visible; this runs continuously in
     * the background, and will initialize the EmailGenius interface whenever it
     * detects a Gmail compose area
     */
    listenForGmailComposeArea();

    /** Grab and save the Chrome extension token from the EmailGenius dashboard;
     * this also runs continuously in the background
     */
    await listenForTokenActions();

    // Attach event handlers for UI events
    attachEventHandlers();

    // Attach listener for "logged in" message from the background script
    attachLoggedInMessageListener();
  }
  initializeExtension();
});
