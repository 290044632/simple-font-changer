
window.onload = function () {
    console.log("html load");
    bindEvent("add-btn", function (element) {
        element.onclick = add;
    })
    bindEvent("subtract-btn", function (element) {
        element.onclick = subtract;
    })
}
function getElementById(id) {
    return document.getElementById(id);
}
function bindEvent(id, fn) {
    var element = getElementById(id);
    if (element) {
        fn(element);
        return element;
    }
    console.log("element[id='" + id + "'] not found");
    return;
}
function getDomain(url) {
    let domain;
    const urlRegex = /^(?:https?:\/\/)?(?:www\.)?([^\/:\n\r]+)/;
    const match = url.match(urlRegex);
    if (match && match.length > 1) {
        domain = match[1];
    }
    return domain;
}
function getAndSet(config) {
    chrome.storage.local.get("domains").then((domains) => {
        console.log("Value is " + domains);
    });
}
function add() {
    alert("add")
    let queryOptions = { active: true, lastFocusedWindow: true };
    chrome.tabs.query(queryOptions, ([tab]) => {
        if (chrome.runtime.lastError)
            console.error(chrome.runtime.lastError);
        let domain = getDomain(tab.url);
        chrome.windows.getCurrent((windows) => {
            console.log(windows);
        });
        getAndSet({ domain: 12 });
    });
    return;
}
function subtract() {
    alert("subtract")
    return;
}