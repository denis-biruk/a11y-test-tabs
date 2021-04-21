describe('Tabs', function () {
    before(() => {
        cy.viewport(1200, 660);
    });

    describe('Interaction', () => {
        describe('Keyboard', () => {
            beforeEach(() => {
                cy.visit('/');
            });

            it('open tab panel on Enter', function () {
                cy.get('[role="tab"]').each(($tab) => {
                    const tabPanelId = $tab.attr('aria-controls');
                    cy.wrap($tab).type('{enter}');
                    cy.get(`#${tabPanelId}`).should('be.visible');
                });
            });

            it('open tab panel on Space', function () {
                cy.get('[role="tab"]').each(($tab) => {
                    const tabPanelId = $tab.attr('aria-controls');
                    cy.wrap($tab).type(' ');
                    cy.get(`#${tabPanelId}`).should('be.visible');
                });
            });
        });

        describe('Mouse', () => {
            it('open tab panel on click', function () {
                cy.get('[role="tab"]').each(($tab) => {
                    const tabPanelId = $tab.attr('aria-controls');
                    cy.wrap($tab).click();
                    cy.get(`#${tabPanelId}`).should('be.visible');
                });
            });
        });
    });

    describe('A11Y', () => {
        it('has no detectable a11y violations', function () {
            cy.visit('/');
            cy.checkPageA11y();
        });

        it('work with no js', function () {
            cy.visit('/', {
                script: false,
            });

            cy.get('[role="tab"]').each(($tab) => {
                const tabPanelId = $tab.attr('aria-controls');
                cy.wrap($tab).click();
                cy.get(`#${tabPanelId}`).should('be.focused');
            });
        });
    });
});
