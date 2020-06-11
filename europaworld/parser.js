#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Europa World Online
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  // let param = parsedUrl.query || {};

  // We did not parse searches because each search shows two or three times in the logs and would result in too many false positives.

  let match;

  if ((match = /^\/([a-zA-Z0-9]+)$/i.exec(path)) !== null) {
    // https://www.europaworld.com:443/countries
    // https://www.europaworld.com:443/regions
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.unitid   = match[1];

  } else if ((match = /^\/entry\/([a-zA-Z0-9_.-]+)$/i.exec(path)) !== null) {
    // https://www.europaworld.com:443/entry/io-un.1943?ssid=668831424&hit=7
    // https://www.europaworld.com:443/entry/kw
    // https://www.europaworld.com:443/entry/men.essay.5
    // https://www.europaworld.com:443/entry/mena.mc
    // https://www.europaworld.com:443/entry/un_otherorgs.wto.1
    result.rtype    = 'ENCYCLOPAEDIA_ENTRY';
    result.mime     = 'HTML';
    result.unitid   = match[1];

  }

  return result;
});
