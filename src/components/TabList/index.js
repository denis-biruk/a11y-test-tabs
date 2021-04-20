import Tab from '../Tab';
import TabPanel from '../TabPanel';

const KEY_CODES = {
    END: 'End',
    HOME: 'Home',
    LEFT: 'ArrowLeft',
    RIGHT: 'ArrowRight',
    ENTER: 'Enter',
    SPACE: 'Space',
};

const SIBLING_DIRECTIONS = {
    PREVIOUS: 'previousElementSibling',
    NEXT: 'nextElementSibling',
};

class TabList {
    constructor(element) {
        this.element = element;

        this.list = {};

        this.init();
    }

    unselectAllTabs(exceptId) {
        Object.keys(this.list).forEach((id) => {
            if (id !== exceptId) {
                this.list[id].tab.unselect();
                this.list[id].tabPanel.hide();
            }
        });
    }

    select(id) {
        this.unselectAllTabs(id);
        this.list[id].tab.select();
        this.list[id].tabPanel.show();
    }

    unselect(id) {
        this.list[id].tab.unselect();
        this.list[id].tabPanel.hide();
    }

    createListItem(tab) {
        const tabPanelId = tab.getAttribute('aria-controls');
        const tabPanel = document.getElementById(tabPanelId);

        this.list[tab.id] = {
            tab: new Tab(tab),
            tabPanel: new TabPanel(tabPanel),
        };
    }

    focusFirstTab() {
        const items = Object.values(this.list);
        const tab = items[0].tab;

        tab.focus();
    }

    focusLastTab() {
        const items = Object.values(this.list);
        const tab = items[items.length - 1].tab;

        tab.focus();
    }

    focusTabInDirection(direction) {
        let nextTab = document.activeElement[direction];

        while (nextTab) {
            if (Tab.isTab(nextTab)) {
                this.focusTab(nextTab.id);
                break;
            }

            nextTab = nextTab[direction];
        }

        if (!nextTab) {
            switch (direction) {
                case SIBLING_DIRECTIONS.PREVIOUS: {
                    this.focusLastTab();
                    break;
                }
                case SIBLING_DIRECTIONS.NEXT: {
                    this.focusFirstTab();
                    break;
                }
            }
        }
    }

    focusTab(id) {
        this.list[id].tab.focus();
    }

    bindTabHandlers(id) {
        this.list[id].tab.on('select', () => {
            this.select(id);
        });
    }

    handelKeyUp(e) {
        const key = e.code;

        switch (key) {
            case KEY_CODES.HOME: {
                e.preventDefault();
                this.focusFirstTab();
                break;
            }
            case KEY_CODES.END: {
                e.preventDefault();
                this.focusLastTab();
                break;
            }
            case KEY_CODES.LEFT: {
                this.focusTabInDirection(SIBLING_DIRECTIONS.PREVIOUS);
                break;
            }
            case KEY_CODES.RIGHT: {
                this.focusTabInDirection(SIBLING_DIRECTIONS.NEXT);
                break;
            }
        }
    }

    init() {
        this.element.querySelectorAll('[role="tab"]').forEach((tab) => {
            this.createListItem(tab);
            this.bindTabHandlers(tab.id);
        });

        this.element.addEventListener('keyup', this.handelKeyUp.bind(this));
    }
}

export default TabList;
