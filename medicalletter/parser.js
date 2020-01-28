#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform The Medical Letter
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

  if (/^\/(solrsearch|most-read)$/i.test(path)) {
    // https://secure.medicalletter.org:443/solrsearch?query=brain&x=21&y=8
    // https://secure.medicalletter.org:443/most-read
    result.rtype    = 'SEARCH';
    result.mime     = 'MISC';

  } else if (((match = /^\/archives-(tml|tgl)$/i.exec(path)) !== null) || ((match = /^\/([A-Z]+)([0-9]+)([A-Z]+)$/i.exec(path)) !== null)) {
    // https://secure.medicalletter.org:443/archives-tml?y=2014
    // https://secure.medicalletter.org:443/archives-tgl?y=2014
    // https://secure.medicalletter.org:443/TML2020FR
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.unitid   = param.y || match[1] + match[2] + match[3];

  } else if ((match = /^\/([A-Z]+)-([a-z]+)-([a-zA-Z0-9]+)$/i.exec(path)) !== null) {
    // https://secure.medicalletter.org:443/TML-issue-1589
    // https://secure.medicalletter.org:443/TML-article-1542b
    // https://secure.medicalletter.org:443/TG-article-138a
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.unitid   = match[1] + '-' + match[2] + '-' + match[3];

  } else if ((match = /^\/downloads\/([a-zA-Z0-9_]+).pdf$/i.exec(path)) !== null) {
    // https://secure.medicalletter.org:443/downloads/1546b_table.pdf
    result.rtype    = 'SUPPL';
    result.mime     = 'PDF';
    result.unitid   = match[1];

  } else if ((match = /^\/system\/files\/private\/([A-Z]+)-([a-z]+)-([a-zA-Z0-9]+).pdf$/i.exec(path)) !== null) {
    // https://secure.medicalletter.org:443/system/files/private/TML-issue-1589.pdf
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.unitid   = match[1] + '-' + match[2] + '-' + match[3];

  }

  return result;
});
