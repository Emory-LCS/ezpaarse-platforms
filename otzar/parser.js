#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Otzar
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  let param = parsedUrl.query || {};

  let match;

  if (/^\/pages\/search.php$/i.test(path)) {
    // https://tablet.otzar.org:443/pages/search.php
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';

  } else if ((match = /^\/booklists\/([a-zA-Z0-9]+).(PDF|xlsx)$/i.exec(path)) !== null) {
    result.rtype    = 'TOC';
    result.unitid   = 'booklists/' + match[1];
    if (match[2] == 'PDF') {
      // http://www.otzar.org:80/booklists/shlomo.PDF
      result.mime   = 'PDF';
    } else if (match[2] == 'xlsx') {
      // http://www.otzar.org:80/booklists/shlomo.xlsx
      result.mime   = 'MISC';
    }

  } else if ((match = /^\/internetsite\/([0-9]+)\/([a-zA-Z0-9]+).pdf$/i.exec(path)) !== null) {
    // http://www.otzar.org:80/internetsite/18/booklist.pdf
    result.rtype    = 'TOC';
    result.mime     = 'PDF';
    result.unitid   = match[1] + '/' + match[2];

  } else if ((match = /^\/book\/getimg.php$/i.exec(path)) !== null) {
    // https://tablet.otzar.org:443/book/getimg.php?width=824&book=62722&page=2
    result.rtype    = 'BOOK_SECTION';
    result.mime     = 'HTML';
    result.unitid   = param.book + '-page' + param.page;

  }

  return result;
});
