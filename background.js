// Set settings on fresh install
chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.local.set({
        isActive: false,
        whitelist: [
            "youtube.com"
        ],
        blacklist: [
            "chase.com",
            "bankofamerica.com",
            "mail.google.com",
            "paypal.com"
        ]
    });
});

//Listener for toggle button message
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.action === "toggle"){
        //Get the current state of the toggle
        chrome.storage.local.get("isActive", function(result) {
            //
            const newState = !result.isActive;
            chrome.storage.local.set({isActive : newState}, function() {
                console.log("Background.js set new toggle state")
                sendResponse({ isActive : newState, status : "complete"})
            })
        });
    }
    return true;
});

// Check whitelist on page load
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status !== "complete") {return};
    if (!tab.url) {return};
    console.log("New tab loaded checking againts whitelist & blacklist");

    const hostname = new URL(tab.url).hostname;

    chrome.storage.local.get(["whitelist", "blacklist"], function(result) {
        const whitelist = result.whitelist || [];
        const blacklist = result.blacklist || [];

        // check blacklist first
        const isBlocked = blacklist.some(function(domain) {
            return hostname.includes(domain);
        });

        if (isBlocked) {
            chrome.storage.local.set({ isActive: false });
            console.log(hostname, " is blacklisted, disabled")
            return; // stop here, do nothing else
        }

        // check whitelist
        const isWhitelisted = whitelist.some(function(domain) {
            return hostname.includes(domain);
        });

        if (isWhitelisted) {
            console.log(hostname, " is whitelisted, enabled")
            chrome.storage.local.set({ isActive: true });
        }
    });
});

