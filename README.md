Copy As Markdown
================

This is a Chrome Extension used to copy the element in current page as markdown format.

##Usage

You can select some element with html format in the current page and then click the extension icon, the relative text with markdown format will be written into the clipboard. You can paste is to your article or anywhere else you like. When you select nothing in the page, the page's link will be written to the cliboard, the content is like this: `[window.title](location.href)`.

Except clicking the extension icon, there is another easy way to do the same action with a shortcut: **Command+Shift+C** on Mac or **Ctrl+Shift+C** on Other OS. When the default command conflit with yours, you can change it in the Chrome's tab `chrome://extensions/`.

##Issue
- [x] Convert html to markdown.
- [x] Write the resutl(markdown) to clipboard.
- [ ] When there is no selection range, copy title and location url.
- [x] Copy the `[title](url)` of the active page to clipboard.
- add option page for inline link or not.
- [x] Modify extension icon.
- [ ] Set shortcut for the browser action.
- [x] Parse the relative url to full.
- [ ] i18n. 

## Reference

- [kates / html2markdown](https://github.com/kates/html2markdown) Javascript implementation for converting HTML to Markdown text. Browser and Node.js support.
- [evilstreak / markdown-js](https://github.com/evilstreak/markdown-js) 提供Markdown转化为HTML的方法。
- [adam-p / markdown-here](https://github.com/adam-p/markdown-here) Google Chrome, Firefox, and Thunderbird extension that lets you write email in Markdown and render it before sending. 
- [domchristie / to-markdown](https://github.com/domchristie/to-markdown) An HTML to Markdown converter written in javascript 
<http://domchristie.github.com/to-markdown>.
- [rick-li / clipboardExt](https://github.com/rick-li/clipboardExt) Chrome extension to copy current title&url.
