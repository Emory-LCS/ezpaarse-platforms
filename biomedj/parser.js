#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Biomedical Journal Table of Contents
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

  if (((match = /^\/$/i.exec(path)) !== null) || ((match = /^\/([a-zA-z0-9_-]+).htm$/i.exec(path)) !== null)) {
    // http://biomedj.cgu.edu.tw:80/
    // http://biomedj.cgu.edu.tw:80/backissues.htm
    // http://biomedj.cgu.edu.tw:80/2014_37_6.htm
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.unitid   = match[1];

  } else if (/^\/articlecited.asp$/i.test(path)) {
    // http://biomedj.cgu.edu.tw:80/articlecited.asp?issn=2319-4170;year=2015;volume=38;issue=4;spage=317;epage=322;aulast=Amin;aid=BiomedJ_2015_38_4_317_151034
    result.rtype    = 'CITATION';
    result.mime     = 'HTML';
    result.unitid   = 'issn=' + param.issn;

  } else if ((match = /^\/pdfs\/([0-9]+)\/([0-9]+)\/([0-9]+)\/images\/([a-zA-z0-9_-]+).pdf$/i.exec(path)) !== null) {
    // http://biomedj.cgu.edu.tw:80/pdfs/2014/37/6/images/BiomedJ_2014_37_6_375_132883.pdf
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.unitid   = match[4];
  }

  return result;
});
