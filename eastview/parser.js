#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform East View
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  let param  = parsedUrl.query || {};
  let match;

  if ((match = /^\/browse\/book\/reader\/(([0-9]+)\/book.+)$/i.exec(path)) !== null) {
    // https://dlib.eastview.com/browse/book/reader/64626/book11_.swf?time=1483267719013
    // https://dlib.eastview.com/browse/book/reader/64626/book37_.swf?time=1483267719091
    // https://dlib.eastview.com/browse/book/reader/64626/book356_.swf?time=1483267720198
    result.rtype    = 'BOOK_SECTION';
    result.mime     = 'MISC';
    result.title_id = match[2];
    result.unitid   = `${match[1]}${parsedUrl.search || ''}`;

  } else if ((match = /^\/issue_images\/((.+)\/([0-9]+)\/(.+)\.jpg)$/i.exec(path)) !== null) {
    // https://dlib.eastview.com/issue_images/RUSEB2162959BO/1996/coverbig.jpg
    result.rtype    = 'IMAGE';
    result.mime     = 'JPEG';
    result.title_id = match[1];
    result.unitid   = match[2];

  } else if (/^\/wnc\/news$/i.test(path)) {
    // https://wnc.eastview.com:443/wnc/news
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';

  } else if (/^\/wnc\/article$/i.test(path)) {
    // https://wnc.eastview.com:443/wnc/article?id=38220718&backlink=/wnc/news
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.title_id = param.id;
    result.unitid   = param.id;

  } else if ((match = /^\/wnc\/simple\/(doc|articles)$/i.exec(path)) !== null) {
    // https://wnc.eastview.com:443/wnc/simple/doc?art=0&id=32464222
    // https://wnc.eastview.com:443/wnc/simple/doc?pager.offset=1
    // https://wnc.eastview.com:443/wnc/simple/articles?pager.offset=0
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.title_id = param.id;
    result.unitid   = param.id;

  }

  return result;
});
