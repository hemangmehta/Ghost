// # Client API
// RESTful API for the Client resource
var Promise = require('bluebird'),
    _ = require('lodash'),
    pipeline = require('../utils/pipeline'),
    apiUtils = require('./utils'),
    models = require('../models'),
    errors = require('../errors'),
    i18n = require('../i18n'),
    docName = 'clients',
    clients;

/**
 * ### Clients API Methods
 *
 * **See:** [API Methods](index.js.html#api%20methods)
 */
clients = {

    /**
     * ## Read
     * @param {{id}} options
     * @return {Promise<Client>} Client
     */
    read: function read(options) {
        var attrs = ['id', 'slug'],
            tasks;

        /**
         * ### Model Query
         * Make the call to the Model layer
         * @param {Object} options
         * @returns {Object} options
         */
        function doQuery(options) {
            // only User Agent (type = `ua`) clients are available at the moment.
            options.data = _.extend(options.data, {type: 'ua'});
            return models.Client.findOne(options.data, _.omit(options, ['data']));
        }

        // Push all of our tasks into a `tasks` array in the correct order
        tasks = [
            apiUtils.validate(docName, {attrs: attrs}),
            // TODO: add permissions
            // utils.handlePublicPermissions(docName, 'read'),
            doQuery
        ];

        // Pipeline calls each task passing the result of one to be the arguments for the next
        return pipeline(tasks, options).then(function formatResponse(result) {
            if (result) {
                return {clients: [result.toJSON(options)]};
            }

            return Promise.reject(new errors.NotFoundError({message: i18n.t('common.api.clients.clientNotFound')}));
        });
    }
};

module.exports = clients;
