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
 * Simplify the url.
 *
 * <p> Sometimes, when a url is redirected by some special site such as InoReader, some parameters will be appended to it's query string.
 *
 * Such as a link `http://www.michenux.net/android-around-me-tutorial-974.html?utm_source=Android+Weekly&utm_campaign=292d0789d2-Android_Weekly_88&utm_medium=email&utm_term=0_4eb677ad19-292d0789d2-337832837` should be simplify to `http://www.michenux.net/android-around-me-tutorial-974.html`.
 *
 * @param  {[type]} url
 * @param {[type]} excludes 要排除的查询字符串前缀。
 * @return {[type]}
 */
function simplifyUrl(url, excludes) {
	// TODO;
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

			// travel link to modify the relative url to absolute url.
			var links = container.querySelectorAll("a");
			for (var i = 0; i < links.length; i++) {
				links[i].setAttribute("href", links[0].href);
			};

			html = container.innerHTML;
		}
	} else if (typeof document.selection != "undefined") {
		if (document.selection.type == "Text") {
			html = document.selection.createRange().htmlText;
		}
	}
	return html;
}

// Listen for the content script to send a message to the background page.
chrome.runtime.onMessage.addListener(function onMessage(request, sender, sendResponse) {
	if (request.action !== 'html2markdown') {
		return;
	}

	// Get selected html.
	var html = getSelectionHtml();

	// convert html to markdown.
	var markdown = html2markdown(html, {
		inlineStyle: true
	});

	if (!html) {
		markdown = '[' + document.title + '](' + location.href + ')';
	}

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