#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Johns Hopkins Guide to Library Theory and Criticism
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

  if ((match = /^\/cgi-bin\/(search|view).cgi$/i.exec(path)) !== null) {
    result.mime     = 'HTML';
    if (match[1] == 'search') {
      // https://litguide.press.jhu.edu:443/cgi-bin/search.cgi?flag=basic 
      result.rtype  = 'SEARCH';
    } else if (match[1] == 'view') {
      // https://litguide.press.jhu.edu:443/cgi-bin/view.cgi?eid=8
      // https://litguide.press.jhu.edu:443/cgi-bin/view.cgi?section_id=2107
      result.rtype  = 'BOOK_SECTION';
      result.unitid = param.eid || param.section_id;
    }

  } else if ((match = /^\/([a-zA-Z0-9_-]+).html$/i.exec(path)) !== null) {
    result.mime     = 'HTML';
    result.unitid   = match[1];
    if (match[1] == 'table_of_contents') {
      // https://litguide.press.jhu.edu:443/table_of_contents.html
      result.rtype  = 'TOC';
    } else if (match[1] == 'contributors') {
      // https://litguide.press.jhu.edu:443/contributors.html
      result.rtype  = 'TOC';
    } else if (match[1] == 'topical_index') {
      // https://litguide.press.jhu.edu:443/topical_index.html
      result.rtype  = 'TOC';
    } else if (match[1] == 'foreword') {
      // https://litguide.press.jhu.edu:443/foreword.html
      result.rtype  = 'BOOK_SECTION';
    } else if (match[1] == 'preface') {
      // https://litguide.press.jhu.edu:443/preface.html
      result.rtype  = 'BOOK_SECTION';
    } else if (match[1] == 'acknowledgements') {
      // https://litguide.press.jhu.edu:443/acknowledgements.html
      result.rtype  = 'BOOK_SECTION';
    }

  } else if ((match = /^\/entries\/([a-zA-Z0-9_-]+).html$/i.exec(path)) !== null) {
    // https://litguide.press.jhu.edu:443/entries/index.html
    result.mime     = 'HTML';
    result.rtype    = 'TOC';
    result.unitid   = match[1];

  }

  return result;

});
