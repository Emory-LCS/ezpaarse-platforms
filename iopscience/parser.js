#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

module.exports = new Parser(function analyseEC(parsedUrl) {
  const result = {};
  const path   = parsedUrl.pathname;
  let match;

  if ((match = /^\/(([0-9]{4}-[0-9]{3}[0-9Xx]?)\/([0-9]+)\/([0-9]+))$/i.exec(path)) !== null) {
    // /1758-5090/5/3
    result.rtype            = 'TOC';
    result.mime             = 'HTML';
    result.unitid           = match[1];
    result.print_identifier = match[2];
    result.vol              = match[3];
    result.issue            = match[4];

  } else if ((match = /^\/(([0-9]{4}-[0-9]{3}[0-9x]?)\/([0-9]+)\/([0-9]+)\/[0-9]+)(\/article)?$/i.exec(path)) !== null) {
    // /1758-5090/5/3/035002/article
    // /1758-5090/5/3/035002
    result.rtype            = match[5] ? 'ARTICLE' : 'ABS';
    result.mime             = 'HTML';
    result.unitid           = match[1];
    result.print_identifier = match[2];
    result.vol              = match[3];
    result.issue            = match[4];

  } else if ((match = /^\/([0-9]{4}-[0-9]{3}[0-9x]?)\/([0-9]+)\/([0-9]+)\/[0-9]+\/pdf\/([^/]+)\.pdf$/i.exec(path)) !== null) {
    // /1758-5090/5/3/035002/pdf/1758-5090_5_3_035002.pdf
    result.rtype            = 'ARTICLE';
    result.mime             = 'PDF';
    result.print_identifier = match[1];
    result.unitid           = match[4];
    result.vol              = match[2];
    result.issue            = match[3];

  } else if ((match = /^\/article\/(10\.[0-9]+\/(([0-9]{4}-[0-9]{3}[0-9x])\/[a-z0-9]+))(\/pdf|\/meta)?$/i.exec(path)) !== null) {
    // /article/10.1088/2040-8986/aa6097/pdf
    // /article/10.1088/1555-6611/aa9ebe
    result.rtype            = 'ARTICLE';
    result.mime             = match[4] === '/pdf' ? 'PDF': 'HTML';
    result.doi              = match[1];
    result.unitid           = match[2];
    result.print_identifier = match[3];

  } else if ((match = /^\/article\/(10\.[0-9]+\/(([0-9]{4}-[0-9]{3}[0-9x])\/([0-9]+)\/[a-z0-9]+))(\/pdf|\/meta)?$/i.exec(path)) !== null) {
    // /article/10.1209/0295-5075/116/17006/pdf
    result.rtype            = 'ARTICLE';
    result.mime             = match[5] === '/pdf' ? 'PDF': 'HTML';
    result.doi              = match[1];
    result.unitid           = match[2];
    result.print_identifier = match[3];
    result.vol              = match[4];

  } else if ((match = /^\/article\/(10\.[0-9]+\/(([0-9]{4}-[0-9]{3}[0-9x])\/([0-9]+)\/([0-9]+)\/[a-z0-9]+))(\/pdf([a-z0-9_-]+\.pdf)?|\/meta)?$/i.exec(path)) !== null) {
    // /article/10.1088/1748-0221/6/12/C12060/meta
    // /article/10.3847/0004-637X/819/2/158/pdf
    // /article/10.3847/0004-637X/820/1/4
    result.rtype            = 'ARTICLE';
    result.mime             = match[6] === '/pdf' ? 'PDF': 'HTML';
    result.doi              = match[1];
    result.unitid           = match[2];
    result.print_identifier = match[3];
    result.vol              = match[4];
    result.issue            = match[5];

  } else if ((match = /^\/article\/(10\.[0-9]+\/([a-z]+([0-9]{4})v0*([0-9]+)n0*([0-9]+)[a-z0-9]+))\/(pdf|meta)$/i.exec(path)) !== null) {
    // /article/10.1070/SM1967v001n04ABEH001994/pdf
    result.rtype            = 'ARTICLE';
    result.mime             = match[6] === 'pdf' ? 'PDF': 'HTML';
    result.doi              = match[1];
    result.unitid           = match[2];
    result.publication_date = match[3];
    result.vol              = match[4];
    result.issue            = match[5];

  } else if ((match = /^\/article\/(10\.[0-9]+)\/([a-z]+.[0-9]+.[0-9]+)\/(pdf|meta)$/i.exec(path)) !== null) {
    // /article/10.1143/JJAP.16.2165/pdf
    result.rtype            = 'ARTICLE';
    result.mime             = match[3] === 'pdf' ? 'PDF': 'HTML';
    result.doi              = `${match[1]}/${match[2]}`;
    result.unitid           = match[2];

  } else if ((match = /^\/issue\/(([0-9]{4}-[0-9x]{4})\/([0-9]+)\/([0-9]+))$/i.exec(path)) !== null) {
    // /issue/0004-637X/831/2
    result.rtype            = 'TOC';
    result.mime             = 'HTML';
    result.unitid           = match[1];
    result.print_identifier = match[2];
    result.vol              = match[3];
    result.issue            = match[4];

  } else if ((match = /^\/volume\/(([0-9]{4}-[0-9x]{4})\/([0-9]+))$/i.exec(path)) !== null) {
    // /volume/1742-6596/633
    result.rtype            = 'TOC';
    result.mime             = 'HTML';
    result.unitid           = match[1];
    result.print_identifier = match[2];
    result.vol              = match[3];
    result.issue            = match[4];

  } else if ((match = /^\/journal\/([0-9]{4}-[0-9x]{4})$/i.exec(path)) !== null) {
    // /journal/0295-5075
    result.rtype            = 'TOC';
    result.mime             = 'HTML';
    result.unitid           = match[1];
    result.print_identifier = match[1];

  } else if ((/^\/nsearch$/i.test(path)) || (/^\/booklist/i.test(path))) {
    // /nsearch
    // /bookList/10/1
    result.rtype            = 'SEARCH';
    result.mime             = 'HTML';

  } else if ((match = /^\/chapter\/([0-9-]+)\/bk(([0-9-]+)-[0-9]{1})([a-zA-Z0-9]+).(pdf|epub|mobi)$/i.exec(path)) !== null) {
    result.rtype            = 'BOOK_SECTION';
    result.unitid           = match[1] + match[4];
    result.print_identifier = match[1];
    result.vol              = match[4];
    if (match[5] == 'pdf') {
      // https://iopscience.iop.org:443/chapter/978-0-7503-1732-0/bk978-0-7503-1732-0ch3.pdf
      result.mime           = 'PDF';
    } else {
      result.mime           = 'MISC';
      // https://iopscience.iop.org:443/chapter/978-0-7503-1732-0/bk978-0-7503-1732-0ch3.epub
      // https://iopscience.iop.org:443/chapter/978-0-7503-1732-0/bk978-0-7503-1732-0ch3.mobi
    }

  } else if ((match = /^\/book\/([0-9-]+)\/chapter\/bk(([0-9-]+)-[0-9]{1})([a-zA-Z0-9]+)$/i.exec(path)) !== null) {
    // https://iopscience.iop.org:443/book/978-0-7503-1732-0/chapter/bk978-0-7503-1732-0ch3
    result.rtype            = 'BOOK_SECTION';
    result.mime             = 'HTML';
    result.unitid           = match[2] + match[4];
    result.print_identifier = match[1];
    result.vol              = match[4];

  } else if ((match = /^\/book\/([0-9-]+)$/i.exec(path)) !== null) {
    // https://iopscience.iop.org:443/book/978-0-7503-1732-0
    result.rtype            = 'ABS';
    result.mime             = 'HTML';
    result.unitid           = match[1];
    result.print_identifier = match[1];

  } else if ((match = /^\/book\/([0-9-]+).(pdf|epub|mobi)$/i.exec(path)) !== null) {
    result.rtype            = 'BOOK';
    result.unitid           = match[1];
    result.print_identifier = match[1];
    if (match[2] == 'pdf') {
    // https://iopscience.iop.org:443/book/978-0-7503-1732-0.pdf
      result.mime           = 'PDF';
    } else {
      // https://iopscience.iop.org:443/book/978-0-7503-1732-0.epub
      // https://iopscience.iop.org:443/book/978-0-7503-1732-0.mobi
      result.mime           = 'MISC';
    }

  }

  return result;
});
