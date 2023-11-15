/**
 * Use the development back end (localhost:3000) and allow debugging messages
 *
 * Don't touch these. The build script will temporarily set these to false during
 * the build process, and then set them back to true when the build is complete.
 *
 * This allows us to use the production back end for the production build and
 * the development back end for the development build.
 */
export const USE_DEV_BACK_END = true;
export const ALLOW_DEBUG_MESSAGES = true;

// Back-end hosts
export const DEV_BACK_END_HOST = 'http://localhost:3000';
export const PROD_BACK_END_HOST = 'https://app.emailgenius.app';
export const BACK_END_HOST = USE_DEV_BACK_END
  ? DEV_BACK_END_HOST
  : PROD_BACK_END_HOST;

// API endpoints
const createApiUrl = (endpoint: string) =>
  `${BACK_END_HOST}/api/chrome-extension/${endpoint}`;
export const API_ROUTES = {
  generate_message_streaming: createApiUrl('messages/generate-streaming'),
  generate_message: createApiUrl('messages/generate'),
  get_user_data: createApiUrl('users/get-user-data'),
};

// Other URLs
export const LOGIN_POPUP_URL = `${BACK_END_HOST}/login-popup`;
export const DASHBOARD_URL = `${BACK_END_HOST}/dashboard`;
export const SIGNED_OUT_URL = `${BACK_END_HOST}/dashboard/signed-out`;
export const SUBSCRIPTION_URL = `${BACK_END_HOST}/api/payment/create-checkout-session`;
