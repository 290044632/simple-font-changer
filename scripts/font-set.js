/**
 * 发送命令
 */
chrome.runtime.sendMessage({
    command: "fontSet",
    data:{
        host: window.document.location.host,
        href: window.document.location.href
    }
}, (response) => {
    console.log('received user data', response);
    if (response.command == "fontSetAck") {
        window.document.body.style.fontSize = response.data.fontSize;
    }
});

/**
 * 监听消息
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log(message)
    if (message.command == 'fontQuery') {
        asyncHandleFontQueryCommand(message, sendResponse);
        return true;
    }else if(message.command == 'autoFontSet'){
        asyncHandleAutoFontSetCommand(message);
        //return true;
    }
});

async function asyncHandleFontQueryCommand(message, sendResponse) {
    var bodyStyle = window.getComputedStyle(window.document.body);
    var fontSize = bodyStyle.getPropertyValue("font-size") || "12px";
    var data =message.data;
    data['fontSize'] = fontSize;
    sendResponse({ command: "fontQueryAck", data: data});
}

async function asyncHandleAutoFontSetCommand(message){
    window.document.body.style.fontSize = message.data.fontSize;
}