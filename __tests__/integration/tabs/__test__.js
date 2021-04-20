import { configureAxe } from 'jest-axe';
import { screen, fireEvent } from '@testing-library/dom';
import 'jest-axe/extend-expect';
import '@testing-library/jest-dom/extend-expect';

import Tabs from '../../../src/components/Tabs';

const KEYBOARD_KEYS = {
    ENTER: 'Enter',
    SPACE: 'Space',
    HOME: 'Home',
    END: 'End',
    ARROW_LEFT: 'ArrowLeft',
    ARROW_RIGHT: 'ArrowRight',
};

const KEYBOARD_CODES = {
    ENTER: 'Enter',
    SPACE: 'Space',
    HOME: 'Home',
    END: 'End',
    ARROW_LEFT: 'ArrowLeft',
    ARROW_RIGHT: 'ArrowRight',
};

const axe = configureAxe({
    rules: {
        'region': {
            enabled: false // disabled landmark rules when testing isolated components.
        }
    }
});

const tabsHtml = readHtmlFromFile(__dirname, 'tabs.html');

let tabsElement = null;

let tabListElement = null;
let tabElements = null;
let tabPanelElements = null;

let firstTabElement = null;
let secondTabElement = null;
let lastTabElement = null;

let tabsInstance = null;

function eachTabs(tabElements, callback) {
    for (let i = 0; i < tabElements.length; i++) {
        const tabElement = tabElements[i];
        const tabPanelElement = document.getElementById(tabElement.getAttribute('aria-controls'));

        let previousTabElement = tabElements[i - 1];

        if (i === 0) {
            previousTabElement = tabElements[tabElements.length - 1];
        }

        const previousTabPanelElement = document.getElementById(previousTabElement.getAttribute('aria-controls'));

        callback(tabElement, tabPanelElement, previousTabElement, previousTabPanelElement);
    }
}

beforeEach(() => {
    tabsElement = fillBodyContentWithHtml(tabsHtml);

    tabListElement = screen.getByRole('tablist');
    tabElements = screen.getAllByRole('tab');
    tabPanelElements = screen.getAllByRole('tabpanel');

    firstTabElement = tabElements[0];
    secondTabElement = tabElements[1];
    lastTabElement = tabElements[tabElements.length - 1];

    tabsInstance = new Tabs();
});

afterEach(async () => {
    expect(await axe(tabsElement)).toHaveNoViolations();
});

describe('tabs a11y integration testing', () => {
    describe('interaction', () => {
        describe('keyboard', () => {
            describe('home', () => {
                test('moves focus to first tab', () => {
                    fireEvent.keyUp(tabListElement, { key: KEYBOARD_KEYS.HOME, code: KEYBOARD_CODES.HOME });
                    expect(firstTabElement).toHaveFocus();
                });
            });

            describe('end', () => {
                test('moves focus to last tab', () => {
                    fireEvent.keyUp(tabListElement, { key: KEYBOARD_KEYS.END, code: KEYBOARD_CODES.END });
                    expect(lastTabElement).toHaveFocus();
                });
            });

            describe('arrow left', () => {
                test('if the focus is now on the first tab, the last tab should be in focus', async () => {
                    firstTabElement.focus();
                    fireEvent.keyUp(tabListElement, { key: KEYBOARD_KEYS.ARROW_LEFT, code: KEYBOARD_CODES.ARROW_LEFT });
                    expect(lastTabElement).toHaveFocus();
                });
                test('if the focus is not on the first tab now, the tab in front of it should focus', () => {
                    secondTabElement.focus();
                    fireEvent.keyUp(tabListElement, { key: KEYBOARD_KEYS.ARROW_LEFT, code: KEYBOARD_CODES.ARROW_LEFT });
                    expect(firstTabElement).toHaveFocus();
                });
            });

            describe('arrow right', () => {
                test('If the focus is now on the last tab, the first tab should be in focus', () => {
                    lastTabElement.focus();
                    fireEvent.keyUp(tabListElement, { key: KEYBOARD_KEYS.ARROW_RIGHT, code: KEYBOARD_CODES.ARROW_RIGHT });
                    expect(firstTabElement).toHaveFocus();
                });

                test('if the focus is not on the last tab now, the tab after it should focus', () => {
                    firstTabElement.focus();
                    fireEvent.keyUp(tabListElement, { key: KEYBOARD_KEYS.ARROW_RIGHT, code: KEYBOARD_CODES.ARROW_RIGHT });
                    expect(secondTabElement).toHaveFocus();
                });
            });

            describe('enter', () => {
                test('the current panel should be displayed', () => {
                    eachTabs(tabElements, (tabElement, tabPanelElement) => {
                        fireEvent.keyUp(tabElement, { key: KEYBOARD_KEYS.ENTER, code: KEYBOARD_CODES.ENTER });
                        expect(tabPanelElement).not.toHaveAttribute('hidden');
                    });
                });
                test('the previous panel should be hidden', () => {
                    eachTabs(tabElements, (tabElement, tabPanelElement, previousTabElement, previousTabPanelElement) => {
                        fireEvent.keyUp(previousTabElement, { key: KEYBOARD_KEYS.ENTER, code: KEYBOARD_CODES.ENTER });
                        fireEvent.keyUp(tabElement, { key: KEYBOARD_KEYS.ENTER, code: KEYBOARD_CODES.ENTER });
                        expect(previousTabPanelElement).toHaveAttribute('hidden');
                    });
                });
            });

            describe('space', () => {
                test('the current panel should be displayed', () => {
                    eachTabs(tabElements, (tabElement, tabPanelElement) => {
                        fireEvent.keyUp(tabElement, { key: KEYBOARD_KEYS.SPACE, code: KEYBOARD_CODES.SPACE });
                        expect(tabPanelElement).not.toHaveAttribute('hidden');
                    });
                });
                test('the previous panel should be hidden', () => {
                    eachTabs(tabElements, (tabElement, tabPanelElement, previousTabElement, previousTabPanelElement) => {
                        fireEvent.keyUp(previousTabElement, { key: KEYBOARD_KEYS.SPACE, code: KEYBOARD_CODES.SPACE });
                        fireEvent.keyUp(tabElement, { key: KEYBOARD_KEYS.SPACE, code: KEYBOARD_CODES.SPACE });
                        expect(previousTabPanelElement).toHaveAttribute('hidden');
                    });
                });
            });
        });

        describe('mouse', () => {
            describe('left click', () => {
                test('the current panel should be displayed', () => {
                    eachTabs(tabElements, (tabElement, tabPanelElement) => {
                        fireEvent.click(tabElement);
                        expect(tabPanelElement).not.toHaveAttribute('hidden');
                    });
                });
                test('the previous panel should be hidden', () => {
                    eachTabs(tabElements, (tabElement, tabPanelElement, previousTabElement, previousTabPanelElement) => {
                        fireEvent.keyUp(previousTabElement, { key: KEYBOARD_KEYS.ENTER, code: KEYBOARD_CODES.ENTER });
                        fireEvent.keyUp(tabElement, { key: KEYBOARD_KEYS.ENTER, code: KEYBOARD_CODES.ENTER });
                        expect(previousTabPanelElement).toHaveAttribute('hidden');
                    });
                });
            });
        });
    });
});
