#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Elsevier Journals
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  // let param = parsedUrl.query || {};
  // console.error(parsedUrl);

  let match;

  if ((match = /^\/([a-zA-Z0-9-]+)$/i.exec(path)) !== null) {
    // https://www.journals.elsevier.com:443/journal-of-reproductive-immunology
    result.publication_title = match[1];
    result.unitid            = match[1];
    result.rtype             = 'REF';
    result.mime              = 'HTML';

  } else if ((match = /^\/([a-zA-Z0-9-]+)\/([a-zA-Z0-9-]+)$/i.exec(path)) !== null) {
    // https://www.journals.elsevier.com:443/journal-of-reproductive-immunology/editorial-board
    // https://www.journals.elsevier.com:443/contemporary-clinical-trials-communications/recent-articles
    result.publication_title = match[1];
    result.unitid            = match[2];
    result.mime              = 'HTML';
    if (match[2] == 'editorial-board') {
      result.rtype           = 'REF';
    }
    if (match[2] !== 'editorial-board') {
      result.rtype           = 'TOC';
    }

  } else if ((match = /^\/([a-zA-Z0-9-]+)\/([a-zA-Z0-9-]+)\/([a-zA-Z0-9-]+)$/i.exec(path)) !== null) {
    // https://www.journals.elsevier.com:443/journal-of-reproductive-immunology/editorial-board/prof-petra-arck
    // https://www.journals.elsevier.com:443/current-opinion-in-toxicology/news/new-series-of-open-access-titles
    result.publication_title = match[1];
    result.unitid            = match[3];
    result.mime              = 'HTML';
    if (match[2] == 'editorial-board') {
      result.rtype           = 'BIO';
    }
    if (match[2] !== 'editorial-board') {
      result.rtype           = 'ARTICLE';
    }
  }

  return result;
});
