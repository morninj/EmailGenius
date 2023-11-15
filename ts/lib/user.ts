import debugLog from './debug';
import apiRequest from './api';
import { API_ROUTES, SUBSCRIPTION_URL } from '../config';
import { showStatusMessage } from './ui/status-message';

// Get user data from back end
export default async function getUserData() {
  debugLog(`Fetching user data...`);
  try {
    const user = await apiRequest(API_ROUTES.get_user_data);
    return user;
  } catch (error) {
    debugLog(`Error fetching user data: "${error}"`);
    throw error;
  }
}

// Make sure the user has enough credits to generate a message
export async function validateTokenBalance(containerId: string) {
  const user = await getUserData();
  if (!user) return false;
  if (user.paidSubscriber && user.remainingCredits < 50) {
    showStatusMessage({
      type: 'info',
      message: `You have ${user.remainingCredits} out of 1000 messages left this month.`,
      containerId,
      changeState: false,
      cancellable: true,
    });
  }
  if (!user.paidSubscriber && user.remainingCredits < 40) {
    showStatusMessage({
      type: 'info',
      message: `You have ${user.remainingCredits} free message${
        user.remainingCredits === 1 ? '' : 's'
      } left.<br /><br /><a class="eg-upgrade-button" href="${SUBSCRIPTION_URL}?email=${
        user.email
      }" target="_blank">Upgrade for $5/month</a><br /><br />Subscribers get 1000 messages per month. Cancel anytime.`,
      containerId,
      changeState: false,
      cancellable: true,
    });
  }

  if (user.remainingCredits > 0) return true;
  return false;
}
