#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Bloomsbury Drama Online
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;

  let match;

  if ((match = /^\/(.*)search$/i.exec(path)) !== null) {
    // https://www.dramaonlinelibrary.com:443/search?q=Macbeth
    // https://www.dramaonlinelibrary.com:443/books/macbeth-iid-115609/do-9781408160244-div-00000001/search?term=macbeth
    result.rtype    = 'SEARCH';
    result.mime     = 'MISC';

  } else if ((match = /^\/([a-zA-Z0-9]+)$/i.exec(path)) !== null) {
    // https://www.dramaonlinelibrary.com:443/plays
    // https://www.dramaonlinelibrary.com:443/series
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.unitid   = match[1];

  } else if ((match = /^\/([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_-]+)$/i.exec(path)) !== null) {
    if ((match[1]  == 'books') || (match[1] == 'plays')) {
      // https://www.dramaonlinelibrary.com:443/plays/6-essential-questions-iid-166608
      // https://www.dramaonlinelibrary.com:443/plays/hamlet-rsc-iid-179641
      result.rtype   = 'ABS';
      result.mime    = 'HTML';
      result.unitid  = match[2];
    } else {
      // https://www.dramaonlinelibrary.com:443/series/playwrights-canada-press-iid-162957
      // https://www.dramaonlinelibrary.com:443/genres/irish-drama-iid-2530
      result.rtype   = 'TOC';
      result.mime    = 'HTML';
      result.unitid  = match[2];
    }

  } else if ((match = /^\/(books|plays)\/([a-zA-Z0-9_-]+)\/do-([a-zA-Z0-9]+)-div-([0-zA-Z-9]+)$/i.exec(path)) !== null) {
    // https://www.dramaonlinelibrary.com:443/books/macbeth-iid-115609/do-9781408160244-div-00000002
    // https://www.dramaonlinelibrary.com:443/plays/afterplay-iid-19186/do-9780571339853-div-00000018
    result.rtype            = 'BOOK_SECTION';
    result.mime             = 'HTML';
    result.print_identifier = match[3];
    result.unitid           = match[2] + '/do-' + match[3] + '-div-' + match[4];

  }

  return result;
});
