console.log("service worker");
/**
 * 监听消息
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log(message)
    if (message.command == 'fontSet') {
       asyncHandleFontSetCommand(message, sendResponse);
       return true;
    }
});

/**
 * 异步处理命令
*/
async function asyncHandleFontSetCommand(message,sendResponse){
    chrome.storage.local.get("hosts").then((data) => {
        console.log(data);
        var hosts = data.hosts||[];
        if(hosts.length >0){
            for(var host of hosts){
                if(host.host== message.data.host){
                    sendResponse({ command: "fontSetAck", data:host });
                    return;
                }
            }
        }
        sendResponse({ command: "ack" });
    });
}