#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform DigiZeitschriften
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


  if ((/^\/suche\/ssearch\/?$/i.test(path)) || (/^\/en\/search\/ssearch\/?$/i.test(path)) || (/^\/zeitschriften\/?$/i.test(path)) || (/^\/de\/search\/ssearch\/?$/i.test(path)) || (/^\/de\/suche\/ssearch\/?$/i.test(path))) {
    // /suche/ssearch/?tx_goobit3_search%5Bdefault%5D=metadata&tx_goobit3_search%5Border%5D=1&tx_goobit3_search%5Bformquery%5D=kunst&tx_goobit3_search%5Blink%5D=1
    // /en/search/ssearch/?tx_goobit3_search%5Bdefault%5D=metadata&tx_goobit3_search%5Border%5D=1&tx_goobit3_search%5Bformquery%5D=kunst&tx_goobit3_search%5Blink%5D=1
    result.rtype  = 'SEARCH';
    result.mime   = 'HTML';

  } else if ((/^\/dms\/toc\/?$/i.test(path)) || (/^\/en\/dms\/toc\/?$/i.test(path)) || (/^\/de\/dms\/toc\/?$/i.test(path))) {
    // /dms/toc/?PID=PPN487748506_0001
    // /en/dms/toc/?PID=PPN514854618
    result.rtype  = 'TOC';
    result.mime   = 'HTML';
    result.unitid = param.PID;

  } else if ((/^\/dms\/met\/?$/i.test(path)) || (/^\/en\/dms\/met\/?$/i.test(path)) || (/^\/de\/dms\/met\/?$/i.test(path))) {
    // /dms/met/?PID=PPN487748506_0001
    // /en/dms/met/?PID=PPN509215866_0035%7Clog84
    result.rtype  = 'CITATION';
    result.mime   = 'HTML';
    result.unitid = param.PID;

  } else if ((/^\/dms\/resolveppn\/?$/i.test(path)) || (/^\/dms\/img\/?$/i.test(path)) || (/^\/en\/dms\/img\/?$/i.test(path)) || (/^\/de\/dms\/img\/?$/i.test(path))) {
    // /dms/resolveppn/?PID=urn:nbn:de:bsz:16-diglit-64819%7Clog00005
    // /dms/img/?PID=PPN487748506_0001%7Clog4
    // /en/dms/img/?PID=PPN487748506_0002%7Clog37
    result.rtype  = 'ARTICLE';
    result.mime   = 'HTML';
    result.unitid = param.PID;

  } else if ((match = /^\/download\/[a-z0-9:_-]+\/([a-z0-9:_-]+)\.pdf$/i.exec(path)) !== null) {
    // /download/PPN235181684_0306/PPN235181684_0306___log8.pdf
    // /download/urn:nbn:de:bsz:16-diglit-79103/urn:nbn:de:bsz:16-diglit-79103___log00011.pdf
    result.rtype  = 'ARTICLE';
    result.mime   = 'PDF';
    result.unitid = match[1];
  }

  return result;
});
