window.onload = function () {
    init();
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

function init() {
    getCurrentPageHost((host) => {
        document.getElementById("host-input").value = host;
    });

    bindEvent("add-btn", (element) => {
        element.onclick = add;
    });

    bindEvent("remove-btn", (element) => {
        element.onclick = remove;
    });

    listConfig();
}

function listConfig() {
    chrome.storage.local.get().then((data) => {
        var hosts = data.hosts || [];
        if (hosts && hosts.length > 0) {
            hosts.forEach(element => {
                appendTableRow(element);
            });
        } else {
            var table = document.getElementById("hosts");
            var rowCount = table.rows.length;
            for (var i = rowCount - 1; i > 0; i--) {
                table.deleteRow(i);
            }
        }
    });
}
function appendTableRow(element) {
    var table = document.getElementById("hosts");
    var row = table.insertRow();
    row.innerHTML += ("<tr><td>" + element.host + "</td><td>" + element.fontSize + "</td><td><button  class='button'>delete</button></td></tr>");
    row.addEventListener("click", function (e) {
        var target = e.target;
        if (target.tagName.toLowerCase() == "button") {
            table.deleteRow(target.parentNode.parentNode.rowIndex);
            deleteItem(element);
        }
    });
}
function getCurrentPageHost(callback) {
    let queryOptions = { active: true, lastFocusedWindow: true };
    chrome.tabs.query(queryOptions, ([tab]) => {
        if (chrome.runtime.lastError)
            console.error(chrome.runtime.lastError);
        callback(getDomain(tab.url));
    });
}

function bindEvent(id, fn) {
    var element = document.getElementById(id);
    if (element) {
        fn(element);
        return element;
    }
    console.log("element[id='" + id + "'] not found");
    return;
}

function add() {
    var form = {};
    var inputs = document.getElementsByTagName("input");
    Array.from(inputs).forEach(input => {
        if (input.type != "button") {
            form[input.name] = input.value;
        }
    });
    chrome.storage.local.get("hosts").then((data) => {
        var hosts = data.hosts || [];
        var isNew = true;
        for (var idx in hosts) {
            if (hosts[idx].host == form.host) {
                if (hosts[idx].fontSize == form.fontSize) {
                    return;
                } else {
                    hosts[idx].fontSize = form.fontSize;
                    isNew = false;
                    break;
                }
            }
        }
        if (isNew) {
            hosts.push(form);
        }
        chrome.storage.local.set({ "hosts": hosts }).then(() => {
            if (isNew) {
                appendTableRow(form);
            } else {
                updateTableRow(form);
            }
            executeSetFontCommand(form);
        });
    });
}

function remove() {
    chrome.storage.local.remove("hosts").then(() => {
        listConfig();
    });
}

function deleteItem(element) {
    chrome.storage.local.get("hosts").then((data) => {
        var hosts = data.hosts || [];
        var idx = -1;
        for (var i = 0; i < hosts.length; i++) {
            if (hosts[i].host == element.host) {
                idx = i;
                break;
            }
        }
        if (idx >= 0) {
            hosts.splice(idx, 1);
            chrome.storage.local.set({ "hosts": hosts });
        }
    });
}

function executeSetFontCommand(data) {
    let queryOptions = { active: true, lastFocusedWindow: true };
    chrome.tabs.query(queryOptions, ([tab]) => {
        if (chrome.runtime.lastError)
            console.error(chrome.runtime.lastError);
        if (getDomain(tab.url) == data.host) {
            console.log(tab.id)
            console.log(tab)
            chrome.tabs.sendMessage(tab.id, {
                command: "autoFontSet",
                data: data
            });
        }
    });
}

function updateTableRow(data) {
    var table = document.getElementById("hosts");
    var rows = table.rows;
    for(var row of rows){
        if(row.cells[0].innerHTML==data.host){
            row.cells[1].innerHTML=data.fontSize;
            return;
        }
    }
}