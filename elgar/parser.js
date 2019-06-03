#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Elgaronline
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  // let param = parsedUrl.query || {};
  // console.error(parsedUrl);

  let match;

  if (/^\/browse$/i.test(path)) {
    // https://www.elgaronline.com:443/browse?pageSize=10&level=parent&sort=datedescending&t0=Economics_Main_ID
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  } else if (/^\/search$/i.test(path)) {
    // https://www.elgaronline.com:443/search?type_0=series&f_0=series&q_0=Leuven%20Global%20Governance%20series
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  } else if ((match = /^\/abstract\/([0-9]+).xml$/i.exec(path)) !== null) {
    // https://www.elgaronline.com:443/abstract/9780857933881.xml?rskey=ZoQNp7&result=2
    result.rtype    = 'ABS';
    result.mime     = 'XML';
    result.title_id = match[1];
    result.unitid   = match[1];
    result.print_identifier = match[1];
    result.doi      = '10.4337/' + match[1];
  } else if ((match = /^\/abstract\/journals\/([a-zA-Z0-9_/-]+)\/([a-zA-Z0-9.-]+).xml$/i.exec(path)) !== null) {
    // https://www.elgaronline.com:443/abstract/journals/roke/5-4/roke.2017.04.01.xml
    result.rtype    = 'ABS';
    result.mime     = 'XML';
    result.title_id = match[1];
    result.unitid   = match[2];
  } else if ((match = /^\/abstract\/Research_Reviews\/([a-zA-Z0-9_/-]+)\/([a-zA-Z0-9.-]+).xml$/i.exec(path)) !== null) {
    // https://www.elgaronline.com:443/abstract/Research_Reviews/9781786438904/9781786438904.xml?rskey=2VKG4N&result=1
    result.rtype    = 'ABS';
    result.mime     = 'XML';
    result.title_id = match[1];
    result.unitid   = match[2];
    result.print_identifier = match[2];
    result.doi      = '10.4337/' + match[2];
  } else if ((match = /^\/view\/journals\/([a-zA-Z0-9_/-]+)\/([a-zA-Z0-9.-]+).xml$/i.exec(path)) !== null) {
    // https://www.elgaronline.com:443/view/journals/roke/5-4/roke.2017.5.issue-4.xml
    result.rtype    = 'TOC';
    result.mime     = 'XML';
    result.title_id = match[1];
    result.unitid   = match[2];
  } else if ((match = /^\/view\/([a-zA-Z0-9_/-]+)\/([a-zA-Z0-9-]+).xml$/i.exec(path)) !== null) {
    // https://www.elgaronline.com:443/view/Research_Reviews/9781785367441/9781785367441.xml?rskey=nKQwJP&result=1
    result.rtype    = 'ARTICLE';
    result.mime     = 'XML';
    result.title_id = match[2];
    result.unitid   = match[2];
    result.print_identifier = match[2];
    result.doi      = '10.4337/' + match[2];
  } else if ((match = /^\/view\/nlm-book\/([0-9]+)\/([a-zA-Z0-9_-]+).xml$/i.exec(path)) !== null) {
    // https://www.elgaronline.com:443/view/nlm-book/9781849807777/c04_sec85.xml?rskey=qoQRWS&result=1
    result.rtype    = 'BOOK_SECTION';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[2];
    result.print_identifier = match[1];
    result.doi      = '10.4337/' + match[1];
  } else if ((match = /^\/view\/([0-9]+).([0-9]+).xml$/i.exec(path)) !== null) {
    // https://www.elgaronline.com:443/view/9781784711450.00017.xml?rskey=Ye4whX&result=5
    result.rtype    = 'BOOK_SECTION';
    result.mime     = 'XML';
    result.title_id = match[1];
    result.unitid   = match[1].concat('.', match[2]);
    result.print_identifier = match[1];
    result.doi      = '10.4337/' + match[1];
  } else if ((match = /^\/view\/([a-zA-Z0-9_/-]+)\/([0-9]+).([0-9]+).xml$/i.exec(path)) !== null) {
    // https://www.elgaronline.com:443/view/edcoll/9781786439307/9781786439307.00019.xml?rskey=tBrprM&result=1
    result.rtype    = 'BOOK_SECTION';
    result.mime     = 'XML';
    result.title_id = match[2];
    result.unitid   = match[2].concat('.', match[3]);
    result.print_identifier = match[2];
    result.doi      = '10.4337/' + match[2];
  } else if ((match = /^\/downloadpdf\/([0-9]+).([0-9]+).pdf$/i.exec(path)) !== null) {
    // https://www.elgaronline.com:443/downloadpdf/9781784711450.00014.pdf
    result.rtype    = 'BOOK_SECTION';
    result.mime     = 'PDF';
    result.title_id = match[1];
    result.unitid   = match[1].concat('.', match[2]);
    result.print_identifier = match[1];
    result.doi      = '10.4337/' + match[1];
  } else if ((match = /^\/downloadpdf\/([a-zA-Z0-9_/-]+)\/([0-9]+).([0-9]+).pdf$/i.exec(path)) !== null) {
    // https://www.elgaronline.com:443/downloadpdf/edcoll/9781786439307/9781786439307.00019.pdf
    result.rtype    = 'BOOK_SECTION';
    result.mime     = 'PDF';
    result.title_id = match[2];
    result.print_identifier = match[2];
    result.doi      = '10.4337/' + match[2];
    result.unitid   = match[2].concat('.', match[3]);
  }
  return result;
});
