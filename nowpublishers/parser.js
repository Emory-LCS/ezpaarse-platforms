#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Now Publishers
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

  if (/^\/search$/i.test(path)) {
    // https://www.nowpublishers.com:443/Search?q=brain&s2=Artificial%20Intelligence%20in%20Robotics
    result.rtype            = 'SEARCH';
    result.mime             = 'HTML';

  } else if (((match = /^\/([a-zA-Z0-9]+)$/i.exec(path)) !== null) || ((match = /^\/BookSeries\/Details\/([a-zA-Z0-9]+)$/i.exec(path)) !== null)) {
    // https://www.nowpublishers.com:443/ASTP?vol=2
    // https://www.nowpublishers.com:443/FnTs
    // https://www.nowpublishers.com:443/BookSeries/Details/CBSB
    result.rtype     = 'TOC';
    result.mime      = 'HTML';
    result.unitid   = match[1];

  } else if ((match = /^\/article\/(Details|Download|DownloadSummary|BookDetails|DownloadEBook)\/([a-zA-Z0-9_-]+)$/i.exec(path)) !== null) {
    result.unitid  = match[2];
    if (match[1] == 'Details') {
      // https://www.nowpublishers.com:443/article/Details/MAL-071
      result.rtype      = 'ABS';
      result.mime       = 'HTML';
    } else if (match[1] == 'Download') {
      // https://www.nowpublishers.com:443/article/Download/MAL-071
      result.rtype      = 'ARTICLE';
      result.mime       = 'PDF';
    } else if (match[1] == 'DownloadSummary') {
      // https://www.nowpublishers.com:443/article/DownloadSummary/MAL-071
      result.rtype      = 'ARTICLE';
      result.mime       = 'PDF';
    } else if (match[1] == 'BookDetails') {
      // https://www.nowpublishers.com:443/article/BookDetails/9781680834864
      result.rtype      = 'ABS';
      result.mime       = 'HTML';
      result.print_identifier = match[2];
    } else if (match[1] == 'DownloadEBook') {
      if (param.format  == 'pdf') {
        // https://www.nowpublishers.com:443/article/DownloadEBook/9781680834864?format=pdf
        result.rtype    = 'BOOK';
        result.mime     = 'PDF';
        result.print_identifier = match[2];
      } else if (param.format == 'epub') {
        // https://www.nowpublishers.com:443/article/DownloadEBook/9781680834864?format=epub
        result.rtype    = 'BOOK';
        result.mime     = 'MISC';
        result.print_identifier = match[2];
      }
    }
  }

  return result;
});
