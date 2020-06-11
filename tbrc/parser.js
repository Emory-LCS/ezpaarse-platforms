#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Tibetan Buddhist Resource Center
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

  if ((match = /^\/browser\/ImageService$/i.exec(path)) !== null) {
    // https://www.tbrc.org:443/browser/ImageService?work=W23762&igroup=2636&image=230&first=230&last=233&fetchimg=yes
    // https://www.tbrc.org:443/browser/ImageService?work=W1KG4531&igroup=I1KG4559&image=1&first=1&last=186&fetchimg=yes    
    result.rtype    = 'IMAGE';
    result.mime     = 'MISC';
    result.unitid   = param.work + '-' + param.igroup + '-' + param.image;

  } else if ((match = /^\/eBooks\/([a-zA-Z0-9_-]+).pdf$/i.exec(path)) !== null) {
    // http://www.tbrc.org:80/eBooks/W1KG4531-I1KG4559-1-186-abs.pdf
    // http://www.tbrc.org:80/eBooks/W23762-2636-230-233-any.pdf
    result.rtype    = 'BOOK_SECTION';
    result.mime     = 'PDF';
    result.unitid   = match[1];

  }

  return result;
});
