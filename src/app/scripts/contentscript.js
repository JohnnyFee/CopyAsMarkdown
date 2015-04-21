/*
 * Copy As Markdown.
 *
 * User: Johnny Fee
 * Date: 2014-01-29
 * Time: 23:41:10
 * Contact: djohnnyfee@gmail.com
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
   *
   * @return {string} 选择的字符串。
   */
  var getSelectionHtml = function () {
    return rangy.getSelection().toHtml();
  };

  var reMarker = new reMarked({
    /*jshint camelcase: false */
    h1_setext: false, // underline h1 headers
    h2_setext: false, // underline h2 headers
    nbsp_spc:   true,    // convert &nbsp; entities in html to regular spaces
    span_tags:  false,     // output spans (ambiguous) using html tags
    div_tags:   false     // output divs (ambiguous) using html tags

  });

  // Listen for the content script to send a message to the background page.
  chrome.runtime.onMessage.addListener(function onMessage(request, sender, sendResponse) {
    if (request.action !== 'html2markdown') {
      return;
    }

    // Get selected html.
    var htmlContent = getSelectionHtml();

    var markdown;

    if (htmlContent) {
      markdown = reMarker.render(htmlContent);
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
