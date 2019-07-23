#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform siam
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

  if ((match = /^\/action\/doSearch/i.exec(path)) !== null) {
    // http://epubs.siam.org.insmi.bib.cnrs.fr/action/doSearch?publication=40000033
    // http://epubs.siam.org.insmi.bib.cnrs.fr/action/doSearch?publication=40000033&startPage=&Year=2013
    result.rtype = 'SEARCH';
    result.mime  = 'HTML';

    if (param.Year) {
      result.publication_date = param.Year;
    }
    if (param.publication) {
      result.title_id = param.publication;
    }
  } if ((match = /^\/doi\/([a-z]+)\/(([0-9.]+)\/([0-9a-z]+))/i.exec(path)) !== null) {
    // http://epubs.siam.org.insmi.bib.cnrs.fr/doi/pdf/10.1137/100811970
    // http://epubs.siam.org.insmi.bib.cnrs.fr/doi/ref/10.1137/100811970
    // http://epubs.siam.org.insmi.bib.cnrs.fr/doi/abs/10.1137/100811970
    // http://epubs.siam.org.insis.bib.cnrs.fr/doi/abs/10.1137/15M1013857
    switch (match[1]) {
    case 'abs':
      result.rtype = 'ABS';
      result.mime = 'HTML';
      break;
    case 'ref':
      result.rtype = 'REF';
      result.mime = 'HTML';
      break;
    case 'pdf':
      result.rtype = 'ARTICLE';
      result.mime = 'PDF';
      break;
    }

    result.unitid = match[4];
    result.doi = match[2];

  } if (/^\/((action\/(doSearch|showPublications))|(keyword\/([A-z+]+)))/i.test(path)) {
    // https://epubs.siam.org:443/action/doSearch?AllField=physics&publication=  
    // https://epubs.siam.org:443/action/doSearch?publication=40000029
    // https://epubs.siam.org:443/keyword/Conservation+Laws
    // https://epubs.siam.org:443/action/showPublications?pubType=book&category=10.1555/category.40000049&expand=10.1555/category.40000049
    // https://epubs.siam.org:443/action/showPublications?pubType=proceedings&category=10.1555/category.40105910&expand=10.1555/category.40105910
    result.rtype = 'SEARCH';
    result.mime = 'HTML';

  } if ((match = /^\/(toc|page)\/([0-z/.]+)$/i.exec(path)) !== null) {
    // https://epubs.siam.org:443/toc/sjcodc/13/6
    // https://epubs.siam.org:443/toc/mmsubt/17/2
    // https://epubs.siam.org:443/toc/smjmap.1/4/4
    // https://epubs.siam.org:443/page/locus
    result.rtype = 'TOC';
    result.mime = 'HTML';
    result.unitid = match[2];
    result.title_id = match[2];

  } if ((match = /^\/doi\/book\/([0-9/.]{9})\.([0-9]{13})$/i.exec(path)) !== null) {
  // https://epubs.siam.org:443/doi/book/10.1137/1.9781611972863"  (gives "unitid":"1","doi":"10.1137/1")
  // https://epubs.siam.org:443/doi/book/10.1137/1.9781611975529 (print_identifier should be 9781611975529)
    result.rtype = 'TOC';
    result.mime = 'HTML';
    result.print_identifier = match[2];
    result.unitid = match[1] + '.' + match[2];
    result.title_id = match[2];
    result.doi = match[1];

  }
  return result;
});
