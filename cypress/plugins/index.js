const chalk = require('chalk');

/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/**
 * @type {Cypress.PluginConfig}
 */
// eslint-disable-next-line no-unused-vars
module.exports = (on, config) => {
    on('task', {
        log(message) {
            let options = [message];
            options.raw = [message];

            console.log(chalk(options));

            return null;
        },

        logDivider() {
            console.log(chalk`{gray ${'─'.repeat(100)}}`);

            return null;
        }
    });
};
