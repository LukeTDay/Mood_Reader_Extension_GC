//Update toggle when popup loads
updateToggleButton();

//Toggle Button
const toggleButton = document.getElementById("toggle-btn");
//Spotify Button
const spotifyButton = document.getElementById("spotify-btn");

//Toggle On/Off
toggleButton.addEventListener("click", function(){
    chrome.runtime.sendMessage({action : "toggle"}, function(response) {
        console.log("Popup.js toggle successful");
        updateToggleButton();
    });
});

//Update function for toggle button
function updateToggleButton(){
    //Get current state of the toggle
    chrome.storage.local.get("isActive", function(result){
        //Return false if isActive is undefined
        const isActive = result.isActive || false;
        if (isActive) {
            toggleButton.textContent = "Deactivate";

        } else if (!isActive) {
            toggleButton.textContent = "Activate";
        }
        console.log("Popup.js updating toggle button")
    });

}

// popup.js - adding current page to whitelist
document.getElementById("whitelist-btn").addEventListener("click", function() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        const hostname = new URL(tabs[0].url).hostname;
        
        chrome.storage.local.get("whitelist", function(result) {
            const whitelist = result.whitelist || [];
            
            // only add it if it isn't already there
            if (!whitelist.includes(hostname)) {
                whitelist.push(hostname);
                console.log("Added ", hostname, " to whitelist")
                chrome.storage.local.set({ whitelist: whitelist });
            }
        });
    });
});
