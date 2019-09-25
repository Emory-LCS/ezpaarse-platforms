#!/usr/bin/env node

/**
 * parser for the JSTOR platform
 * http://analogist.couperin.org/platforms/jstor/
 */
'use strict';

const Parser = require('../.lib/parser.js');
const doiPrefix = '10.2307';

module.exports = new Parser(function analyseEC(parsedUrl) {
  let result = {};
  let path   = parsedUrl.pathname;
  let query  = parsedUrl.query;

  let match;

  if ((match = /^\/journal\/([a-z0-9]+)$/i.exec(path)) !== null) {
    result.rtype    = 'TOC';
    result.mime     = 'MISC';
    result.unitid   = match[1];
    result.title_id = match[1];

  } else if ((match = /^\/stable\/10\.[0-9]+\/(([a-z]+)\.([0-9]+)\.([0-9]+)\.issue-([0-9]+))$/i.exec(path)) !== null) {
    // /stable/10.1525/cmr.2013.55.issue-2
    // /stable/10.5325/jmedirelicult.39.2.issue-2
    result.unitid   = match[1];
    result.title_id = match[2];
    result.issue    = match[5];
    result.rtype    = 'TOC';
    result.mime     = 'MISC';

    if (match[3].length >= 4) {
      result.publication_date = match[3];
      result.vol = match[4];
    } else {
      result.vol = match[3];
    }

  } else if ((match = /^\/stable\/((10\.[0-9]+\/)?([a-z0-9]+))$/i.exec(path)) !== null) {
    // /stable/10.1086/665036
    // /stable/10.7312/cari13424
    // /stable/i25703249
    result.title_id = match[3];
    result.unitid   = match[3];
    result.rtype    = 'TOC';
    result.mime     = 'MISC';

    if (match[2]) {
      result.doi = match[1];
    }

  } else if ((match = /^\/stable\/(i[0-9]+)$/i.exec(path)) !== null) {
    result.title_id = match[1];
    result.unitid   = match[1] ;
    result.rtype    = 'TOC';
    result.mime     = 'MISC';

  } else if (/^\/action\/showPublication$/i.test(path)) {
    // /action/showPublication?journalCode=harvardreview
    if (query.journalCode) {
      result.title_id = query.journalCode;
      result.unitid   = query.journalCode;
      result.rtype    = 'TOC';
      result.mime     = 'MISC';
    }

  } else if ((match = /^\/stable\/(get_image|pdf|pdfplus)\/((10\.[0-9]+\/)?([a-z0-9.]+?))(?:\.pdf)?$/i.exec(path)) !== null) {
    // /stable/get_image/23098031
    // /stable/get_image/10.1525/gfc.2010.10.4.cover
    // /stable/get_image/10.1525/gfc.2010.10.4.103a
    // /stable/pdfplus/690326.pdf
    // /stable/pdf/10.13110/merrpalmquar1982.59.2.0198.pdf
    // /stable/pdf/10.1525/gfc.2010.10.4.cover.pdf
    // /stable/pdf/10.1525/gfc.2010.10.4.98a.pdf

    result.unitid = match[4];
    result.doi    = match[3] ? match[2] : `${doiPrefix}/${match[2]}`;

    switch (match[1]) {
    case 'get_image':
      result.rtype = 'ARTICLE_SECTION';
      result.mime  = 'GIF';
      break;
    case ('pdf'):
      switch (match[2]) {
      case (match[2].match(/^j.ctt*/) || {}).input:
        result.rtype = 'BOOK_SECTION';
        result.mime  = 'PDF';
        break;
      default:
        result.rtype = 'ARTICLE';
        result.mime  = 'PDF';
        break;
      }
      break;
    case 'pdfplus':
      result.rtype = 'ARTICLE';
      result.mime  = 'PDFPLUS';
      break;
    }

    const idPattern = /^([a-z0-9]+)((?:\.(\d+))?\.(\d+)\.(\d+)\.(\w+))?/.exec(result.unitid) || [];

    result.title_id         = idPattern[1];
    result.publication_date = idPattern[3];
    result.vol              = idPattern[4];
    result.issue            = idPattern[5];

    if (idPattern[6] === 'cover') {
      result.rtype = 'COVER';
    } else if (idPattern[6] === 'toc') {
      result.rtype = 'TOC';
    } else {
      const firstPage = parseInt(idPattern[6]);

      if (!isNaN(firstPage)) {
        result.first_page = firstPage.toString();
      }
    }

  } else if ((match = /^\/stable\/(info|view)\/([0-9]+)$/i.exec(path)) !== null) {
    // /stable/info/25703252
    // /stable/view/25703252
    result.title_id = match[2];
    result.unitid   = match[2];
    result.rtype    = match[1] === 'info' ? 'ABS' : 'PREVIEW';
    result.mime     = 'MISC';

  }

  return result;
});
