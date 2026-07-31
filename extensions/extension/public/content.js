console.log("Content script loaded!");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "getPageInfo") {
        sendResponse({
            title: document.title,
            url: window.location.href
        });
    }
    return true; // Говорит хрому, что мы ответим асинхронно
});