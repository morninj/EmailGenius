import debugLog from '../debug';

const generatePlaceholderText = [
  'Catch up with a friend',
  'Invite friends to a party',
  'Write a thank-you note',
  'Send congratulations',
  'Send holiday greetings',
  'Ask for book recommendations',
  'Send an apology',
  'Ask for advice',
  'Send an introduction',
];

const editPlaceholderText = [
  'Make it shorter',
  'Make it funnier',
  'Add bullet points',
  'Include a question',
  'Add a quotation from an expert',
  'Add data or statistics',
  'Add emojis',
  'Use metaphors or analogies',
  'Add a sense of urgency',
  'Add a summary at the top',
];

// Show suggestions as placeholder text in the input field
export default function showInputSuggestions(
  element: string,
  inputType: string,
) {
  const refreshInterval = 2500;
  debugLog(`Showing input suggestions for ${inputType} input on ${element}`);

  let placeholderText: string[] = [];
  if (inputType === 'generate') placeholderText = generatePlaceholderText;
  if (inputType === 'edit') placeholderText = editPlaceholderText;

  const lastFive: string[] = [];
  const inputElement = document.querySelector(element);

  function updatePlaceholder() {
    debugLog('updatePlaceholder() called');
    if (inputElement) {
      let newText;
      do {
        newText =
          placeholderText[Math.floor(Math.random() * placeholderText.length)];
      } while (lastFive.includes(newText));

      lastFive.push(newText);
      if (lastFive.length > 5) {
        lastFive.shift();
      }

      inputElement.setAttribute('placeholder', newText);
    }
  }

  if (inputElement) {
    setTimeout(updatePlaceholder, 0);
  }

  setInterval(() => {
    if (inputElement) {
      updatePlaceholder();
    }
  }, refreshInterval);
}
