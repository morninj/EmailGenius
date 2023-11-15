import debugLog from './debug';
import { getTokenLocally, isUserLoggedIn } from './auth';

export function logApiRequestStart() {
  const separator = '='.repeat(80);
  debugLog(`\n\n${separator}\nBegin API request\n${separator}\n\n`);
}

export function logApiRequestEnd() {
  const separator = '='.repeat(80);
  debugLog(`\n\n${separator}\nEnd API request\n${separator}\n\n`);
}

// Send API requests to the back end
export default async function apiRequest(endpoint: string, data: object = {}) {
  logApiRequestStart();

  debugLog(`Initializing API request to ${endpoint}...`);

  if (!(await isUserLoggedIn())) {
    debugLog('User is not logged in; aborting API request');
    logApiRequestEnd();
    throw new Error('User is not logged in');
  }

  const token = await getTokenLocally();

  // Add token to request data
  const apiRequestData = { ...data, chromeExtensionToken: token };

  // Log API request parameters
  let apiRequestDataString = `Sending API request to ${endpoint} with data:\n\n{\n`;
  Object.entries(apiRequestData).forEach(([key, value]) => {
    apiRequestDataString += `  ${key}: ${value}\n`;
  });
  apiRequestDataString += '}';
  debugLog(apiRequestDataString);

  try {
    // Send API request
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...apiRequestData }),
    });

    // Save data from response
    const responseData = await response.json();

    // Response succeeded; return data
    if (response.ok) {
      debugLog(
        `API response received:\n\n${JSON.stringify(responseData, null, 2)}`,
      );
      logApiRequestEnd();
      return responseData;
    }

    // Response failed; throw error
    throw new Error(response.statusText);
  } catch (error) {
    debugLog(`API response error: ${error}`);
    logApiRequestEnd();
    throw error;
  }
}
