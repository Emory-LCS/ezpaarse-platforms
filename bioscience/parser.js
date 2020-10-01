#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Frontiers in Bioscience
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

  // UGH

  if (/^\/search-article\/index.php$/i.test(path)) {
    // https://www.bioscience.org:443/search-article/index.php
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';

  } else if ((/^\/$/i.test(path)) && (param.s !== null)) {
    // https:/bioscience.org:443/?s=chemical
    result.rtype    = 'SEARCH';
    result.mime    = 'HTML';

  } else if ((match = /^\/(open-access|fast-track|express-open-access)$/i.exec(path)) !== null) {
    // https://www.bioscience.org:443/open-access
    // https://www.bioscience.org:443/fast-track
    // https://www-bioscience-org:443/express-open-access
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.unitid   = match[1];

  } else if ((match = /^\/archives\/([a-zA-Z0-9_/-]+)\/$/i.exec(path)) !== null) {
    // https://bioscience.org:443/archives/scholar/
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.unitid   = match[1];

  } else if ((match  = /^\/([0-9]+)-([0-9]+)\/([a-zA-Z0-9_/-]+)\/$/i.exec(path)) !== null) {
    // https://bioscience.org:443/2020-2/landmark-edition-volume-25-2020/
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.unitid   = match[1] + '-' + match[2] + '/' + match[3];

  } else if ((match = /^\/(metrics|year-metrics)$/i.exec(path)) !== null) {
    // https://www.bioscience.org:443/metrics?id=3616
    // https://www.bioscience.org:443/year-metrics?type=fasttrack
    result.rtype    = 'DATASET';
    result.mime     = 'MISC';
    if (match[1] == 'metrics') {
      result.unitid = match[1] + '/' + param.id;
    } else if (match[1] == 'year-metrics') {
      result.unitid = match[1] + '/' + param.type;
    }

  } else if (/^\/fbs\/getfile.php$/i.test(path)) {
    // https://www.bioscience.org:443/fbs/getfile.php?FileName=/2002/v7/d/storz/storz.pdf
    // https://www.bioscience.org:443/fbs/getfile.php?FileName=/2009/v14/af/3585/3585.pdf
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.unitid   = param.FileName;

  } else if ((match = /^\/([a-zA-Z0-9_/-]+)\/(list|fulltext|address|tables).htm$/i.exec(path)) !== null) {
    result.mime     = 'HTML';
    result.unitid   = match[1];
    if (match[2] == 'list') {
      // https://www.bioscience.org:443/2002/v7/d/storz/list.htm
      // http://www.bioscience.org:80/2009/v14/af/3585/list.htm
      result.rtype  = 'ABS';
    } else if (match[2] == 'fulltext') {
      // https://www.bioscience.org:443/2002/v7/d/storz/fulltext.htm
      // http://www.bioscience.org:80/2009/v14/af/3585/fulltext.htm
      result.rtype  = 'ARTICLE';
    } else if (match[2] == 'address') {
      // https://www.bioscience.org:443/1998/v3/d/palmada/address.htm
      // https://www.bioscience.org:443/1998/v3/a/xiao/address.htm
      result.rtype  = 'BIO';
    } else if (match[2] == 'tables') {
      // http://bioscience.org:80/2020/v25/af/4820/tables.htm
      result.rtype  = 'DATASET';
    }

  } else if ((match = /^\/\/([a-zA-Z0-9_/-]+)\/([0-9]).htm$/i.exec(path)) !== null) {
    // https://bioscience.org:443//2011/v3s/af/127/2.htm
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.unitid   = match[1] + '/' + match[2];

  }

  return result;
});
