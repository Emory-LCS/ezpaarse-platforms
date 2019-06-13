#!/usr/bin/env node

'use strict';
var Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Chadwyck-Healey Literature Collections
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  var result = {};
  var path   = parsedUrl.pathname;
  // uncomment this line if you need parameters
  var param  = parsedUrl.query || {};
  var host   = parsedUrl.hostname;

  // use console.error for debuging
  // console.error(parsedUrl);

  if (/\/fulltext$/i.test(path)) {
    // http://acta.chadwyck.co.uk/all/fulltext?ALL=Y&action=byid&warn=N&id=Z300036009&div=3&file=../session/1475585193_28984&SOMQUERY=1&DBOFFSET=40649769&ENTRIES=46&CURDB=acta
    result.rtype    = 'ENCYCLOPAEDIA_ENTRY';
    result.mime     = 'HTML';
    result.title_id = param.id || param.ID;
    result.unitid   = param.id || param.ID;
  } else if (/\/search$/i.test(path)) {
    // http://luther.chadwyck.com:80/english/frames/werke/search
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  } else if (/\/htxview$/i.test(path)) {
    // http://luther.chadwyck.com:80/english/frames/werke/htxview?template=toc_hdft.htx&content=toc_top.htx
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
  } else if (/\/toc$/i.exec(path)) {
    // http://luther.chadwyck.com:80/english/frames/werke/toc?action=byid&id=L0000085&CONTROL=ON
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.title_id = param.id || param.ID;
    result.unitid   = param.id || param.ID;
  }

  if (result.rtype !== null) {
    if (/(aabd.chadwyck.com|aabd.chadwyck.com.co.uk)/i.test(host)) {
      // aabd.chadwyck.com
      result.publication_title = 'African American Biographical Database';
    } else if (/(acta.chadwyck.com|acta.chadwyck.co.uk)/i.test(host)) {
      // acta.chadwyck.com
      result.publication_title = 'Acta Sanctorum';
    } else if (/(bsc.chadwyck.com|bsc.chadwyck.co.uk)/i.test(host)) {
      // bsc.chadwyck.com
      result.publication_title = 'Black Studies Center';
    } else if (/(collections.chadwyck.com|collections.chadwyck.co.uk)/i.test(host)) {
      // collections.chadwyck.com
      result.publication_title = 'Chadwyck-Healey Literature Collections';
    } else if (/(eebo.chadwyck.com|eebo.chadwyck.co.uk)/i.test(host)) {
      // eebo.chadwyck.com
      result.publication_title = 'Early English Books Online';
    } else if (/(gerritsen.chadwyck.com|gerritsen.chadwyck.co.uk)/i.test(host)) {
      // gerritsen.chadwyck.com
      result.publication_title = 'The Gerritsen Collection';
    } else if (/(glc.chadwyck.com|glc.chadwyck.co.uk)/i.test(host)) {
      // glc.chadwyck.com
      result.publication_title = 'German Literature Collections';
    } else if (/(glp.chadwyck.com|glp.chadwyck.co.uk)/i.test(host)) {
      // glp.chadwyck.com
      result.publication_title = 'Die Deutsche Lyrik';
    } else if (/(goethe.chadwyck.com|goethe.chadwyck.co.uk)/i.test(host)) {
      // goethe.chadwyck.com
      result.publication_title = 'Goethes Werke';
    } else if (/(history.chadwyck.com|history.chadwyck.co.uk)/i.test(host)) {
      // history.chadwyck.co.uk
      result.publication_title = 'Historical Newspapers';
    } else if (/(historymakers.chadwyck.com|historymakers.chadwyck.co.uk)/i.test(host)) {
      // historymakers.chadwyck.com
      result.publication_title = 'The HistoryMakers';
    } else if (/(historynews.chadwyck.com|historynews.chadwyck.co.uk)/i.test(host)) {
      // historynews.chadwyck.com
      result.publication_title = 'Historical Newspapers';
    } else if (/(iibp.chadwyck.com|iibp.chadwyck.co.uk)/i.test(host)) {
      // iibp.chadwyck.com
      result.publication_title = 'Index to Black Periodicals';
    } else if (/(johnjohnson.chadwyck.com|johnjohnson.chadwyck.co.uk)/i.test(host)) {
      // johnjohnson.chadwyck.com
      result.publication_title = 'The John Johnson Collection';
    } else if (/(kafka.chadwyck.com|kafka.chadwyck.co.uk)/i.test(host)) {
      // kafka.chadwyck.com
      result.publication_title = 'Kafka Werke';
    } else if (/(klassiker.chadwyck.com|klassiker.chadwyck.co.uk)/i.test(host)) {
      // klassiker.chadwyck.com
      result.publication_title = 'Bibliothek deutscher Klassiker';
    } else if (/(luther.chadwyck.com|luther.chadwyck.co.uk)/i.test(host)) {
      // luther.chadwyck.com
      result.publication_title = 'Luthers Werke';
    } else if (/(nstc.chadwyck.com|nstc.chadwyck.co.uk)/i.test(host)) {
      // nstc.chadwyck.com
      result.publication_title = 'Nineteenth-Century Short Title Catalogue';
    } else if (/(pld.chadwyck.com|pld.chadwyck.co.uk)/i.test(host)) {
      // pld.chadwyck.co.uk
      result.publication_title = 'Patrologia Latina';
    } else if (/(qvj.chadwyck.com|qvj.chadwyck.co.uk)/i.test(host)) {
      // qvj.chadwyck.com
      result.publication_title = 'Queen Victoria\'s Journals';
    } else if (/(teso.chadwyck.com|teso.chadwyck.co.uk)/i.test(host)) {
      // teso.chadwyck.com
      result.publication_title = 'Teatro Español del Siglo de Oro';
    } else if (/(wellesley.chadwyck.com|wellesley.chadwyck.co.uk)/i.test(host)) {
      // wellesley.chadwyck.co.uk
      result.publication_title = 'The Wellesley Index to Victorian Periodicals, 1824-1900';
    }
  }
  return result;
});
