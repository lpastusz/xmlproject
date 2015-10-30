module.exports = {
    importAllData: function (req, res) {
        
        ImportDataService.removeDatabaseRecords(function(err) {

            if (err) { console.log(err); res.view('500'); }

            ImportDataService.downloadUlozenkaServices(function(err, ulozenkaServicesFeed) {

                if (err) { console.log(err); res.view('500'); }

                ImportDataService.saveUlozenkaServices(ulozenkaServicesFeed, function(err, result) {

                    if (err) { console.log(err); res.view('500'); }

                    ImportDataService.processUlozenkaXML(function(err, result) {

                        if (err) { console.log(err); res.view('500'); }

                        res.json(result);

                    });

                });

            });
			
			ImportDataService.downloadZasilkovnaServices(function(err, ZasilkovnaServicesFeed) {

                if (err) { console.log(err); res.view('500'); }

                ImportDataService.saveZasilkovnaServices(ZasilkovnaServicesFeed, function(err, result) {

                    if (err) { console.log(err); res.view('500'); }

                    ImportDataService.processZasilkovnaXML(function(err, result) {

                        if (err) { console.log(err); res.view('500'); }

                        res.json(result);
						

                    });

                });

            });

        });


  }
};
