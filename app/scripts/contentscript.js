/*
 * Created with Sublime Text 2.
 * User: song.chen
 * Date: 2014-01-29
 * Time: 23:41:10
 * Contact: song.chen@qunar.com
 */
'use strict';

/**
 * [adjustRange description]
 * @param  {[type]} range
 * @return {[type]}
 */
function adjustRange(range) {
	range = range.cloneRange();

	// Expand range to encompass complete element if element's text
	// is completely selected by the range
	var container = range.commonAncestorContainer;

	// 元素类型	节点类型
	// 元素element	1
	// 属性attr	2
	// 文本text	3
	// 注释comments	8
	// 文档document	9
	var parentElement = container.nodeType == 3 ?
		container.parentNode : container;

	if (parentElement.textContent == range.toString()) {
		range.selectNode(parentElement);
	}

	return range;
}


/**
 * 获得选择的HTML。
 * <p> 支持多选。
 * @return {string} 选择的字符串。
 */
function getSelectionHtml() {
	var html = "",
		sel, range;
	if (typeof window.getSelection != "undefined") {
		sel = window.getSelection();
		if (sel.rangeCount) {
			var container = document.createElement("div");
			for (var i = 0, len = sel.rangeCount; i < len; ++i) {
				range = adjustRange(sel.getRangeAt(i));
				container.appendChild(range.cloneContents());
			}
			html = container.innerHTML;
		}
	} else if (typeof document.selection != "undefined") {
		if (document.selection.type == "Text") {
			html = document.selection.createRange().htmlText;
		}
	}
	return html;
}

/**
 * Copy the content to clipboard.
 *
 * @param  {[type]} copingText
 * @return {[type]}
 */
function copyToClipboard(copingText) {
	var copyAreaId = "af51b1bf6b5f4a41bad6e74616a716cc";
	var copyContainer = document.getElementById(copyAreaId);

	if (!copyContainer) {
		copyContainer = document.createElement("div");
		copyContainer.id = copyAreaId;

		//if you wan't to debug, just modify the css to make input visible.
		copyContainer.style.position = "absolute";
		copyContainer.style.top = 10;
		copyContainer.style.left = 10;
		copyContainer.style.zindex = 100;

		copyContainer.innerHTML = "<textarea cols='40' rows='20' value=''></textarea>";
	}

	document.body.appendChild(copyContainer);

	var input = copyContainer.querySelector("textarea");
	input.textContent = copingText;
	input.focus();
	input.select();

	document.execCommand("Cut", false, null);
}

// Listen for the content script to send a message to the background page.
chrome.runtime.onMessage.addListener(function onMessage(request, sender, sendResponse) {
	if(request.action !== 'html2markdown'){
		return;
	}
	
	// Get selected html.
	var html = getSelectionHtml();

	// convert html to markdown.
	var markdown = html2markdown(html);

	if (markdown) {
		// ask backgroud to write the markdown content to clipboard.
		chrome.runtime.sendMessage({
			action: "copytoclipboard",
			content: markdown,
		}, function(response) {
			// Return nothing to let the connection be cleaned up.
			if (response.success) {
				sendResponse({
					sucess: true
				});
				return;
			}
		});
	} else {
		sendResponse({
			sucess: true
		});
	}

	sendResponse({
		sucess: false
	});
});