/**
 * Video.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    fd: {
        type: 'string',
        required: true,
    },
    size: {
        type: 'integer',
        required: true,
    },
    type: {
        type: 'string',
        required: true,
    },
    filename: {
        type: 'string',
        required: true,
    },
    status: {
        type: 'string',
        required: true,
    },
    field: {
        type: 'string',
        required: true,
    },
    location: {
        type: 'string',
        required: true,
    },
    bucket: {
        type: 'string',
        required: true,
    },
    key: {
        type: 'string',
        required: true,
    },
    etag: {
        type: 'string',
        required: true,
    },
    size: {
        type: 'integer',
        required: true,
    },
    owner: {
      model: 'user',
      required: true
    }

  }
};
