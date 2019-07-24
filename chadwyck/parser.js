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

  let match;

  if ((/^\/iimp\/fulltext/i.test(path)) || (/^\/search\/displayfulltext.do/i.test(path)) || (/^\/search\/displayMultiEssayItem.do/i.test(path)) || (/^\/search\/displayMultiKeyresourceItem.do/i.test(path)) || (/^\/search\/fulltext/i.test(path)) || (/^\/searchBsc\/displayDissertationFulltextById.do/i.test(path))) {
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.title_id = param.id || param.ID || param.ResultsID || param.RID || param.ItemID;
    result.unitid   = param.id || param.ID || param.ResultsID || param.RID || param.ItemID;

  } else if ((/^\/bsc\/displayPDF.do/i.test(path)) || (/^\/bsc\/displayPDF.do/i.test(path)) || (/^\/common\/displayPDF.do/i.test(path)) || (/^\/common\/imageConversion.do/i.test(path)) || (/^\/downloadpdf/i.test(path)) || (/^\/fulltext\/fulltext.do/i.test(path)) || (/^\/iimp\/display_pq_pdf.cgi/i.test(path)) || (/^\/search\/displayProquestPDF.do/i.test(path)) || (/^\/search\/logPDFpage.do/i.test(path))) {
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.title_id = param.pdfFilename || param.ItemID || param.filename || param.id || param.docid || param.PQID;
    result.unitid   = param.pdfFilename || param.ItemID || param.filename || param.id || param.docid || param.PQID;

  } else if ((match = /^\/([0-z/]+)\/fulltext/i.exec(path)) !== null) {
    if ((match[1] === 'all') || (match[1] === 'bie') || (match[1] === 'deutsch/all') || (match[1] === 'deutsch/frames/all') || (match[1] === 'deutsch/frames/alle') || (match[1] === 'deutsch/frames/literary') || (match[1] === 'deutsch/frames/werke') || (match[1] === 'eas') || (match[1] === 'english/all') || (match[1] === 'english/frames/all') || (match[1] === 'english/frames/literary') || (match[1] === 'english/frames/werke') || (match[1] === 'frames') || (match[1] === 'literary') || (match[1] === 'register')) {
      result.rtype    = 'BOOK_SECTION';
      result.mime     = 'HTML';
      result.title_id = param.id || param.ID || param.file || param.FILE || param.OFFEST;
      result.unitid   = param.id || param.ID || param.file || param.FILE || param.OFFSET;
    }

  } else if ((/^\/fulltext\/pdfview.do/i.test(path)) || (/^\/main\/htxview/i.test(path))) {
    result.rtype    = 'BOOK_SECTION';
    result.mime     = 'PDF';
    result.title_id = param.id || param.pdffilename || param.file;
    result.unitid   = param.id || param.pdffilename || param.file;

  } else if ((match = /^\/facs\/([0-9]+)\/([0-9]+).pdf$/i.exec(path)) !== null) {
    result.rtype    = 'BOOK_SECTION';
    result.mime     = 'PDF';
    result.title_id = match[1] + '/' + match[2];
    result.unitid   = match[2];

  } else if (/^\/search$/i.test(path)) {
    result.rtype  = 'SEARCH';
    result.mime   = 'HTML';

  } else if ((match = /^\/([0-z/]+)\/search$/i.exec(path)) !== null) {
    result.rtype  = 'SEARCH';
    result.mime   = 'HTML';

  } else if ((match = /^\/([0-z/]+)\/com?$/i.exec(path)) !== null) {
    if ((match[1] === 'all') || (match[1] === 'bie') || (match[1] === 'cgi') || (match[1] === 'deutsch/all') || (match[1] === 'deutsch/frames') || (match[1] === 'deutsch/frames/all') || (match[1] === 'deutsch/frames/alle') || (match[1] === 'deutsch/frames/literary') || (match[1] === 'deutsch/frames/werke') || (match[1] === 'eas') || (match[1] === 'english/all') || (match[1] === 'english/frames') || (match[1] === 'english/frames/all') || (match[1] === 'english/frames/literary') || (match[1] === 'english/frames/werke') || (match[1] === 'frames') || (match[1] === 'iimp') || (match[1] === 'literary') || (match[1] === 'main') || (match[1] === 'register') || (match[1] === 'search') || (match[1] === 'works') || (match[1] === 'yeats')) {
      result.rtype  = 'SEARCH';
      result.mime   = 'HTML';
    }

  } else if ((/^\/authors\/authorbrowse.pl/i.test(path)) || (/^\/browseBooks\/browseBooks.jsp/i.test(path)) || (/^\/browsePeriodicals\/index.do/i.test(path)) || (/^\/common\/viewContent.do/i.test(path)) || (/^\/gotoSearchTexts.do/i.test(path)) || (/^\/saveditems\/myArchive.do/i.test(path)) || (/^\/search\/browseByDate.do/i.test(path)) || (/^\/search\/browseByNamesAndPlaces.do/i.test(path)) || (/^\/search\/displayMultiResults.do/i.test(path)) || (/^\/search\/results.do/i.test(path)) || (/^\/searchTextsByAuthor.do/i.test(path))) {
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';

  } else if ((match = /^\/([0-z/]+)\/displayDissertationCitationById.do$/i.exec(path)) !== null) {
    result.rtype  = 'ABS';
    result.mime   = 'HTML';
    result.title_id = param.ItemID;
    result.unitid   = param.ItemID;

  } else if (/^\/browse\/displayNameRecord.do/i.test(path)) {
    result.rtype    = 'BIO';
    result.mime     = 'HTML';
    result.title_id = param.personID || param.name || param.id;
    result.unitid   = param.personID || param.name || param.id;

  } else if ((/^\/search\/displayIibpCitation.do/i.test(path)) || (/^\/search\/displayMultiCdefItem.do/i.test(path)) || (/^\/search\/displayMultiIibpItem.do/i.test(path))) {
    result.rtype    = 'CITATION';
    result.mime     = 'HTML';
    result.title_id = param.journalID;
    result.unitid   = param.id;

  } else if ((/^\/downloadtiff/i.test(path)) || (/^\/imageserver/i.test(path)) || (/^\/search\/displayItem.do/i.test(path)) || (/^\/search\/displayItemFromId.do/i.test(path)) || (/^\/search\/displayMultiMultimediaItem.do/i.test(path))) {
    result.rtype    = 'IMAGE';
    result.mime     = 'MISC';
    result.title_id = param.filename || param.RECORD || param.ResultsID || param.ItemID;
    result.unitid   = param.filename || param.RECORD || param.ResultsID || param.ItemID;

  } else if (((match = /^\/cgi-bin\/([0-z/]+).cgi/i.exec(path)) !== null) || ((match = /^\/wpa\/mpeg\/([0-z]+)\/([0-z_-]+).mpg/i.exec(path)) !== null)) {
    result.rtype    = 'VIDEO';
    result.mime     = 'MISC';
    result.title_id = param.url || match[2];
    result.unitid   = param.url || match[2];

  } else if ((/^\/search\/full_rec/i.test(path)) || (/^\/bbidx\/full_rec/i.test(path)) || (/^\/bbidx\/full_rec/i.test(path)) || (/^\/fullrec\/fullrec.do/i.test(path)) || (/^\/iimp\/full_rec/i.test(path)) || (/^\/search\/displayMultimediaItemById.do/i.test(path)) || (/^\/search\/displayMultiRefItem.do/i.test(path)) || (/^\/search\/displayMultiTimelineItem.do/i.test(path)) || (/^\/search\/full_rec/i.test(path)) || (/^\/searchBsc\/displayMultiBliItem.do/i.test(path)) || (/^\/searchFullrec.do/i.test(path)) || (/^\/searchFulltext.do/i.test(path))) {
    result.rtype    = 'REF';
    result.mime     = 'HTML';
    result.title_id = param.name || param.ID || param.ResultsID || param.ItemID || param.id || param.FILE || param.file;
    result.unitid   = param.name || param.ID || param.ResultsID || param.ItemID || param.id || param.FILE || param.file;

  } else if (((match = /^\/info\/([a-z]+).do$/i.exec(path)) !== null) || ((match = /^\/infoCentre\/([a-z]+).jsp$/i.exec(path)) !== null) || ((match = /^\/infoCentre\/([a-z]+).jsp$/i.exec(path)) !== null) || ((match = /^\/infopage\/publ\/([a-z]+).htm$/i.exec(path)) !== null) || ((match = /^\/infopage\/publ\/([a-z]+).htm$/i.exec(path)) !== null)) {
    result.rtype    = 'REF';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[1];

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
