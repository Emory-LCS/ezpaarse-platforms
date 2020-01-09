#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Hispanic American Periodicals Index
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

  if (/^\/search/i.test(path)) {
    // http://hapi.ucla.edu:80/search/
    // http://hapi.ucla.edu:80/search/advanced
    result.rtype    = 'SEARCH';
    result.mime     = 'MISC';

  } else if ((match = /^\/article\/citation\/([0-9]+)$/i.exec(path)) !== null) {
    // http://hapi.ucla.edu:80/article/citation/348313
    result.rtype    = 'CITATION';
    result.mime     = 'HTML';
    result.unitid   = match[1];

  }

  return result;
});
