#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform CNKI
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

  let host  = parsedUrl.hostname;

  // use console.error for debuging
  // console.error(parsedUrl);

  if (/^\/kcms\/detail\/search.aspx$/i.test(path)) {
    // http://oversea.cnki.net:80/kcms/detail/search.aspx?dbcode=CJFD&sfield=kw&skey=large+jellyfish
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  } else if (/^\/kns[0-9]{2}\/Navi\/CDMDNavi.aspx$/i.test(path)) {
    // http://oversea.cnki.net:80/kns55/Navi/CDMDNavi.aspx?XueKe=1&NaviID=36&xkCode=020209&xkName=Quantitative+Economics
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.title_id = param.xkName;
    result.unitid   = param.xkCode;
  } else if (/^\/kns[0-9]{2}\/detail\/detail.aspx$/i.test(path)) {
    // http://oversea.cnki.net:80/kns55/detail/detail.aspx?QueryID=94&CurRec=1&DbCode=CJFD&dbname=CJFDLAST2017&filename=KXYY201708057
    result.rtype    = 'ABS';
    result.mime     = 'HTML';
    result.title_id = param.filename;
    result.unitid   = param.filename;
  } else if (/^\/KXReader\/Detail$/i.test(path)) {
    // http://kns.cnki.net:80/KXReader/Detail?dbcode=CJFD&filename=KXYY201708057&uid=WEEvREcwSlJHSldRa1FhcEE0RVZycFZqd0tMMFdSNWFYTk9sR2loYUhMOD0=$9A4hF_YAuvQ5obgVAqNKPCYcEjKensW4ggI8Fm4gTkoUKaID8j8gFw
    result.rtype    = 'ABS';
    result.mime     = 'HTML';
    result.title_id = param.filename;
    result.unitid   = param.filename;
  } else if (/^\/kcms\/download.aspx$/i.test(path)) {
    // http://oversea.cnki.net:80/kcms/download.aspx?filename=VM5VjSt5kMsNnaBNTMsRFN0IzSXF1SidUaa5EamFzQo1kYDhFVqhXez1GVhdje5k0ZWhHa2R2SNZmV=0zYCRXWxp3Vr02S58iSjlURzJzSLlkVN50cPplarkDSolER11GazZkNOlka4Z3d0oFN5sUNGN0Uwg&dflag=catalog&tablename=CDFD1214&cflag=pdf
    result.rtype    = 'ARTICLE';
    result.title_id = param.filename;
    result.unitid   = param.filename;
    if (param.cflag === 'pdf') {
      result.mime   = 'PDF';
    }
  } else if (/^search.cnki.net$/i.test(host)) {
    // http://search.cnki.net:80/sug/su.ashx?action=getsmarttips&kw=.&t=%E4%B8%BB%E9%A2%98&dbt=SCDB&attr=1&p=0.012968422931534329&td=1529000160728
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  }

  return result;
});
