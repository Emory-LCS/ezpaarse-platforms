#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Metropolitan Opera
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

  if ((/^\/search\/$/i.test(path)) || (/^\/\/search\/$/i.test(path))) {
    // https://www.metopera.org:443/search/
    // https://www.metopera.org:443//search/
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';

  } else if (((match = /^\/discover\/([a-zA-Z0-9-]+)\/$/i.exec(path)) !== null) || ((match = /^\/\/discover\/([a-zA-Z0-9-]+)\/$/i.exec(path)) !== null)) {
    // https://www.metopera.org:443/discover/articles/
    // https://www.metopera.org:443//discover/synopses/
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[1];

  } else if ((match = /^\/discover\/(education|synopses|artists|articles)\/([a-zA-Z0-9-]+)\/$/i.exec(path)) !== null) {
    result.title_id = match[2];
    result.unitid   = match[2];
    if (match[1] == 'education') {
      // https://www.metopera.org:443/discover/education/educator-guides-archive/
      result.rtype    = 'TOC';
      result.mime     = 'HTML';
    } else if (match[1] == 'synopses') {
      // https://www.metopera.org:443/discover/synopses/aida/
      result.rtype    = 'REF';
      result.mime     = 'HTML';
    } else if (match[1] == 'artists') {
      // https://www.metopera.org:443/discover/artists/aria-code/
      result.rtype    = 'AUDIO';
      result.mime     = 'MISC';
    } else if (match[1] == 'articles') {
      // https://www.metopera.org:443/discover/articles/diva-as-diva/
      result.rtype    = 'ARTICLE';
      result.mime     = 'HTML';
    }

  } else if ((match = /^\/discover\/artists\/([a-zA-Z0-9-]+)\/([a-zA-Z0-9-]+)\/$/i.exec(path)) !== null) {
    // https://www.metopera.org:443/discover/artists/baritone-and-bass/ildar-abdrazakov/
    result.rtype    = 'BIO';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[2];

  } else if ((match = /^\/discover\/education\/([a-zA-Z0-9-]+)\/([a-zA-Z0-9-]+)\/$/i.exec(path)) !== null) {
    result.title_id = match[1];
    result.unitid   = match[2];
    if (match[1] == 'free-student-streams') {
      // https://www.metopera.org:443/discover/education/free-student-streams/audio-clips-hansel-and-gretel/
      result.rtype    = 'AUDIO';
      result.mime     = 'MISC';
    } else {
      // https://www.metopera.org:443/discover/education/illustrated-synopses/hansel-and-gretel/
      // https://www.metopera.org:443/discover/education/educator-guides-archive/aida/
      result.rtype    = 'REF';
      result.mime     = 'HTML';
    }

  } else if ((match = /^\/globalassets\/discover\/education\/([a-zA-Z0-9-]+)\/([a-zA-Z0-9-]+)\/([a-zA-Z0-9.-]+).pdf$/i.exec(path)) !== null) {
    // https://www.metopera.org:443/globalassets/discover/education/educator-guides/hansel-and-gretel/hanselandgretel.07-08.guide.pdf
    result.rtype    = 'REF';
    result.mime     = 'PDF';
    result.title_id = match[1];
    result.unitid   = match[2] + '/' + match[3];

  } else if ((match = /^\/season\/on-demand\/([a-zA-Z0-9-]+)\/$/i.exec(path)) !== null) {
    // https://www.metopera.org:443/season/on-demand/opera/?upc=811357019078
    result.rtype    = 'VIDEO';
    result.mime     = 'MISC';
    result.title_id = match[1];
    result.unitid   = param.upc;

  }

  return result;
});
