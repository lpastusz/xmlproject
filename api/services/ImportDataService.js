module.exports = {

    removeDatabaseRecords : function(callback) {
        CollectionService.destroy({
        }).exec(function(err){

            if (err) callback(err);

            CollectionOffice.destroy({
            }).exec(function(err){

                if (err) callback(err);

                callback();
            });

        });
    },

    downloadUlozenkaServices: function(callback) {
        var linkUlozenkaServices = "https://api.ulozenka.cz/v3/transportservices/";

        var https = require('https');
        https.get(linkUlozenkaServices, function(httpsResponse) {
            var data = "";

            httpsResponse.on('data', function (payload) {
                data += payload;
            });

            httpsResponse.on('error', function (error) {
                callback(error, null);
            });

            httpsResponse.on('end', function(){
                callback(null, JSON.parse(data));
            })
        });
    },

    saveUlozenkaServices: function(data, callback) {

        var savedRowsCounter = 0;
        var error = null;

        data.data.forEach(function(row, index){

            CollectionService.create({
                serviceName     :  row.name,
                sourceLink      :  row._links.self.href + '/branches',
                actionFunction  :  'processUlozenkaXML'
            }).exec(function(err, insertedData){

                if (err) error = err;

                savedRowsCounter ++;

                if (savedRowsCounter === data.data.length) {

                    var returnData = {};
                    returnData.inserted = savedRowsCounter;

                    callback(error, returnData);

                }
            });

        });
    },


    processUlozenkaXML : function(callback) {
        CollectionService.find({
            actionFunction : 'processUlozenkaXML'
        }).exec(function(err, resultSet) {

            if (err) { callback(err, null); }

            var https = require('https');
            var rowsTotal = resultSet.length;
            var totalOfficesInserted = 0;

            var savedRowsCounter = 0;

            resultSet.forEach(function(row, index) {

                var data = "";

                https.get(row.sourceLink, function(httpsResponse) {

                    httpsResponse.on('data', function (payload) {
                        data += payload;
                    });

                    httpsResponse.on('error', function (error) {
                        callback(error, null);
                    });

                    httpsResponse.on('end', function(){

                        ImportDataService.processSingleUlozenkaXML(JSON.parse(data), row.id, function(err, result) {

                            if (err) callback(err, null);

                            savedRowsCounter ++;

                            totalOfficesInserted += result.inserted;

                            if (savedRowsCounter === rowsTotal) {

                                var returnData = {};
                                returnData.inserted = totalOfficesInserted;

                                callback(err, returnData);

                                return;

                            }

                        });
                    })
                });

            });
        });
    },

    processSingleUlozenkaXML : function(data, serviceId, callback) {

        var error = null;
        var offices = [];

        data.data.destination.forEach(function(row, index){

            offices.push({
                name            :  row.name,
                longitude       :  row.gps.longitude,
                latitude        :  row.gps.latitude,
                serviceName     :  serviceId
            });

        });

        CollectionOffice.create(offices).exec(function(err, insertedData){

            if (err) error = err;

            var returnData = {};
            returnData.inserted = data.data.destination.length;

            callback(error, returnData);

            return;

        });

    },


    saveZasilkovnaService: function(callback) {

        CollectionService.create({
            serviceName     :  'Zasilkovna',
            sourceLink      :  'http://www.zasilkovna.cz/api/v3/81b34cc11d28e3ed/branch.json',
            actionFunction  :  'processZasilkovnaXML'
        }).exec(function(err, insertedData){

            callback(err, insertedData);

        });
    },


    processZasilkovnaXML : function(callback) {
        CollectionService.findOne({
            actionFunction : 'processZasilkovnaXML'
        }).exec(function(err, result) {

            if (err) { callback(err, null); }

            var http = require('http');
            var data = "";
            var serviceId = result.id;

            http.get(result.sourceLink, function(httpResponse) {

                httpResponse.on('data', function (payload) {
                    data += payload;
                });

                httpResponse.on('error', function (error) {
                    callback(error, null);
                });

                httpResponse.on('end', function(){

                    data = JSON.parse(data);

                    var offices = new Array();

                    for (var key in data.data)
                    {
                        offices.push({
                            name            :  data.data[key].name,
                            longitude       :  data.data[key].longitude,
                            latitude        :  data.data[key].latitude,
                            serviceName     :  serviceId
                        });

                    }

                    CollectionOffice.create(offices).exec(function(err, insertedData){

                        if (err) error = err;

                        callback(null, { inserted : insertedData.length });

                    });

                });

            });
        });
    }
};
