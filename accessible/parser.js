#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Accessible Archives Complete
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  let param = parsedUrl.query || {};

  // console.error(parsedUrl);

  let match;

  if ((/^\/accessible\/search$/i.test(path)) || (/^\/collections/i.test(path))) {
    // https://www.accessible.com:443/accessible/search?[payload]
    // https://www.accessible-archives.com:443/collections/
    // https://www.accessible-archives.com:443/collections/african-american-newspapers/frederick-douglass-paper/
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';

  } else if ((match = /^\/([0-9-]+)\/([0-9-]+)\/([a-zA-Z0-9-]+)\/$/i.exec(path)) !== null) {
    // https://www.accessible-archives.com:443/2020/04/womens-history-womans-tribune-1883-1909/
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.title_id = match[1] + '/' + match[2] + '/' + match[3];
    result.unitid   = match[1] + '/' + match[2] + '/' + match[3];

  } else if (/^\/accessible\/docButton$/i.test(path)) {
    if (param.AANextPage == '/printBuiltTocPage.jsp') {
      // https://www.accessible.com:443/accessible/docButton?AAWhat=builtPageIssueToc&AAWhere=GODEYSLADYSBOOK.18560100&AABeanName=toc1&AACheck=2.2050.2.0.0&AANextPage=/printBuiltTocPage.jsp
      // https://www.accessible.com:443/accessible/docButton?AAWhat=builtPageIssueToc&AAWhere=THENATIONALERA.18490419&AABeanName=toc1&AACheck=2.200.15.0.0&AANextPage=/printBuiltTocPage.jsp
      result.rtype    = 'TOC';
      result.mime     = 'HTML';
      result.title_id = param.AAWhere;
      result.unitid   = param.AAWhere;
    } else if (param.AANextPage == '/printBuiltImagePage.jsp') {
      // https://www.accessible.com:443/accessible/docButton?AAWhat=builtPageIssueToc&AAWhere=GODEYSLADYSBOOK.18560100&AABeanName=toc1&AACheck=2.2050.2.0.0&AANextPage=/printBuiltTocPage.jsp
      // https://www.accessible.com:443/accessible/docButton?AAWhat=builtPageIssueToc&AAWhere=THENATIONALERA.18490419&AABeanName=toc1&AACheck=2.200.15.0.0&AANextPage=/printBuiltTocPage.jsp
      result.rtype    = 'IMAGE';
      result.mime     = 'MISC';
      result.title_id = param.AAWhere;
      result.unitid   = param.AAWhere;
    } else if (param.AANextPage == '/printBuiltPage.jsp') {
      // https://www.accessible.com:443/accessible/docButton?AAWhat=builtPage&AAWhere=THENATIONALERA.FR1849041918.18173&AABeanName=toc1&AACheck=2.200.15.0.0&AANextPage=/printBuiltPage.jsp
      result.rtype    = 'ARTICLE';
      result.mime     = 'HTML';
      result.title_id = param.AAWhere;
      result.unitid   = param.AAWhere;
    } else if (param.AANextPage == '/printerFriendlyDoc.jsp') {
      // https://www.accessible.com:443/accessible/docButton?AAWhat=gotoJSP&AAWhere=2&AABeanName=toc1&AANextPage=/printerFriendlyDoc.jsp&AACheck=2.2050.2.0.0
      result.rtype    = 'ARTICLE';
      result.mime     = 'HTML';
      result.title_id = param.AAWhere;
      result.unitid   = param.AAWhere;
    } else if (param.AANextPage == '/printFullDocFromXML.jsp') {
      // https://www.accessible.com:443/accessible/docButton?AAWhat=page&AAWhere=2&AABeanName=toc1&AANextPage=/printFullDocFromXML.jsp&AACheck=2.200.5.0.0
      result.rtype    = 'ARTICLE';
      result.mime     = 'HTML';
      result.title_id = param.AAWhere;
      result.unitid   = param.AAWhere;
    } else if (param.AANextPage == '/printBrowseBuiltPage.jsp') {
      // https://www.accessible.com:443/accessible/docButton?AAWhat=builtPage&AAWhere=B00117942.ESSAYONWOMANWHIPPING.xml&AABeanName=toc3&AANextPage=/printBrowseBuiltPage.jsp
      result.rtype    = 'ARTICLE';
      result.mime     = 'HTML';
      result.title_id = param.AAWhere;
      result.unitid   = param.AAWhere;
    }

  }

  return result;
});
