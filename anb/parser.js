#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform American National Biography
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

  if (/^\/search$/i.test(path)) {
    // https://www.anb.org:443/search?q=mark+twain&searchBtn=Search&isQuickSearch=true
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';

  } else if ((match = /^\/page\/([a-zA-Z0-9-]+)$/i.exec(path)) !== null) {
    // https://www.anb.org:443/page/tools-and-resources
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.unitid   = match[1];

  } else if ((match = /^\/newsitem\/([0-9]+)\/([a-zA-Z0-9-]+)$/i.exec(path)) !== null) {
    // https://www.anb.org:443/newsitem/337/whats-new-january-2020
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.unitid   = match[1] + '/' + match[2];

  } else if ((match = /^\/view\/([0-9.]+)\/anb\/([0-9.]+)\/anb-([0-9]+)-e-([0-9]+)$/i.exec(path)) !== null) {
    // https://www.anb.org:443/view/10.1093/anb/9780198606697.001.0001/anb-9780198606697-e-1600745
    // https://www.anb.org:443/view/10.1093/anb/9780198606697.001.0001/anb-9780198606697-e-1600745?print=pdf
    // https://www.anb.org:443/view/10.1093/anb/9780198606697.001.0001/anb-9780198606697-e-1600745?mediaType=Image
    result.unitid   = match[1] + '/anb/' + match[3] + '.article.' + match[4];
    result.doi      = match[1] + '/anb/' + match[3] + '.article.' + match[4];
    if (param.print === 'pdf') {
      result.rtype    = 'ARTICLE';
      result.mime   = 'PDF';
    } else if (param.mediaType === 'Image') {
      result.rtype    = 'IMAGE';
      result.mime   = 'MISC';
    } else {
      result.rtype    = 'ARTICLE';
      result.mime   = 'HTML';
    }

  }

  return result;
});
