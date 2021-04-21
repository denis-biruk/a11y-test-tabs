const violationImpactIndicators = {
    minor: String.fromCodePoint('0x26AA'),
    moderate: String.fromCodePoint('0x1F7E1'),
    serious: String.fromCodePoint('0x1F7E0'),
    critical: String.fromCodePoint('0x1F534'),
};

const violationImpactNames = {
    minor: 'Minor',
    moderate: 'Moderate',
    serious: 'Serious',
    critical: 'Critical',
};

const violationImpactBackgrounds = {
    minor: 'bgWhiteBright',
    moderate: 'bgYellowBright',
    serious: 'bgRedBright',
    critical: 'bgRed',
};

function logImpactLevelInCypress(violationsByImpact, impact) {
    Cypress.log({
        name: 'Impact Level',
        message: `${violationImpactIndicators[impact]} ${violationImpactNames[impact]}`,
        consoleProps: () => ({
            'Impact': `${violationImpactIndicators[impact]} ${violationImpactNames[impact]}`,
            'Violations': violationsByImpact[impact],
        }),
    });
}

function logViolationInCypress(violation) {
    const nodes = Cypress.$(violation.nodes.map(node => node.target).join(''));

    Cypress.log({
        name: 'Violation',
        $el: nodes,
        message: `[${violation.help}](${violation.helpUrl})`,
        consoleProps: () => violation,
    });

    violation.nodes.forEach(({ target }) => {
        Cypress.log({
            name: `Node`,
            $el: Cypress.$(target.join(',')),
            message: target,
            consoleProps: () => violation,
        });
    });
}

function logInTerminal(message) {
    cy.task('log', message, { log: false });
}

function logDividerInTerminal() {
    cy.task('logDivider', null , { log: false });
}

function logViolationInTerminal(violation) {
    logInTerminal(`ID: {blue.bold ${violation.id}}`);
    logInTerminal(`Description: ${violation.description}`);
    logInTerminal(`Help URL: ${violation.helpUrl}`);
    logInTerminal(`Nodes: ${violation.nodes.length}`);
}

function sortViolationsByImpact(violations) {
    const violationsByImpact = {
        critical: [],
        serious: [],
        moderate: [],
        minor: [],
    };

    violations.forEach((violation) => {
        violation.nodes.forEach(({ target }, index) => {
            violation.nodes[index].$el = Cypress.$(target.join(','));
        });

        violationsByImpact[violation.impact].push(violation);
    });

    return violationsByImpact;
}

function violationCallback(violations) {
    const hasOnlyOneViolation = violations.length === 1;
    const violationsByImpact = sortViolationsByImpact(violations);

    logInTerminal(`${violations.length} accessibility violation${hasOnlyOneViolation ? '' : 's'} ${hasOnlyOneViolation ? 'was' : 'were'} detected`);

    Object.keys(violationsByImpact).forEach((impact) => {
        if (violationsByImpact[impact].length > 0) {
            /* Cypress */
            logImpactLevelInCypress(violationsByImpact, impact);

            /* Terminal */
            logDividerInTerminal();
            logInTerminal(`{${violationImpactBackgrounds[impact]}.bold Impact Level: ${impact.toUpperCase()}}`);

            violationsByImpact[impact].forEach((violation) => {
                /* Cypress */
                logViolationInCypress(violation);

                /* Terminal */
                logDividerInTerminal();
                logViolationInTerminal(violation);
            });
        }
    });

    logDividerInTerminal();
}

Cypress.Commands.add('checkPageA11y', () => {
    cy.injectAxe();
    cy.checkA11y(null, null, violationCallback);
});
