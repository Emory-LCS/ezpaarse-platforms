#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Journal of Food Protection
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

  if ((/^\/keyword\/([a-zA-Z0-9]+)$/i.test(path)) || (/^\/action\/doSearch$/i.test(path))) {
    // https://jfoodprotection.org:443/keyword/Bioaccumulation
    // https://jfoodprotection.org:443/action/doSearch?AllField=potato
    result.rtype    = 'SEARCH';
    result.mime     = 'MISC';

  } else if (((match = /^\/(loi|toc)\/food$/i.exec(path)) !==null) || ((match = /^\/(loi|toc)\/food\/([a-zA-Z0-9/]+)$/i.exec(path)) !== null)) {
    // https://jfoodprotection.org:443/toc/food/83/1
    // https://jfoodprotection.org:443/toc/food/12
    // https://jfoodprotection.org:443/loi/food
    // https://jfoodprotection.org:443/loi/food/83/1
    // https://jfoodprotection.org:443/loi/food/12
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.unitid   = match[2];

  } else if ((match = /^\/doi\/(abs|full|pdf)\/([a-zA-Z0-9.-]+)\/([a-zA-Z0-9.-]+)$/i.exec(path)) !== null) {
    // https://jfoodprotection.org:443/doi/(abs|full|pdf)/10.4315/0362-028X.JFP-19-318
    result.doi      = match[2] + '/' + match[3];
    result.unitid   = match[2] + '/' + match[3];
    if (match[1] == 'abs') {
      result.rtype    = 'ABS';
      result.mime     = 'HTML';
    } else if (match[1] == 'full') {
      result.rtype    = 'ARTICLE';
      result.mime     = 'HTML';
    } else if (match[1] == 'pdf') {
      result.rtype    = 'ARTICLE';
      result.mime     = 'PDF';
    }

  } else if (/^\/action\/showCitFormats$/i.test(path)) {
    // https://jfoodprotection.org:443/action/showCitFormats?doi=10.4315%2F0362-028X.JFP-19-318
    result.rtype    = 'CITATION';
    result.mime     = 'HTML';
    result.doi      = param.doi;
    result.unitid   = param.doi;

  }

  return result;
});
