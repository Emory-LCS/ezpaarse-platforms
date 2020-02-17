#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Art & Architecture ePortal
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

  if ((match = /^\/publications\/-([0-9]+)\/([a-z-]+)$/i.exec(path)) !== null) {
  // https://www.aaeportal.com:443/publications/-19552/mrs--delany-and-her-circle
  // https://www.aaeportal.com:443/publications/-19551/globalizing-impressionism--reception--translation--and-transnationalism
    result.rtype = 'TOC';
    result.mime = 'HTML';
    result.unitid = match[1] + '/' + match[2];
    result.title_id = match[1] + '/' + match[2];

  } else if ((match = /^\/images\/([0-9]+)\/([a-z-]+)/i.exec(path)) !==null) {
    // https://www.aaeportal.com:443/images/26465/white-blue
    // https://www.aaeportal.com:443/images/15716/savoy-vase-istanbul
    result.rtype = 'REF';
    result.mime = 'HTML';
    result.unitid = match[1] + '/' + match[2];
    result.title_id = match[1] + '/' + match[2];

  } else if (/^\//i.test(path)) {
    if (param.id && (param.searchterm || param.advancedsearch)) {
      // https://www.aaeportal.com:443/?id=-14027&template=template_quicksearch&searchterm=dorothy%20wilyman
      // https://www.aaeportal.com:443/?id=-14988&advancedsearch=true&pageno=1 
      result.rtype = 'SEARCH';
      result.mime = 'HTML';
    } else if (param.id && param.cid) {
      if (param.cid[0] === '-') {
        // https://www.aaeportal.com:443/?id=10408&cid=-13811 << lesson
        // https://www.aaeportal.com:443/?id=10559&cid=-13760
        result.rtype = 'ARTICLE';
        result.mime = 'HTML';
        result.unitid = param.id + '/' + param.cid;
        result.title_id = param.id + '/' + param.cid;
      } else if (param.id[0] === '-') {
        // https://www.aaeportal.com:443/?id=-15795&cid=28813 << publisher
        // https://www.aaeportal.com:443/?id=-15794&cid=44875 << author
        result.rtype = 'REF';
        result.mime = 'HTML';
        result.unitid = param.id + '/' + param.cid;
        result.title_id = param.id + '/' + param.cid;
      }
    }
    else if (param.id) {
      // https://www.aaeportal.com:443/?id=-16891
      // https://www.aaeportal.com:443/?id=-18378&fromsearch=true
      result.rtype = 'BOOK_SECTION';
      result.mime = 'HTML';
      result.unitid = param.id;
      result.title_id = param.id;
    }
  }
  return result;
});
