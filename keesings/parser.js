#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Keesing's World News Archive
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  let param = parsedUrl.query || {};

  if (/^\/index_new.php$/i.test(path)) {
    if (param.page == 'advanced-search') {
      // http://www.keesings.com:80/index_new.php?page=advanced-search&search_for=potatoes
      result.rtype  = 'SEARCH';
      result.mime   = 'HTML';
    } else if (param.page == 'article') {
      // http://www.keesings.com:80/index_new.php?page=article&article=5289cee0&search=%22germany%22
      result.rtype  = 'ARTICLE';
      result.mime   = 'HTML';
      result.unitid = param.article;
    } else if (param.page == 'download-article') {
      // http://www.keesings.com:80/index_new.php?page=download-article&article=5289cee0
      result.rtype  = 'ARTICLE';
      result.mime   = 'PDF';
      result.unitid = param.article;
    } else if (param.page == 'print-article') {
      // http://www.keesings.com:80/index_new.php?page=print-article&article=5289cee0
      result.rtype  = 'ARTICLE';
      result.mime   = 'PDF';
      result.unitid = param.article;
    }
  }

  return result;
});
