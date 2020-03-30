#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform On the Boards
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  // let param = parsedUrl.query || {};

  let match;

  if (/^\/search\/node(.*)$/i.test(path)) {
    // https://www.ontheboards.tv:443/search/node/jean%20lee
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';

  } else if ((match = /^\/(artist|artists|performances|performance|dance|words)\/(.*)$/i.exec(path)) !== null) {
    result.unitid   = match[2];
    if (match[1] == 'artists') {
      // https://www.ontheboards.tv:443/artists/ralph-lemon
      result.rtype    = 'TOC';
      result.mime     = 'HTML';
    } else if ((match[1] == 'performances') || (match[1] == 'performance') || (match[1] == 'dance')) {
      // https://www.ontheboards.tv:443/performances/its-not-too-late
      result.rtype    = 'VIDEO';
      result.mime     = 'MISC';
    } else if (match[1] == 'words') {
      // https://www.ontheboards.tv:443/words/training-the-anti-spectacular-for-ralph-lemons-dance-that-disappears
      result.rtype    = 'ARTICLE';
      result.mime     = 'HTML';
    }

  } else if ((match = /^\/sites\/default\/files\/([a-z]+)\/pdf\/(.*).pdf$/i.exec(path)) !== null) {
    // https://www.ontheboards.tv:443/sites/default/files/duke/pdf/La%20Rocco_Lemon%20edition_final.pdf
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.unitid   = match[2];

  }

  return result;
});
