var isUlozenkaDone = false;
var isZasilkovnaDone = false;
var returnData = {};

module.exports = {


    importAllData: function (req, res) {

        ImportDataService.removeDatabaseRecords(function(err) {

            if (err) { console.log(err); res.view('500'); }


            ImportDataService.downloadUlozenkaServices(function(err, ulozenkaServicesFeed) {

                if (err) { console.log(err); res.view('500'); }

                ImportDataService.saveUlozenkaServices(ulozenkaServicesFeed, function(err, result) {

                    if (err) { console.log(err); res.view('500'); }

                    ImportDataService.processUlozenkaXML(function(err, resultUlozenka) {

                        if (err) { console.log(err); res.view('500'); }

                        ImportDataService.saveZasilkovnaService(function(err, result) {

                            if (err) { console.log(err); res.view('500'); }

                            ImportDataService.processZasilkovnaXML(function(err, resultZasilkovna) {

                                if (err) { console.log(err); res.view('500'); }

                                return res.json( {
                                    zasilkovna : resultZasilkovna,
                                    ulozenka : resultUlozenka
                                });

                            });


                    });

                });

            });

            });



        });

  }
};
