#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform NBER
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  let match;

  if ((match = /^\/([a-z]+)\/([a-z0-9_]+)$/i.exec(path)) !== null) {
    // http://www.nber.org/papers/w20518
    result.rtype  = 'REF';
    result.mime   = 'HTML';
    result.unitid = match[2];

    if (match[1] === 'papers') {
      result.rtype = 'ABS';
    }

    if (match[1] === 'people') {
      result.rtype = 'BIO';
    }

    if (match[2] === 'search') {
      result.rtype = 'SEARCH';
    }

  } else if ((match = /^\/([a-z]+)\/([a-z]+)\/([a-z]+).html$/i.exec(path)) !== null) {
    // /workinggroups/ent/ent.html
    result.rtype = 'REF';
    result.mime  = 'HTML';
    result.unitid = match[1] + '/' + match[2];

    if ((match[2] === 'papers') || (match[1] === 'themes')) {
      result.rtype = 'TOC';
      result.unitid = match[2] + '/' + match[3];
    }

  } else if (/^\/[a-z]+.html$/i.test(path)) {
    // /papers.html
    result.rtype = 'TOC';
    result.mime  = 'HTML';

  } else if ((match = /^\/([a-z]+)\/([a-z0-9]+).pdf$/i.exec(path)) !== null) {
    // papers/w20518.pdf
    result.rtype  = 'BOOK';
    result.mime   = 'PDF';
    result.unitid = match[2];
    if (match[1] == 'papers') {
      result.doi   = '10.3386/' + match[2];
      result.rtype = 'WORKING_PAPER';
    }
  } else if ((match = /^\/[a-z]+\/[a-z]+\/([a-z0-9]+)$/i.exec(path)) !== null) {
    // /papers/mail/w21683
    result.rtype  = 'WORKING_PAPER';
    result.mime   = 'HTML';
    result.unitid = match[1];

  } else if ((match = /^\/([a-zA-Z0-9_-]+)\/?$/i.exec(path)) !== null) {
    // /booksbyyear/
    result.rtype  = 'TOC';
    result.mime   = 'HTML';
    result.unitid = match[1];

  } else if ((match = /^\/([a-zA-Z0-9_-]*)(.html)?$/i.exec(path)) !== null) {
    // /booksbyyear/1920s.html
    // /books/mitc21-1
    result.rtype  = 'TOC';
    result.mime   = 'HTML';
    result.unitid = match[1];

  } else if ((match = /^\/([a-zA-Z0-9]+)\/([a-zA-Z0-9_-]*)(.html)?$/i.exec(path)) !== null) {
    // /booksbyyear/1920s.html
    // /books/mitc21-1
    result.rtype  = 'TOC';
    result.mime   = 'HTML';
    result.unitid = match[2];

    if (match[2] === 'index') {
      result.rtype = 'ABS';
      result.unitid = match[1] + '/' + match[2];
    }

    if (match[1] === 'cycles') {
      result.rtype = 'REF';
      result.unitid = match[2];
    }

  } else if ((match = /^\/([a-zA-Z0-9]+)\/([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_-]+).shtml$/i.exec(path)) !== null) {
    // https://www.nber.org:443/digest/may19/w25672.shtml
    // https://www.nber.org:443/themes/africa/africansuccesses.shtml
    result.rtype  = 'ARTICLE';
    result.mime   = 'HTML';
    result.unitid = match[1] + '/' + match[2] + '/' + match[3];

  } else if ((match = /^\/([a-zA-Z0-9]+)\/([a-zA-Z0-9_-]+).pdf$/i.exec(path)) !== null) {
    // https://www.nber.org:443/cycles/US_Business_Cycle_Expansions_and_Contractions_20120423.pdf
    result.rtype  = 'ARTICLE';
    result.mime   = 'PDF';
    result.unitid = match[1] + '/' + match[2] + '/' + match[3];

    if (match[1] === 'cycles') {
      result.rtype = 'DATA';
    }

    if (match[1] === 'themes') {
      result.rtype = 'REPORT';
    }


  } else if ((match = /^\/([a-zA-Z0-9]+)\/([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_-]+).pdf$/i.exec(path)) !== null) {
    // https://www.nber.org:443/digest/aug19/aug19.pdf
    // https://www.nber.org:443/themes/africa/NBER_African_Successes_brochure.pdf
    result.rtype  = 'ARTICLE';
    result.mime   = 'PDF';
    result.unitid = match[1] + '/' + match[2] + '/' + match[3];

    if (match[1] === 'cycles') {
      result.rtype = 'DATA';
    }

    if (match[1] === 'themes') {
      result.rtype = 'REPORT';
    }

  } else if (((match = /^\/([a-z]+)\/([0-9]+)\/([a-zA-Z0-9/]+)\/summary.html?$/i.exec(path)) !== null) || ((match = /^\/([a-z]+)\/([a-z]+)\/([a-z]+)summary.shtml?$/i.exec(path)) !== null)) {
    // /conferences/2019/SI2019/EFGs19/summary.html
    // /themes/energy/energysummary.shtml
    result.rtype  = 'TOC';
    result.mime   = 'HTML';
    result.unitid = match[3];

  } else if ((match = /^\/([a-zA-Z0-9_-]+)lecture([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_-]+).pdf$/i.exec(path)) !== null) {
    // /feldstein_lecture_2018/2018feldstein_lecture.pdf
    result.rtype  = 'SUPPL';
    result.mime   = 'PDF';
    result.unitid = match[3];

  } else if ((match = /^\/([a-zA-Z0-9_-]+)lecture([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_-]+).html$/i.exec(path)) !== null) {
    // https://conference.nber.org:443/feldstein_lecture_2018/feldstein_lecture_2018.html
    result.rtype  = 'VIDEO';
    result.mime   = 'MISC';
    result.unitid = match[3];

  } else if ((match = /^\/([a-zA-Z0-9_-]+)video\/([a-zA-Z0-9_-]+)\/$/i.exec(path)) !== null) {
    // https://conference.nber.org:443/si2018_video/tradepanel/
    result.rtype  = 'VIDEO';
    result.mime   = 'MISC';
    result.unitid = match[1] + 'video/' + match[2];

  }

  return result;
});

