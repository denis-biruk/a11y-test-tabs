import { fireEvent } from '@testing-library/dom';
import '@testing-library/jest-dom/extend-expect';

import Tab from '../index';

const KEYBOARD_KEYS = {
    ENTER: 'Enter',
    SPACE: 'Space',
};

const KEYBOARD_CODES = {
    ENTER: 'Enter',
    SPACE: 'Space',
};

const selectedTabHtml = readHtmlFromFile(__dirname, 'selected-tab.html');
const unselectedTabHtml = readHtmlFromFile(__dirname, 'unselected-tab.html');
const notTabHtml = readHtmlFromFile(__dirname, 'not-tab.html');

let tabElement = null;
let tabInstance = null;

function shouldBeSelected() {
    test('element has an aria-selected attribute with the value "true"', async () => {
        expect(tabElement).toHaveAttribute('aria-selected', 'true');
    });

    test('element has no tabindex attribute', () => {
        expect(tabElement).not.toHaveAttribute('tabindex');
    });
}

function shouldBeUnselected() {
    test('element has an aria-selected attribute with the value "false"', async () => {
        expect(tabElement).toHaveAttribute('aria-selected', 'false');
    });

    test('element has an attribute tabindex with the value "-1"', () => {
        expect(tabElement).toHaveAttribute('tabindex', '-1');
    });
}

describe('tab a11y', () => {
    describe('class interface', () => {
        describe('isSelected', () => {
            test('element with aria-selected="true" returns true', async () => {
                tabElement = fillBodyContentWithHtml(selectedTabHtml);
                tabInstance = new Tab(tabElement);

                expect(tabInstance.isSelected()).toBe(true);
            });

            test('element with aria-selected="false" returns false', () => {
                tabElement = fillBodyContentWithHtml(unselectedTabHtml);
                tabInstance = new Tab(tabElement);

                expect(tabInstance.isSelected()).toBe(false);
            });
        });

        describe('select', () => {
            beforeEach(() => {
                tabElement = fillBodyContentWithHtml(unselectedTabHtml);
                tabInstance = new Tab(tabElement);
                tabInstance.select();
            });

            shouldBeSelected();
        });

        describe('unselect', () => {
            beforeEach(() => {
                tabElement = fillBodyContentWithHtml(selectedTabHtml);
                tabInstance = new Tab(tabElement);
                tabInstance.unselect();
            });

            shouldBeUnselected();
        });

        describe('focus', () => {
            beforeEach(() => {
                tabElement = fillBodyContentWithHtml(selectedTabHtml);
                tabInstance = new Tab(tabElement);
            });

            test('must focus on the element', async () => {
                tabInstance.focus();
                expect(tabElement).toHaveFocus();
            });
        });

        describe('isTab', () => {
            test('for an element that tab should return true', async () => {
                tabElement = fillBodyContentWithHtml(selectedTabHtml);
                expect(Tab.isTab(tabElement)).toBe(true);
            });

            test('for an element that is not tab should return false', () => {
                tabElement = fillBodyContentWithHtml(notTabHtml);
                expect(Tab.isTab(tabElement)).toBe(false);
            });
        });

        describe('interaction', () => {
            beforeEach(() => {
                tabElement = fillBodyContentWithHtml(unselectedTabHtml);
                tabInstance = new Tab(tabElement);
            });

            describe('keyboard', () => {
                describe('enter', () => {
                    beforeEach(() => {
                        fireEvent.keyUp(tabElement, { key: KEYBOARD_KEYS.ENTER, code: KEYBOARD_CODES.ENTER });
                    });

                    shouldBeSelected();
                });

                describe('space', () => {
                    beforeEach(() => {
                        fireEvent.keyUp(tabElement, { key: KEYBOARD_KEYS.SPACE, code: KEYBOARD_CODES.SPACE });
                    });

                    shouldBeSelected();
                });
            });

            describe('mouse', () => {
                describe('left click', () => {
                    beforeEach(() => {
                        fireEvent.click(tabElement);
                    });

                    shouldBeSelected();
                });
            });
        });
    });
});
