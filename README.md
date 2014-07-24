Copy As Markdown
================

This is a Chrome Extension used to copy the element in current page as markdown format.

## Usage

You can select any element with html format in the current page and then click the extension icon, the relative text with markdown format will be written into the clipboard. When you select nothing in the page, the page's link will be written to the cliboard, the content is like this: `[window.title](location.href)`.

Also, you can custom the shortcut for the extension in Chrome's tab `chrome://extensions/`, suggested is `Ctrl+Shift+C`.

## Get it From WebStore

<https://chrome.google.com/webstore/detail/copy-as-markdown/dgoenpnkphkichnohepecnmpmihnabdg>

## Source

- https://github.com/JohnnyFee/CopyAsMarkdown

## Issue

- [x] Convert html to markdown.
- [x] Write the resutl(markdown) to clipboard.
- [x] When there is no selection range, copy title and location url.
- [x] Copy the `[title](url)` of the active page to clipboard.
- [x] Modify extension icon.
- [x] Set shortcut for the browser action.
- [x] Parse the relative url to full.
- [x] i18n. 
- [x] Beatify the href when no selection, such as remove the extra param `utm_*` in the link <http://www.michenux.net/android-around-me-tutorial-974.html?utm_source=Android+Weekly&utm_campaign=292d0789d2-Android_Weekly_88&utm_medium=email&utm_term=0_4eb677ad19-292d0789d2-337832837>. After that, the link will be <http://www.michenux.net/android-around-me-tutorial-974.html>.
- [x] test the url <http://flippinawesome.org/2014/03/24/using-media-queries-in-javascript/?utm_source=rss&utm_medium=rss&utm_campaign=using-media-queries-in-javascript>. —— modified and run rightly.
- [x] When copy more relative links, make url all links will be ok!
- [x] Make sure the relative link of images is right!
- [x] Add an option to the option to filter `|` in the page title. Simplly remove the content after `|`.
- [x] Convert table rightly.
- [x] Consider convert code in some nonstandard format. <http://blog.jobbole.com/67347/> —— Just support normal code converter.
- [x] 关于 ol 数字递增的处理。生成的所有有序项都是 "1." 正是 Markdown 的语法。
- [x] italic convertor. Like some html is converted to "_border-box_高", lacking of a space before 高。
- [ ] Modify the running time of content script to idle.
- [ ] add test spec.
- [ ] copy img to qiniu when turn on the related switcher.
- [ ] add option page for inline link or not.


## Reference

- [leeoniya/reMarked.js](https://github.com/leeoniya/reMarked.js)
- [rick-li / clipboardExt](https://github.com/rick-li/clipboardExt) Chrome extension to copy current title&url.
