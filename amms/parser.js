#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 150*/
'use strict';
var Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform American Mathematical Society
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  var result = {};
  var path   = parsedUrl.pathname;
  var param  = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  var match;

  if ((match = /^\/([a-z]+)\/search\/([a-z]+).html$/.exec(path)) !== null) {
    // http://www.ams.org/mathscinet/search/publications.html?
    // http://www.ams.org/mathscinet/search/journaldoc.html?cn=Theory_and_Decision
    // http://www.ams.org/mathscinet/search/publdoc.htm
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
    if (/([a-z]+)doc/.test(match[2])) {
      result.rtype    = 'REF'; }
    if (/author/.test(match[2])) {
      result.rtype    = 'BIO';
      result.unitid   = param.mrauthid; }
  } else if ((match = /^\/([a-z]+)\/pdf\/([0-9]+).pdf$/.exec(path)) !== null) {
    // http://www.ams.org/mathscinet/pdf/3477652.pdf?
    result.rtype    = 'REF';
    result.mime     = 'PDF';
    result.unitid   = match[2];

  } else if ((match = /^\/([a-z]+)\/search\/journal\/profile$/.exec(path)) !== null) {
    // https://mathscinet.ams.org:443/mathscinet/search/journal/profile?groupId=4492
    result.rtype    = 'REF';
    result.mime     = 'HTML';
    result.unitid   = param.groupId;
  } else if ((match = /^\/leavingmsn$/.exec(path)) !== null) {
    // https://mathscinet.ams.org:443/leavingmsn?url=https://doi.org/10.1515/advgeom-2018-0013
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.doi      = param.url.slice(16);
    result.unitid   = param.url.slice(16);
    result.title_id = param.url.slice(16);
  } else if ((match = /^\/([a-z]+)\/servlet\/([a-zA-Z]+)Search$/.exec(path)) !== null) {
    // http://www.ams.org:80/epubsearch/servlet/PubSearch?f1=msc&v1=&co1=and&f2=title&v2=&co2=and&f3=fulltext&v3=&co3=and&f4=author&v4=barton&startmo=00&startyr=&endmo=00&endyr=&sperpage=30&ssort=d&sendit22=Search
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  } else if ((match = /^\/books\/([a-z]+)\/([0-9]+)$/.exec(path)) !== null) {
    // http://www.ams.org:80/books/memo/1051
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.unitid   = match[2];
    result.title_id = match[2];
  } else if (((match = /^\/journals\/([a-z]+)\/([0-9-]+)\/$/.exec(path)) !== null) || ((match = /^\/journals\/([a-z]+)\/([0-9-]+)\/home.html$/.exec(path)) !==null)) {
    // https://www.ams.org:443/journals/jams/2019-32-02/
    // https://www.ams.org:443/journals/jams/2011-24-03/home.html
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.unitid   = match[2];
    result.title_id = match[2];
    result.publication_title = match[1];
  } else if ((match = /^\/cgi-bin\/mstrack\/([a-z-_]+)\/([a-z-]+)$/.exec(path)) !== null) {
    // https://www.ams.org:443/cgi-bin/mstrack/accepted_papers/tran
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.unitid   = match[1];
    result.title_id = match[1];
    result.publication_title = match[2];
  } else if ((match = /^\/cgi-bin\/mstrack\/([a-z-_]+)?$/.exec(path)) !== null) {
    // https://www.ams.org:443/cgi-bin/mstrack/accepted_papers?jrnl=jams
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.unitid   = match[1];
    result.title_id = match[1];
    result.publication_title = param.jrnl;
  } else if (((match = /^\/journals\/([a-z]+)\/([0-9-]+)\/([a-zA-Z0-9-]+)\/$/.exec(path)) !== null) || ((match = /^\/journals\/([a-z]+)\/([0-9-]+)\/([a-zA-Z0-9-]+)$/.exec(path)) !== null)) {
    // DOUBLE CHECK
    // https://www.ams.org:443/journals/jams/2019-32-02/S0894-0347-2018-00906-3/
    result.rtype    = 'ABS';
    result.mime     = 'HTML';
    result.unitid   = match[3];
    result.title_id = match[2];
    result.publication_title = match[1];
  } else if ((match = /^\/journals\/([a-z]+)\/([0-9-]+)\/([a-zA-Z0-9-]+).pdf$/.exec(path)) !== null) {
    // https://www-ams-org:443/journals/notices/201904/201904FullIssue.pdf
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.unitid   = match[3];
    result.title_id = match[2];
    result.publication_title = match[1];
  } else if ((match = /^\/journals\/([a-z]+)\/([0-9-]+)\/([a-zA-Z0-9-]+)\/([a-zA-Z0-9-]+).pdf$/.exec(path)) !== null) {
    // https://www.ams.org:443/journals/jams/2019-32-02/S0894-0347-2018-00906-3/S0894-0347-2018-00906-3.pdf
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.unitid   = match[4];
    result.title_id = match[2];
    result.publication_title = match[1];
  } else if ((match = /^\/books\/([a-z]+)\/([0-9-]+)\/([a-zA-Z0-9-]+).pdf$/.exec(path)) !== null) {
    // http://www.ams.org:80/books/memo/1149/memo1149.pdf
    result.rtype    = 'BOOK';
    result.mime     = 'PDF';
    result.unitid   = match[3];
    result.title_id = match[2];
    result.publication_title = match[1];
  } else if ((match = /^\/([a-z-]+)\/([a-z-]+)\/([a-z0-9-]+)/.exec(path)) !== null) {
    // http://www.ams.org:80/publicoutreach/feature-column/fcarc-brai
    // https://www.ams.org:443/publicoutreach/math-imagery/re
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.unitid   = match[3];
    result.title_id = match[1] + '/' + match[2];
  } else if ((match = /^\/([a-z-]+)\/([0-9]+)\/([0-9]+)\/([0-9]+)\/([a-z0-9-]+)/.exec(path)) !== null) {
    // https://blogs.ams.org:443/matheducation/2019/02/14/mathematics-gatekeeper-or-gateway/
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.unitid   = match[5];
    result.title_id = match[1] + '/' + match[2] + '/' + match[3] + '/' + match[4];
  }
  return result;
});

