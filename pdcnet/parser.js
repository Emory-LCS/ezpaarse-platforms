#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Philosophy Documentation Center
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

  if ((match = /^\/([a-zA-Z0-9_-]+)\/(search|browse)$/i.exec(path)) !== null) {
    // /collection-anonymous/search?q=review
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  } else if ((match = /^\/pdc\/bvdb.nsf\/([a-zA-Z0-9_-]+)$/i.exec(path)) !== null) {
    if ((match[1] == 'journalbrowser') || (match[1] == 'digital_media') || (match[1] == 'publications')) {
      // /pdc/bvdb.nsf/journalbrowser?openform&sort=alpha
      // /pdc/bvdb.nsf/digital_media?openform
      // /pdc/bvdb.nsf/publications?openform
      result.rtype    = 'SEARCH';
      result.mime     = 'HTML';
    } else if (match[1] == 'journalindex') {
      // /pdc/bvdb.nsf/journalindex?readform
      result.rtype    = 'TOC';
      result.mime     = 'HTML';
      result.title_id = 'pdc';
      result.unitid   = param.id || param.item || param.journal || match[1];
    } else if ((match[1] == 'journaldetail') || (match[1] == 'item')) {
      // /pdc/bvdb.nsf/journaldetail?openform&journal=pdc_asplf3&cat=rights
      // /pdc/bvdb.nsf/item?openform&product=publications&item=ruffindarden-4
      result.rtype    = 'REF';
      result.mime     = 'HTML';
      result.title_id = 'pdc';
      result.unitid   = param.id || param.item || param.journal || match[1];
    } else if (match[1] == 'citations') {
      // /pdc/bvdb.nsf/citations?openform&fp=asplf3&id=asplf3_1947_R004_R004
      result.rtype    = 'CITATION';
      result.mime     = 'HTML';
      result.title_id = 'pdc';
      result.unitid   = param.id || param.item || param.journal || match[1];
    }
  } else if ((match = /^\/projekte\/([a-zA-Z0-9_-]+)\/workflow\/([a-zA-Z0-9_-]+).nsf\/([a-zA-Z0-9_-]+)\/\$file\/([a-zA-Z0-9_-]+)toc.pdf$/i.exec(path)) !== null) {
    // /projekte/pdc/workflow/ACPA_Proc.nsf/966D8321F2EC57C7852584A60052EEF7/$file/acpaproc_2017_0091_0000_con_toc.pdf
    result.rtype    = 'TOC';
    result.mime     = 'PDF';
    result.title_id = match[1];
    result.unitid   = match[4] + 'toc';
  } else if ((match = /^\/([a-zA-Z0-9_-]+)\/content\/([a-zA-ZÀ-ž0-9_-]+)$/i.exec(path)) !== null) {
    // /binghamton/content/binghamton_2014_0002_0001_0037_0052
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[2];
  } else if ((match = /^\/([a-zA-Z0-9_-]+)\/([a-zA-ZÀ-ž0-9_-]+)$/i.exec(path)) !== null) {
    // /asplf3/Actes-du-IIIe-Congr%C3%A8s-des-Soci%C3%A9t%C3%A9s-de-Philosophie-de-Langue-Fran%C3%A7aise
    result.rtype    = 'REF';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[2];
  }

  return result;
});
