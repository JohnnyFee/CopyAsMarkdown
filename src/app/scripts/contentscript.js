/*
 * Created with Sublime Text 2.
 * User: song.chen
 * Date: 2014-01-29
 * Time: 23:41:10
 * Contact: song.chen@qunar.com
 */


(function () {
  'use strict';

  String.prototype.endsWith = function (suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
  };

  /**
   * Simplify the url.
   *
   * @param  {String} url
   * @return {String}
   */
  var simplifyUrl = function (url) {
    if (!url) {
      return '';
    }

    url = url.replace(/&?utm_\w+(=[^&]+)/g, '');
    if (url.endsWith('/?')) {
      url = url.substring(0, url.length - 2);
    } else if (url.endsWith('?')) {
      url = url.substring(0, url.length - 1);
    }
    return url;
  };

  var simplifyTitle = function (title) {
    if (!title) {
      return;
    }

    return title.replace(/\s*\|.*/g, '');
  };

  /**
   * 获得选择的HTML。
   * <p> 支持多选。
   * @return {string} 选择的字符串。
   */
  var getSelectionHtml = function () {
    return rangy.getSelection().toHtml();
  };

  /*jshint camelcase: false */
  var reMarker = new reMarked({
    h1_setext: false, // underline h1 headers
    h2_setext: false // underline h2 headers
  });

  // Listen for the content script to send a message to the background page.
  chrome.runtime.onMessage.addListener(function onMessage(request, sender, sendResponse) {
    if (request.action !== 'html2markdown') {
      return;
    }

    // Get selected html.
    var html = getSelectionHtml();

    var markdown;

    // no selection
    if (html && html.innerHTML) {
      markdown = reMarker.render(html.innerHTML);
    } else {
      markdown = '[' + simplifyTitle(document.title) + '](' + simplifyUrl(location.href) + ')';
    }

    // ask backgroud to write the markdown content to clipboard.
    chrome.runtime.sendMessage({
      action: 'copytoclipboard',
      content: markdown
    }, function (response) {
      if (response.success) {
        sendResponse({
          sucess: true
        });
        return;
      }
    });

    sendResponse({
      sucess: true
    });
  });
}());
