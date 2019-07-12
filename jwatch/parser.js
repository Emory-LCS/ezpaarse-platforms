#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform NEJM Journal Watch
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  // uncomment this line if you need parameters
  let param = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  let match;

  if (/^\/(search\/advanced)|([a-z-]+$)/i.test(path)) {
    // https://www.jwatch.org:443/search/advanced?fulltext=electricity&hits=20&page=1
    // https://www.jwatch.org:443/search/advanced?fulltext=podcast&hits=20&page=1
    // https://www.jwatch.org:443/cardiology
    // https://www.jwatch.org:443/depression-anxiety
    // https://www.jwatch.org:443/clinical-spotlight
    result.rtype = 'SEARCH';
    result.mime = 'HTML';

  } if ((match = /^\/([a-z-]+)\//i.exec(path)) !== null) {
    // https://blogs.jwatch.org:443/hiv-id-observations/?_ga=2.172113696.243381463.1562588137-26633474.1562161140
    if (match[1] !== 'search') {
      result.rtype = 'TOC';
      result.mime = 'HTML';
      result.unitid = param._ga;
      result.title_id = match[1];
    }
  }

  return result;
});
