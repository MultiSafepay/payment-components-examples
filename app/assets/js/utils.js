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

const setButtonStatus = (button, disabled) => {
    if(!button) {
        return;
    } 
    button.removeAttribute('disabled');
    if(disabled) {
        button.setAttribute("disabled", "disabled");
    } else {
        button.removeAttribute('disabled');
    }
    return button;
}
