const debugStateContainer = document.querySelector('.debug-state-container');
const debugRequestContainer = document.querySelector('.debug-request-container');
const debugResponseContainer = document.querySelector('.debug-response-container');

function toJsonString(obj) {
    return JSON.stringify(obj, null, 2);
}

function debugRequest(response) {
    debugRequestContainer.innerText = toJsonString(response);
}

function debugResponse(response) {
    debugResponseContainer.innerText = toJsonString(response);
}

function debugState(state) {
    debugStateContainer.innerText = toJsonString(state);
}
