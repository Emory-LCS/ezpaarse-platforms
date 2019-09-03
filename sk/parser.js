#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Sage Knowledge
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

  if (/^\/Data\/GetAllLists/i.test(path)) {
    // http://sk.sagepub.com:80/Data/GetAllLists
    result.rtype = 'SEARCH';
    result.mime = 'HTML';

  } else if ((match = /^\/(books|cqpress)\/([a-z-]+)$/i.exec(path)) !== null) {
    // http://sk.sagepub.com:80/books/accumulation-by-dispossession?fromsearch=true
    // http://sk.sagepub.com:80/books/globalization-and-indigenous-peoples-in-asia
    // http://sk.sagepub.com:80/cqpress/the-new-york-times-on-gay-and-lesbian-issues?fromsearch=true
    // http://sk.sagepub.com:80/cqpress/mercenaries-a-guide-to-private-armies-and-private-military-companies?fromsearch=true
    result.rtype = 'TOC';
    result.mime = 'HTML';
    result.unitid = match[2];
    result.title_id = match[2];

  } else if ((match = /^\/(reference|navigator)\/([a-z-]+)$/i.exec(path)) !== null) {
    // http://sk.sagepub.com:80/reference/globalstudies?fromsearch=true
    // http://sk.sagepub.com:80/reference/the-sage-handbook-of-globalization?fromsearch=true
    // http://sk.sagepub.com:80/reference/schoolchoice?fromsearch=true
    // http://sk.sagepub.com:80/navigator/international-business-and-globalization?fromsearch=true
    result.rtype = 'ABS';
    result.mime = 'HTML';
    result.unitid = match[2];
    result.title_id = match[2];

  } else if (/^\/Data\/GetSimilarContent/i.test(path)) {
    // http://sk.sagepub.com:80/Data/GetSimilarContent?doi=10.4135%2F9781452218557.n1&eIsbn=9781452218557   same result also http://sk.sagepub.com:80/reference/globalstudies/n1.xml (url of page)
    // http://sk.sagepub.com:80/Data/GetSimilarContent?doi=10.4135%2F9781452218557.n444&eIsbn=9781452218557
    // http://sk.sagepub.com:80/Data/GetSimilarContent?doi=10.4135%2F9781452218328.n1&eIsbn=9781452218328
    // http://sk.sagepub.com:80/Data/GetSimilarContent?doi=10.4135%2F9781608717545.n1&eIsbn=9781608717545
    // http://sk.sagepub.com:80/Data/GetSimilarContent?doi=10.4135%2F9781483340319.n6&eIsbn=9781483340319
    result.rtype = 'BOOK_SECTION';
    result.mime = 'HTML';
    result.unitid = param.doi.slice(8);
    result.title_id = param.eIsbn;
    result.print_identifier = param.eIsbn;
    result.doi = param.doi.slice(0, 21);

  } else if ((match = /^\/(reference|cqpress)\/download\/([0-z/.-]+)\.pdf$/i.exec(path)) !== null) {
  // http://sk.sagepub.com:80/reference/download/globalstudies/n444.pdf
  // http://sk.sagepub.com:80/reference/download/schoolchoice/n1.pdf
  // http://sk.sagepub.com:80/cqpress/download/mercenaries-a-guide-to-private-armies-and-private-military-companies/n6.i1.pdf
    result.rtype = 'BOOK_SECTION';
    result.mime = 'PDF';
    result.unitid = match[2];
    result.title_id = match[2];

  }
  return result;
});