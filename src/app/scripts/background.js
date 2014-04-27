'use strict';

(function () {
    var requestHtml2Mardown = function () {
        chrome.tabs.query({
            active: true,
            currentWindow: true
        }, function (tabs) {
            // notify content page to convert html to markdown
            chrome.tabs.sendMessage(tabs[0].id, {
                action: 'html2markdown'
            }, function (response) {
                // if success, mabe there is some notification.
                console.log(response);
            });
        });
    };

    var copyToClipboard = function (text) {
        var copyDiv = document.createElement('textarea');
        copyDiv.id = 'copydiv';

        document.body.appendChild(copyDiv);
        copyDiv.textContent = text;
        copyDiv.focus();
        document.execCommand('SelectAll');
        document.execCommand('copy');
        document.body.removeChild(copyDiv);
    };

    chrome.browserAction.onClicked.addListener(function (tab) {
        // No tabs or host permissions needed!
        console.log('Turning ' + tab.url + ' red!');

        requestHtml2Mardown();
    });

    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        // get the command : copy the content(markdown) to clipboard
        if (request.action === 'copytoclipboard') {
            copyToClipboard(request.content);
            sendResponse({
                success: true
            });
        }
    });

    chrome.commands.onCommand.addListener(function (command) {
        console.log('Received Command:' + command);

        if (command !== 'html2markdown') {
            return;
        }

        requestHtml2Mardown();
    });


}());