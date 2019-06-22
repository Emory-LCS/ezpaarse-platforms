#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Koreanstudies Information Service System
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

  // let match;

  if (/^\/subject\/(subject([0-9]+)|subj-thesis-view)\.asp/i.test(path)) {
    // http://kiss.kstudy.com:80/subject/subject2.asp?datas=06,26,kiss
    // http://kiss.kstudy.com:80/subject/subject1.asp?datas=06,31,kiss
    // http://kiss.kstudy.com:80/subject/subject2.asp
    // http://kiss.kstudy.com:80/subject/subj-thesis-view.asp?key=8
    result.rtype = 'SEARCH';
    result.mime = 'HTML';

  } else if (/^\/dataReport\/data2\.asp/i.test(path)) {
    // http://kiss.kstudy.com:80/dataReport/data2.asp?key=204
    result.rtype = 'SEARCH';
    result.mime = 'HTML';

  } else if (/^\/inc\/aside_view_thesis\.asp/i.test(path)) {
    // http://kiss.kstudy.com:80/inc/aside_view_thesis.asp?key=3660962,3217329,3656253
    // http://kiss.kstudy.com:80/inc/aside_view_thesis.asp?key=3660962,3217329,3656253,2851753,404440,404449,3664469,1637421,3581678,3186305,3666921,3547940,3667618,3587276
    result.rtype = 'SEARCH';
    result.mime = 'HTML';

  } else if (/^\/publish\/pub-office\.asp/i.test(path)) {
    // http://kiss.kstudy.com:80/publish/pub-office.asp?queryIn=7113
    // http://kiss.kstudy.com:80/publish/pub-office.asp?queryIn=7120
    result.rtype = 'REF';
    result.mime = 'HTML';

  } else if (/^\/journal\/journal-view\.asp/i.test(path)) {
    // http://kiss.kstudy.com:80/journal/journal-view.asp?key1=30199&key2=7136
    // http://kiss.kstudy.com:80/journal/journal-view.asp?key1=30127&key2=7129
    // http://kiss.kstudy.com:80/journal/journal-view.asp?key1=28637&key2=3002
    result.rtype = 'TOC';
    result.mime = 'HTML';
    result.unitid = param.key1 + '/' + param.key2;

  } else if (/^\/thesis\/thesis-view\.asp/i.test(path)) {
    // http://kiss.kstudy.com:80/thesis/thesis-view.asp?key=3660962
    // http://kiss.kstudy.com:80/thesis/thesis-view.asp?key=3217329
    // http://kiss.kstudy.com:80/thesis/thesis-view.asp?key=3656253
    result.rtype = 'ABS';
    result.mime = 'HTML';
    result.unitid = param.key;

  } else if (/^\/search\/(download|open_viewer)\.asp/i.test(path)) {
    // http://kiss.kstudy.com:80/search/download.asp?ftproot=http://210.101.116.15/kiss5/download_journal.asp&inst_key=7129&a_imag=2c800098.pdf&isDownLoad=0&publ_key=30127
    // http://kiss.kstudy.com:80/search/download.asp?ftproot=http://210.101.116.15/kiss5/download_journal.asp&inst_key=7129&a_imag=2c800099.pdf&isDownLoad=0&publ_key=30127
    // http://kiss.kstudy.com:80/search/download.asp?ftproot=http://210.101.116.15/kiss5/download_journal.asp&inst_key=2321&a_imag=2u301418.pdf&isDownLoad=1&publ_key=30772&down_name=%E2%80%98%EC%8B%A0%EC%8B%9C%EB%8C%80%E2%80%99%EC%99%80%20%EC%A4%91%EA%B5%AD%EC%9D%98%20%EC%97%AD%EC%82%AC%20%EB%8B%A4%EC%8B%9C%20%EC%93%B0%EA%B8%B0%20%EC%9D%BC%EA%B5%AD%EC%82%AC%EC%99%80%20%EC%A7%80%EC%97%AD%EC%82%AC%EC%9D%98%20%EA%B2%BD%EA%B3%84%EC%97%90%EC%84%9C
    // http://kiss.kstudy.com:80/search/open_viewer.asp?ftproot=http://210.101.116.61/74000018/index.asp&inst_key=5050&a_imag=74000018.pdf&isDownLoad=0&publ_key=25492
    // http://kiss.kstudy.com:80/search/open_viewer.asp?ftproot=http://210.101.116.61/06006260/index.asp&inst_key=8010&a_imag=06006260.pdf&isDownLoad=0&publ_key=25450
    result.rtype = 'ARTICLE';
    result.mime = 'PDF';
    result.unitid = param.inst_key + '/' + param.a_imag + '/' + param.publ_key;

  }

  return result;
});
