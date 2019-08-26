#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform American Journal of Roentgenology
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

  if ((match = /^\/doi\/([a-z]+)\/([a-zA-Z0-9.]+)\/([a-zA-Z0-9.]+)$/i.exec(path)) !== null) {
    result.title_id = match[2] + '/' + match[3];
    result.unitid   = match[2] + '/' + match[3];
    result.doi      = match[2] + '/' + match[3];
    if (match[1] == 'abs') {
      // https://www.ajronline.org:443/doi/abs/10.2214/AJR.07.2073
      result.rtype    = 'ABS';
      result.mime     = 'HTML';
    } else if (match[1] == 'full') {
      // https://www.ajronline.org:443/doi/full/10.2214/AJR.07.2073
      result.rtype    = 'ARTICLE';
      result.mime     = 'HTML';
    } else if (match[1] == 'pdf') {
      // https://www.ajronline.org:443/doi/pdf/10.2214/AJR.07.2073
      result.rtype    = 'ARTICLE';
      result.mime     = 'PDF';
    } else if (match[1] == 'pdfplus') {
      // https://www.ajronline.org:443/doi/pdfplus/10.2214/AJR.07.2073
      result.rtype    = 'ARTICLE';
      result.mime     = 'PDFPLUS';
    } else if (match[1] == 'suppl') {
      // https://www.ajronline.org:443/doi/suppl/10.2214/AJR.18.20111
      result.rtype    = 'SUPPL';
      result.mime     = 'HTML';
    } else if (match[1] == 'ref') {
      // https://www.ajronline.org:443/doi/ref/10.2214/AJR.18.20672
      result.rtype    = 'REF';
      result.mime     = 'HTML';
    }

  } else if ((match = /^\/doi\/suppl\/([a-zA-Z0-9.]+)\/([a-zA-Z0-9.]+)\/suppl_file\/([a-zA-Z0-9_]+).([a-zA-Z0-9]+)$/i.exec(path)) !== null) {
    result.title_id = match[1] + '/' + match[2];
    result.unitid   = match[1] + '/' + match[2] + '/suppl_file/'  + match[3];
    result.doi      = match[1] + '/' + match[2];
    if (match[4] == 'pdf') {
      // https://www.ajronline.org:443/doi/suppl/10.2214/AJR.18.20111/suppl_file/02_18_20111_suppdata_s01.pdf
      result.rtype  = 'SUPPL';
      result.mime   = 'PDF';
    } else if (match[4] == 'mp4') {
      // https://www.ajronline.org:443/doi/suppl/10.2214/AJR.17.19456/suppl_file/09_17_19456_suppdata_s01.mp4
      result.rtype  = 'VIDEO';
      result.mime   = 'MISC';
    }

  } else if ((match = /^\/loi\/([a-zA-Z0-9]+)$/i.exec(path)) !== null) {
    // https://www.ajronline.org:443/loi/ajr
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[1];

  } else if ((match = /^\/toc\/([a-zA-Z0-9]+)\/([a-zA-Z0-9]+)$/i.exec(path)) !== null) {
    // https://www.ajronline.org:443/toc/ajr/current
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[2];

  } else if ((match = /^\/toc\/([a-zA-Z0-9]+)\/([a-zA-Z0-9]+)\/([a-zA-Z0-9]+)$/i.exec(path)) !== null) {
    // https://www.ajronline.org:443/toc/ajr/current
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[2] + '/' + match[3];

  } else if ((/^\/action\/doSearch$/i.test(path)) || (/^\/action\/showCollection$/i.test(path)) || (/^\/keyword\/([a-zA-Z0-9]+)$/i.test(path)) || (/^\/page\/([a-zA-Z0-9]+)$/i.test(path)) || (/^\/topic\/([a-zA-Z0-9]+)$/i.test(path))) {
    // https://www.ajronline.org:443/action/doSearch?AllField=brain
    // https://www.ajronline.org:443/action/doSearch?AllField=brain&Title=&Contrib=&PubIdSpan=&AfterMonth=&AfterYear=2004&BeforeMonth=&BeforeYear=2012
    // https://www.ajronline.org:443/action/showCollection?collection=&AllField=brain
    // https://www.ajronline.org:443/keyword/Mesothelioma
    // https://www.ajronline.org:443/page/collections
    // https://www.ajronline.org:443/topic/hcp1
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';

  } else if (/^\/action\/showCitFormats$/i.test(path)) {
    // https://www.ajronline.org:443/action/showCitFormats?doi=10.2214%2FAJR.07.2073
    result.rtype    = 'CITATION';
    result.mime     = 'HTML';
    result.title_id = param.doi;
    result.unitid   = param.doi;
    result.doi      = param.doi;

  } else if ((match = /^\/na101\/home\/literatum\/publisher\/arrs\/journals\/content\/ajr\/([0-9]+)\/([a-zA-Z0-9._-]+)\/([a-zA-Z0-9.]+)\/([a-zA-Z0-9_]+)\/images\/([a-z]+)\/([a-zA-Z0-9_]+).jpeg$/i.exec(path)) !== null) {
    // https://www.ajronline.org:443/na101/home/literatum/publisher/arrs/journals/content/ajr/2007/ajr.2007.189.issue-1/ajr.07.2073/production/images/medium/07_2073_01a.jpeg
    // https://www.ajronline.org:443/na101/home/literatum/publisher/arrs/journals/content/ajr/2007/ajr.2007.189.issue-1/ajr.07.2073/production/images/large/07_2073_01a.jpeg
    // https://www.ajronline.org:443/na101/home/literatum/publisher/arrs/journals/content/ajr/2016/ajr.2016.207.issue-5/ajr.16.16477/20161021/images/large/11_16_16477_01b.jpeg
    result.rtype    = 'IMAGE';
    result.mime     = 'MISC';
    result.title_id = '10.2214/' + match[3];
    result.unitid   = '10.2214/' + match[3] + '/' + match[4] + '/images/' + match[5] + '/' + match[6];
    result.doi      = '10.2214/' + match[3];

  } else if ((match = /^\/doi\/suppl\/([a-zA-Z0-9.]+)\/([a-zA-Z0-9.]+)\/doi\/suppl\/([a-zA-Z0-9.]+)\/([a-zA-Z0-9.]+)\/([a-zA-Z0-9_]+)\/([a-zA-Z0-9_]+).jpg$/i.exec(path)) !== null) {
    // https://www.ajronline.org:443/doi/suppl/10.2214/AJR.18.19548/doi/suppl/10.2214/AJR.18.19548/suppl_file/07_18_19548_suppdata_s04e.jpg
    result.rtype    = 'IMAGE';
    result.mime     = 'MISC';
    result.title_id = match[1] + '/' + match[2];
    result.unitid   = match[3] + '/' + match[4] + '/' + match[5] + '/' + match[6];
    result.doi      = match[1] + '/' + match[2];

  } else if (/^\/action\/showLargeCover$/i.test(path)) {
    result.rtype    = 'IMAGE';
    result.mime     = 'MISC';
    result.title_id = param.doi;
    result.unitid   = param.doi;
    result.doi      = param.doi;

  }

  return result;
});
