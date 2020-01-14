#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Digitalia
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  // uncomment this line if you need parameters
  let param = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  let match;

  if (/^\/fulltext\/filter/i.test(path) || /^\/co|ejournals|s\/([0-9]+)/i.test(path)) {
    //http://www.digitaliapublishing.com:80/fulltext/filter/tipo/0
    result.rtype = 'SEARCH';
    result.mime = 'HTML';
  }

  else if ((match = /^\/a\/([0-9]+)\/([0-z-.]+)$/i.exec(path)) !=null) {
    // http://www.digitaliapublishing.com:80/a/34355/12-arquitectos-contemporaneos (book)
    // http://www.digitaliapublishing.com:80/a/3762/metaliteratura-y-metaficcion--balance-critico-y-perspectivas-comparadas (journal)
    result.rtype = 'TOC';
    result.mime = 'HTML';
    result.unitid = match[1];
    result.title_id = match[2];
  }

  else if ((match = /^\/(visor|visorswf|visorepub)\/([0-9]+)$/i.exec(path)) !=null) {
    // http://www.digitaliapublishing.com:80/visor/398
    // http://www.digitaliapublishing.com:80/visorswf/3987
    result.rtype = 'BOOK';
    if (match[1] === 'visor') {
      result.mime = 'PDF';
    } else if (match[1] === 'visorswf') {
      result.mime = 'HTML';
    } else if (match[1] === 'visorepub') {
      result.mime = 'EPUB';
    }
    result.unitid = match[2];
    result.title_id = match[2];
  }

  else if (/^\/index.jsp/i.test(path)) {
    // http://www.digitaliapublishing.com:80/index.jsp?o=501&id=3762&page=101
    // http://www.digitaliapublishing.com:80/index.jsp?o=501&id=19774&page=2
    result.rtype = 'BOOK_SECTION';
    result.mime = 'PDF';
    result.unitid = param.id;
    result.title_id = param.id + '_' + param.page;
  }

  else if ((match = /^\/visorpagehtml\/([0-9]+)_([0-9]+).page$/i.exec(path)) !=null) {
    //http://www.digitaliapublishing.com:80/visorpagehtml/3762_16.page
    // http://www.digitaliapublishing.com:80/visorpagehtml/41628_101.page
    result.rtype = 'BOOK_SECTION';
    result.mime = 'HTML';
    result.unitid = match[1];
    result.title_id = match[1] + '_' + match[2];
  }

  else if ((match = /^\/visorreadspeaker\/([0-9]+)$/i.exec(path)) !=null) {
    // http://www.digitaliapublishing.com:80/visorreadspeaker/39177
    // http://www.digitaliapublishing.com:80/visorreadspeaker/19774
    result.rtype = 'AUDIO';
    result.mime = 'MISC';
    result.unitid = match[1];
    result.title_id = match[1];
  }

  return result;
});
