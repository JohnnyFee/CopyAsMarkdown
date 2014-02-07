'use strict';

chrome.browserAction.onClicked.addListener(function(tab) {
	// No tabs or host permissions needed!
	console.log('Turning ' + tab.url + ' red!');

	chrome.tabs.query({
		active: true,
		currentWindow: true
	}, function(tabs) {
		// notify content page to convert html to markdown
		chrome.tabs.sendMessage(tabs[0].id, {
			action:'html2markdown'
		}, function(response) {
			// if success, mabe there is some notification.
			console.log(response);
		});
	});
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	// get the command : copy the content(markdown) to clipboard
    if (request.action === 'copytoclipboard') {
        copyToClipboard(request.content);
        sendResponse({
            success: true
        });
    }
})

function copyToClipboard(text) {
    var copyDiv = document.createElement('textarea');
    copyDiv.id = 'copydiv';

    document.body.appendChild(copyDiv);
    copyDiv.textContent = text;
    copyDiv.focus();
    document.execCommand('SelectAll');
    document.execCommand('copy');
    document.body.removeChild(copyDiv);
}