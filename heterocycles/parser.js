#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Heterocycles
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;

  let match;

  if ((match = /^\/newlibrary\/libraries\/fulltext\/(.*)$/i.exec(path)) !== null) {
    // https://www.heterocycles.jp:443/newlibrary/libraries/fulltext/24480/91/9
    result.rtype  = 'ARTICLE';
    result.mime   = 'HTML';
    result.unitid = match[1];

  } else if ((match = /^\/newlibrary\/libraries\/(prepress|journal|mostcited)(.*)$/i.exec(path)) !== null) {
    // https://www.heterocycles.jp:443/newlibrary/libraries/prepress
    // https://www.heterocycles.jp:443/newlibrary/libraries/prepress/regular
    // https://www.heterocycles.jp:443/newlibrary/libraries/journal/98/12/current
    // https://www.heterocycles.jp:443/newlibrary/libraries/journal/36/9
    // https://www.heterocycles.jp:443/newlibrary/libraries/mostcited
    result.rtype  = 'TOC';
    result.mime   = 'HTML';
    result.unitid = match[1] + match[2];

  } else if ((match = /^\/newlibrary\/(special(.*))/i.exec(path)) !== null) {
    // https://www.heterocycles.jp:443/newlibrary/special
    result.rtype  = 'TOC';
    result.mime   = 'HTML';
    result.unitid = match[1];

  } else if ((match = /^\/newlibrary\/downloads\/(PDFwithLinks|PDFsi|PDF)\/(.*)$/i.exec(path)) !== null) {
    result.mime   = 'PDF';
    result.unitid = match[2];
    if ((match[1] == 'PDF') || (match[1] == 'PDFwithLinks')) {
      result.rtype  = 'ARTICLE';
    } else if (match[1] == 'PDFsi') {
      result.rtype  = 'SUPPL';
    }

  } else if (((match = /^\/newlibrary\/natural_products\/(.*)$/i.exec(path)) !== null) || ((match = /^\/newlibrary\/(brushups(.*))/i.exec(path)) !== null)) {
    // https://www.heterocycles.jp:443/newlibrary/natural_products/structure
    // https://www.heterocycles.jp:443/newlibrary/natural_products/structure/group/Alkaloids
    // https://www.heterocycles.jp:443/newlibrary/natural_products/structure/journal/OrgBiomolChem
    // https://www.heterocycles.jp:443/newlibrary/natural_products/synthesis
    result.rtype  = 'ENCYCLOPAEDIA_ENTRY';
    result.mime   = 'HTML';
    result.unitid = match[1];

  } else if ((match = /^\/platform\/path\/to\/(document-([0-9]+)-test\.html)$/i.exec(path)) !== null) {
    // http://parser.skeleton.js/platform/path/to/document-123456-test.html?sequence=1
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[2];
  }

  return result;
});
