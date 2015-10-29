/**
* CollectionOffices.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

      name: {
          type          :       'string',
          required      :       true,
          size          :       255
      },

      longitude: {
          type          :       'string',
          required      :       true,
          size          :       30
      },

      latitude: {
          type          :       'string',
          required      :       true,
          size          :       30
      },

      serviceName: {
          model         :       'CollectionService',
          required      :       true
      }
  }
};
