// Check whether a given element is visible
export function isElementVisible(selector: string): boolean {
  const element = document.querySelector(selector);
  if (
    element &&
    getComputedStyle(element).display !== 'none' &&
    getComputedStyle(element).visibility !== 'hidden'
  ) {
    return true;
  }
  return false;
}

// Inject FontAwesome icons from Cloudflare CDN
export function injectFontAwesome() {
  $('head').append(
    '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">',
  );
}

// Focus on the message composition area
export function focusOnComposeArea(containerId: string) {
  const composeAreaElement = document.querySelector(
    `.eg-compose-area-${containerId}`,
  ) as HTMLElement;
  if (composeAreaElement) composeAreaElement.focus();
}
