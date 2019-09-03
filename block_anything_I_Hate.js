// ==UserScript==
// @name         block
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://d7vg.com/*
// @match        https://*.bilibili.com/*
// @match        https://*.gcores.com/*

// @grant        none
// ==/UserScript==

(function () {
  const block = () => {
    let blockKeyWordList = [
      'iPhone',
      'IPhone',
      'iphone',
      '苹果',
      'iOS',
      '\\bios',
      'IOS',
      '任天堂',
      '\\bns',
      '\\bNS',
      'Switch',
      '今敏',
      '\\bHolowka',
    ]
    let reg = new RegExp(`^[^<]*(${blockKeyWordList.join('|')})`);
    let deleteList = [];
    [].filter.call(document.body.querySelectorAll('*'), v => v.innerHTML.length < 1000 && v.innerHTML.replace(/<.*?>.*?<.*?>/g, '').match(reg) && v.innerText.match(reg)).forEach(v => {
      let resultList = []
      let finished = false;
      let traversal = (node) => {
        let prev = node.previousElementSibling;
        let next = node.nextElementSibling;
        if (
            (prev || next) &&
            (!prev || (prev.tagName === node.tagName && prev.className === node.className)) &&
            (!next || (next.tagName === node.tagName && next.className === node.className))
            ||
            (prev && next) &&
            (next.tagName === node.tagName && prev.tagName === node.tagName) &&
            (next.className === node.className || prev.className === node.className)
        ) {
          deleteList.push(node)
          finished = true;
        } else {
          resultList.push(node)
          node.parentNode && traversal(node.parentNode, node)
        }
        if (!finished) {
          let count = resultList.length;
          let maxId = 0;
          for (let i = 0; i < count - 3; i++) {
            if (resultList[i].childElementCount > resultList[maxId].childElementCount) { maxId = i; }
          }
          deleteList.push(resultList[maxId - 1] || resultList[maxId])
        }
      }
      traversal(v)
    })
    deleteList.forEach(v => v.remove());
  }
  block();
  setTimeout(() => {
    block()
  }, 500);
})();
