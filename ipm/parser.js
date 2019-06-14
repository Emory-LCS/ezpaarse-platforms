#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Intelex Past Masters
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

  if (/^\/xtf\/search$/i.test(path)) {
    // http://www.library.nlx.com:80/xtf/search?browse-subject-classical=true;brand=default
    // http://pm.nlx.com:80/xtf/search?keyword=freud&ctitle=Eliot%3A+Complete+Works&brand=default
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';

  } else if ((match = /^\/pdf\/([a-zA-Z0-9_-]+).pdf$/i.exec(path)) !== null) {
    // http://www.nlx.com:80/pdf/lutherworks.pdf
    // http://www.nlx.com:80/pdf/nlx-2019-commons-releases.pdf
    result.rtype    = 'REF';
    result.mime     = 'PDF';
    result.title_id = match[1];
    result.unitid   = match[1];

  } else if ((match = /^\/xtf\/view/i.exec(path)) !== null) {
    // http://www.library.nlx.com:80/xtf/view?docId=fichte_de/fichte_de.00.xml;brand=default
    // http://pm.nlx.com:80/xtf/view?docId=austen_c/austen_c.00.xml;chunk.id=div.austen_c.pmpreface.1;toc.depth=2;toc.id=div.austen_c.pmpreface.1;hit.rank=0;brand=default
    result.rtype    = 'BOOK_SECTION';
    result.mime     = 'HTML';

    if (param.docId) {
      let paramTitleID = param.docId.split(';')[0];
      result.title_id = paramTitleID.split('/')[1].replace('.xml', '');
    }

    if (param.docId) {
      let paramUnitID = param.docId.split(';')[0];
      result.unitid = paramUnitID.split('/')[1].replace('.xml', '');
    }

  } else if ((match = /^\/xtf\/page_pdfs\/([a-z_]+)\/([a-z0-9_.]+)\/([a-z0-9_.]+).pdf$/i.exec(path)) !== null) {
    // http://pm.nlx.com/xtf/page_pdfs/beauvoir_fr/beauvoir_fr.06/beauvoir_fr.06_00001.pdf
    result.rtype    = 'BOOK_SECTION';
    result.mime     = 'PDF';
    result.title_id = match[2];
    result.unitid   = match[3];

  }

  return result;
});

