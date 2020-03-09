#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Open Book Publishers
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

  if ((match = /^\/section/i.exec(path)) !== null) {
    // https://www.openbookpublishers.com:443/section/29/1
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';

  } else if ((match = /^\/product\/([0-9-]+)$/i.exec(path)) !== null) {
    // https://www.openbookpublishers.com:443/product/1108
    result.rtype    = 'ABS';
    result.mime     = 'HTML';
    result.unitid   = match[1];

  } else if ((match = /^\/htmlreader\/([0-9-]+)\/([a-zA-Z0-9-]+).(xhtml|html)$/i.exec(path)) !== null) {
    // https://www.openbookpublishers.com:443/htmlreader/978-1-78374-137-3/intro.xhtml
    // https://www.openbookpublishers.com:443/htmlreader/978-1-78374-137-3/ch01.xhtml
    result.rtype    = 'BOOK_SECTION';
    result.mime     = 'HTML';
    result.print_identifier = match[1];
    result.unitid   = match[1] + '/' + match[2];

  } else if ((match = /^\/reader\/([0-9-]+)$/i.exec(path)) !== null) {
    // https://www.openbookpublishers.com:443/reader/340
    result.rtype    = 'BOOK_SECTION';
    result.mime     = 'PDF';
    result.unitid   = match[1];

  } else if ((match = /^\/([0-9.-]+)\/([a-zA-Z0-9.-]+).pdf$/i.exec(path)) !== null) {
    // https://www.openbookpublishers.com:443/10.11647/obp.0192.01.pdf
    result.rtype    = 'BOOK_SECTION';
    result.mime     = 'PDF';
    result.unitid   = match[1] + '/' + match[2];
    result.doi      = match[1] + '/' + match[2];

  }

  return result;
});
