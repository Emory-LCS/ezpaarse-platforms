#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Morgan and Claypool Publishers
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

  if ((/^\/action\/doSearch$/i.test(path)) || /^\/page\/browseLbS.jsp$/i.test(path)) {
    // https://www.morganclaypool.com:443/action/doSearch?AllField=spider&x=16&y=8&SeriesKey=
    // https://www.morganclaypool.com:443/page/browseLbS.jsp
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';

  } else if ((match = /^\/(author|loi|toc|page)\/(.*)$/i.exec(path)) !== null) {
    // https://www.morganclaypool.com:443/author/Cambazoglu%2C+B+Barla
    // https://www.morganclaypool.com:443/loi/icr
    // https://www.morganclaypool.com:443/toc/icr/9/6
    // https://www.morganclaypool.com:443/page/colloquium_one
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.unitid   = match[2];

  } else if ((match = /^\/doi\/(abs|pdf|pdfplus)\/([0-9.]+)\/([a-zA-Z0-9.]+)$/i.exec(path)) !== null) {
    result.unitid   = match[2] + '/' + match[3];
    result.doi      = match[2] + '/' + match[3];
    if (match[1] == 'abs') {
      // https://www.morganclaypool.com:443/doi/abs/10.2200/S00952ED1V01Y201909ICR069
      // https://www.morganclaypool.com:443/doi/abs/10.4199/C00038ED1V01Y201107DBR002
      result.rtype  = 'ABS';
      result.mime   = 'HTML';
    } else if (match[1] == 'pdf') {
      // https://www.morganclaypool.com:443/doi/pdf/10.2200/S00952ED1V01Y201909ICR069
      // https://www.morganclaypool.com:443/doi/pdf/10.4199/C00038ED1V01Y201107DBR002
      result.rtype  = 'ARTICLE';
      result.mime   = 'PDF';
    } else if (match[1] == 'pdfplus') {
      // https://www.morganclaypool.com:443/doi/pdfplus/10.2200/S00952ED1V01Y201909ICR069
      // https://www.morganclaypool.com:443/doi/pdfplus/10.4199/C00038ED1V01Y201107DBR002
      result.rtype  = 'ARTICLE';
      result.mime   = 'PDFPLUS';
    }

  }

  return result;
});
