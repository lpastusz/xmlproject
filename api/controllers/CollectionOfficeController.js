/**
 * CollectionOfficesController
 *
 * @description :: Server-side logic for managing collectionoffices
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	getOffices: function (req, res) {

    	var id = req.param('servicesIds');

        var ids = id.split(',');


        var jsonIds = [];
        for (var i = 0; i < ids.length; i++)
        {
            jsonIds.push({id : ids[i]});
        }

        CollectionService.find(jsonIds).populate('collectionOffices').exec(function(err, data) {
            if (err) console.log(err);

            res.json(data);
        });

    }
};
