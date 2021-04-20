import Tab from '../Tab';
import TabPanel from '../TabPanel';

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
        const tabPanelId = tab.getAttribute('data-tabpanel');
        const tabPanel = document.getElementById(tabPanelId);

        this.list[tab.id] = {
            tab: new Tab(tab),
            tabPanel: new TabPanel(tabPanel),
        };
    }

    bindTabHandlers(id) {
        this.list[id].tab.on('select', () => {
            this.select(id);
        });
    }

    init() {
        this.element.querySelectorAll('.tab').forEach((tab) => {
            this.createListItem(tab);
            this.bindTabHandlers(tab.id);
        });
    }
}

export default TabList;
