#!/usr/bin/env node

'use strict';
var Parser = require('../.lib/parser.js');

/**
 * Identifie les consultations de la plateforme ieee
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  const result = {};
  const path   = parsedUrl.pathname;
  const param  = parsedUrl.query || {};
  // console.error(parsedUrl);
  let match;

  if (/^\/search\/searchresult\.jsp/i.test(path)) {
  // https://ieeexplore.ieee.org:443/search/searchresult.jsp?newsearch=true&queryText=flower
  // https://ieeexplore.ieee.org:443/search/searchresult.jsp?contentType=books&queryText=water&highlight=true&returnType=SEARCH&returnFacets=ALL
    result.rtype = 'SEARCH';
    result.mime  = 'HTML';

  } else if (/^\/searchresults\/index\.html/i.test(path)) {
  // https://www.ieee.org:443/searchresults/index.html?q=barton
    result.rtype = 'SEARCH';
    result.mime  = 'HTML';

  } else if (/^\/xpl\/dwnldReferences/i.test(path)) {
    // https://ieeexplore.ieee.org:443/xpl/dwnldReferences?arnumber=8475993
    result.rtype    = 'REF';
    result.mime     = 'HTML';
    result.unitid   = param.arnumber;
    result.title_id = param.arnumber;

  } else if ((match = /^\/rest\/document\/([0-9]+)\/figures/i.exec(path)) !== null) {
    // https://ieeexplore.ieee.org:443/rest/document/8475993/figures
    result.rtype = 'IMAGE';
    result.mime  = 'MISC';
    result.unitid = match[1];
    result.title_id = match[1];

  } else if ((match = /^\/book\/([0-9]+)$/i.exec(path)) !== null) {
    // https://ieeexplore.ieee.org:443/book/8040335
    result.rtype  = 'BOOK';
    result.mime   = 'HTML';
    result.unitid = match[1];

  } else if (/^\/rest\/publication\/home\/metadata/i.exec(path)) {
    // https://ieeexplore.ieee.org:443/rest/publication/home/metadata?pubid=3533
    result.rtype = 'TOC';
    result.mime  = 'HTML';
    result.unitid = param.pubid;
    result.title_id = param.pubid;

  } else if ((match = /^\/document\/([0-9]+)\/?$/i.exec(path)) !== null) {
    // /document/8122856
    result.rtype  = 'ARTICLE';
    result.mime   = 'HTML';
    result.unitid = match[1];

  } else if (/^\/xpl\/(([a-zA-Z]+)\.jsp)/.test(path)) {
    if (param.punumber) {
      // http://ieeexplore.ieee.org.rproxy.insa-rennes.fr/xpl/RecentIssue.jsp?punumber=9754
      // http://ieeexplore.ieee.org.rproxy.insa-rennes.fr/xpl/mostRecentIssue.jsp?punumber=6892922
      result.rtype    = 'TOC';
      result.mime     = 'HTML';
      result.title_id = param.punumber;
      result.unitid   = param.punumber;

    } else if (param.arnumber) {
      // http://ieeexplore.ieee.org.rproxy.insa-rennes.fr/xpl/articleDetails.jsp?tp=&arnumber=6642333&
      // http://ieeexplore.ieee.org.rproxy.insa-rennes.fr/xpl/articleDetails.jsp?tp=&arnumber=6648418
      // http://ieeexplore.ieee.org.rproxy.insa-rennes.fr/xpl/articleDetails.jsp?arnumber=159424
      result.rtype    = 'ABS';
      result.mime     = 'HTML';
      result.unitid   = param.arnumber;

    } else if (param.bkn) {
      // http://ieeexplore.ieee.org.rproxy.insa-rennes.fr/xpl/bkabstractplus.jsp?bkn=6642235
      result.rtype    = 'TOC';
      result.mime     = 'HTML';
      result.title_id = param.bkn;
      result.unitid = param.bkn;
    }

  } else if (/^\/xpls\/(([a-z]+)\.jsp)/.test(path)) {
    // http://ieeexplore.ieee.org.rproxy.insa-rennes.fr/xpls/icp.jsp?arnumber=6648418
    // http://ieeexplore.ieee.org.rproxy.insa-rennes.fr/xpls/icp.jsp?arnumber=6899296
    result.rtype = 'ARTICLE';
    result.mime  = 'HTML';
    if (param.arnumber) {
      result.unitid   = param.arnumber;
    }

  } else if (/^\/stamp\/(([a-z]+)\.jsp)/.test(path)) {
    // http://ieeexplore.ieee.org.rproxy.insa-rennes.fr/stamp/stamp.jsp?tp=&arnumber=6648418
    // http://ieeexplore.ieee.org.rproxy.insa-rennes.fr/stamp/stamp.jsp?arnumber=6899296
    // http://ieeexplore.ieee.org.rproxy.insa-rennes.fr/stamp/stamp.jsp?tp=&arnumber=159424

    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.unitid   = param.arnumber;

  } else if ((match = /^\/[a-z0-9]+\/[0-9]+\/([0-9]+)\/([0-9]+)\.pdf/.exec(path)) != null) {
    //ielx7/85/7478484/07478511.pdf?tp=&arnumber=7478511&isnumber=7478484
    // /ielx2/1089/7625/00316360.pdf?tp=&arnumber=316360&isnumber=7625
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.unitid   = match[2];

  } else if ((match = /^\/stampPDF\/(([a-zA-Z]+)\.jsp)/.exec(path)) != null) {
    //stampPDF/getPDF.jsp?tp=&arnumber=872906
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.unitid   = param.arnumber;

  } else if ((match = /^\/courses\/content\/([0-z]+)\/([a-z]+)\/([a-z]+)/.exec(path)) != null) {
    //courses/content/EW1305/data/swf/
    result.rtype    = 'ONLINE_COURSE';
    result.mime     = 'FLASH';
    result.title_id = match[1];
    result.unitid   = match[1];

  } else if ((match = /^\/courses\/([a-z]+)\/([A-Z0-9]+)/.exec(path)) != null) {
    //http:///courses/details/EDP305
    result.rtype    = 'ABS';
    result.mime     = 'MISC';
    result.unitid   = match[2];

  } else if ((match = /^\/([a-z0-9]+)\/([0-9]+)\/([0-9]+)\/issue\/([a-z0-9]+)-([a-z]+)\.pdf$/i.exec(path)) != null) {
    // /ielx7/5488303/8616908/issue/39mcs01-completeissue.pdf
    result.rtype  = 'ISSUE';
    result.mime   = 'PDF';
    result.unitid = `${match[2]}/${match[3]}/issue/${match[4]}`;

  }
  return result;
});