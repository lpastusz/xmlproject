/**
* CollectionServices.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

      serviceName: {
          type      :        'string',
          required  :         true,
          size      :         255
      },

      sourceLink: {
          type      :        'string',
          required  :         true,
          size      :         255
      },

      actionFunction: {
          type      :        'string',
          required  :         true,
          size      :         255
      },

      collectionOffices : {
          collection: 'collectionOffice',
          via : 'serviceName'
      }

  }
};
