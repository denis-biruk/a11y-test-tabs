import './commands/checkPageA11y';

Cypress.Commands.overwrite('visit', (orig, url, options = {}) => {
    if (options.script === false) {
        if (Cypress.config("chromeWebSecurity")) {
            throw new TypeError(
                "When you disable script you also have to set 'chromeWebSecurity' " +
                "in your config to 'false'"
            );
        }

        const parentDocument = cy.state("window").parent.document;
        const iframe = parentDocument.querySelector(".iframes-container iframe");

        iframe.sandbox = "";
    }

    return orig(url, options);
});
