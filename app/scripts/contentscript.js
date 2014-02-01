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



// Listen for the content script to send a message to the background page.
chrome.runtime.onMessage.addListener(function onMessage(message, sender, sendResponse) {
	// Get selected html.
	var html = getSelectionHtml();

	// convert html to markdown.
	var markdown = html2markdown(html);

	// write the markdown content to clipboard.
	// TODO 
	alert(markdown);

	// Return nothing to let the connection be cleaned up.
	sendResponse({
	});

});