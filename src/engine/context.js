///// EVENT CONTEXT /////

// This is a test implementation coming to the new version of BraceJs

// Define an object to store event handlers
const events = {};

// Define a function to subscribe to events
function subscribe(eventName, callback, element) {
  // If the event does not exist in the 'events' object, create a new object for it
  if (!events[eventName]) {
    events[eventName] = { callbacks: [], event: null };
  }

  // If no element is provided, use the global 'window' object
  element = element || window;

  // Add the callback to the list of callbacks for this event
  events[eventName].callbacks.push(callback);

  // Add an event listener to the specified element for the specified event
  element.addEventListener(eventName, callback);
}

// Define a function to unsubscribe from events
function unsubscribe(eventName, callback, element) {
  // If the event does not exist in the 'events' object, return
  if (!events[eventName]) {
    return;
  }

  // If no element is provided, use the global 'window' object
  element = element || window;

  // Find the index of the callback in the list of callbacks for this event
  const index = events[eventName].callbacks.indexOf(callback);

  // If the callback is found, remove it from the list of callbacks
  if (index !== -1) {
    events[eventName].callbacks.splice(index, 1);
  }

  // Remove the event listener from the specified element for the specified event
  element.removeEventListener(eventName, callback);
}

// Define a function to emit events
function emit(eventName, data, element) {
  // If the event does not exist in the 'events' object, return
  if (!events[eventName]) {
    return;
  }

  // If no element is provided, use the global 'window' object
  element = element || window;

  // If the event does not have a custom event object, create one with the provided data
  if (!events[eventName].event) {
    events[eventName].event = new CustomEvent(eventName, { detail: data });
  }

  // Dispatch the event on the specified element
  element.dispatchEvent(events[eventName].event);
}

// Export the functions to be used by other modules
export {
  subscribe,
  unsubscribe,
  emit
};
