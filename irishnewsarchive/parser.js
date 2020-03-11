#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Irish News Archives
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  let param = parsedUrl.query || {};

  if (/^\/Olive\/APA\/INA.Edu\/get\/search.ashx$/i.test(path)) {
    // https://archive.irishnewsarchive.com:443/Olive/APA/INA.Edu/get/search.ashx?kind=search&text=seamus%20heaney&in=Article
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';

  } else if (/^\/Olive\/APA\/INA.Edu\/get\/browse.ashx$/i.test(path)) {
    // https://archive.irishnewsarchive.com:443/Olive/APA/INA.Edu/get/browse.ashx?kind=years&pub=BNH
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.unitid   = param.pub;

  } else if (/^\/Olive\/APA\/INA.Edu\/get\/prxml.ashx$/i.test(path)) {
    // https://archive.irishnewsarchive.com:443/Olive/APA/INA.Edu/get/prxml.ashx?kind=doc&href=CTB%2F2014%2F04%2F18
    if (param.kind  == 'doc') {
      result.rtype  = 'ARTICLE';
      result.mime   = 'HTML';
      result.unitid = param.href;
    }

  // DO NOT PARSE
  // https://archive.irishnewsarchive.com:443/Olive/APA/INA.Edu/get/image.ashx?kind=preview
  // https://archive.irishnewsarchive.com:443/Olive/APA/INA.Edu/get/image.ashx?kind=page
  // https://archive.irishnewsarchive.com:443/Olive/APA/INA.Edu/get/prxml.ashx?kind=page

  }

  return result;
});
