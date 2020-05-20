#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Inter-university Consortium for Political and Social Research
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  // let param = parsedUrl.query || {};

  let match;

  if ((/^\/(icpsrweb|web)\/([a-zA-Z0-9]+)\/(search|browse)/i.test(path)) || (/^\/([a-zA-Z0-9]+)\/search/i.test(path))) {
    // /icpsrweb/AERA/search/publications
    // /web/ICPSR/search/publications?start=0
    // /web/ICPSR/search/studies?q=potato
    // /web/civicleads/search/studies?q=book
    // /web/ICPSR/search/variables?start=0
    // /web/ICPSR/browse/facet/variables/studies
    // /web/ICPSR/browse/facet/variables/series
    // /web/ICPSR/browse/facet/publications/authors
    // /web/ICPSR/browse/facet/publications/journals
    // /web/ICPSR/browse/facet/publications/studies
    // /icpsrweb/AERA/browse/facet/publications/authors
    // /icpsrweb/AERA/browse/facet/publications/journals
    // /linkagelibrary/search/studies?q=book
    // /census/search/studies?q=potato
    result.rtype             = 'SEARCH';
    result.mime              = 'HTML';

  } else if ((match = /^\/(web|icpsrweb)\/([a-zA-Z0-9]+)\/series\/([0-9]+)$/i.exec(path)) !== null) {
    // /web/ICPSR/series/180
    // /web/civicleads/series/3
    // /icpsrweb/AERA/series/2
    result.rtype             = 'TOC';
    result.mime              = 'HTML';
    result.publication_title = match[2];
    result.unitid            = match[3];

  } else if ((match = /^\/(web|icpsrweb)\/([a-zA-Z0-9]+)\/studies\/([0-9]+)$/i.exec(path)) !== null) {
    // /web/ICPSR/studies/2896
    // /web/civicleads/studies/7370
    // /icpsrweb/AERA/studies/34373
    result.rtype             = 'ARTICLE';
    result.mime              = 'HTML';
    result.publication_title = match[2];
    result.unitid            = match[3];

  } else if ((match = /^\/(web|icpsrweb)\/([a-zA-Z0-9]+)\/studies\/([0-9]+)\/publications$/i.exec(path)) !== null) {
    // /web/ICPSR/studies/2896/publications
    // /web/civicleads/studies/7370/publications
    // /icpsrweb/AERA/studies/34373/publications
    result.rtype             = 'CITATION';
    result.mime              = 'HTML';
    result.publication_title = match[2];
    result.unitid            = match[3];

  } else if ((match = /^\/([a-zA-Z0-9]+)\/project\/([a-zA-Z0-9]+)\/version\/([a-zA-Z0-9]+)\/view$/i.exec(path)) !== null) {
    // /linkagelibrary/project/117435/version/V1/view
    result.rtype             = 'ARTICLE';
    result.mime              = 'HTML';
    result.publication_title = match[1];
    result.unitid            = match[2];

  } else if ((match = /^\/pcms\/reports\/studies\/([a-zA-Z0-9]+)\/utilization$/i.exec(path)) !== null) {
    // /pcms/reports/studies/2896/utilization
    result.rtype             = 'DATASET';
    result.mime              = 'HTML';
    result.unitid            = match[1];

  }

  return result;
});
