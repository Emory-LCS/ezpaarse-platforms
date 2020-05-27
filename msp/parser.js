#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Mathematical Sciences Publishers
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;

  let match;

  if (((match = /^\/publications\/([a-zA-Z0-9]+)\/$/i.exec(path)) !== null) || ((match = /^\/([a-zA-Z0-9]+)\/about\/journal\/specialissues.html$/i.exec(path)) !== null) || ((match = /^\/index\/ai.php$/i.exec(path)) !== null))  {
    // https://msp-org:443/publications/websites/
    // https://msp.org:443/pjm/about/journal/specialissues.html
    // https://msp.org:443/index/ai.php?jpath=pjm
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';

  } else if ((match = /^\/([a-zA-Z0-9-]+)\/$/i.exec(path)) !== null) {
    // https://msp.org:443/involve/
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[1];

  } else if (((match = /^\/([a-zA-Z0-9-]+)\/([a-zA-Z0-9-]+)\/([a-zA-Z0-9-]+)\/$/i.exec(path)) !== null) || ((match = /^\/([a-zA-Z0-9-]+)\/([a-zA-Z0-9-]+)\/([a-zA-Z0-9-]+)\/index.xhtml$/i.exec(path)) !== null)) {
    // https://msp.org:443/involve/2020/13-2/
    // https://msp.org:443/paa/2019/1-4/index.xhtml
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[2] + '/' + match[3];

  } else if ((match = /^\/([a-zA-Z0-9-]+)\/([a-zA-Z0-9-]+)\/([a-zA-Z0-9-]+)\/([a-zA-Z0-9-]+).xhtml$/i.exec(path)) !== null) {
    // https://msp.org:443/paa/2019/1-4/p02.xhtml
    result.rtype    = 'ABS';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[2] + '/' + match[3] + '/' + match[4];

  } else if ((match = /^\/([a-zA-Z0-9-]+)\/([a-zA-Z0-9-]+)\/([a-zA-Z0-9-]+)\/([a-zA-Z0-9-]+).pdf$/i.exec(path)) !== null) {
    // https://msp.org:443/paa/2019/1-4/paa-v1-n4-p02-p.pdf
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.title_id = match[1];
    result.unitid   = match[2] + '/' + match[3] + '/' + match[4];

  }

  return result;
});
