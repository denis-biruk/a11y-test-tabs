import EventEmitter from 'eventemitter3';

const EVENTS = {
    SHOW: 'show',
    HIDE: 'hide'
};

class TabPanel extends EventEmitter {
    constructor(element) {
        super();
        this.element = element;
    }

    show() {
        if (this.element.hidden) {
            this.element.hidden = false;
            this.emit(EVENTS.SHOW);
        }
    }

    hide() {
        if (!this.element.hidden) {
            this.element.hidden = true;
            this.emit(EVENTS.HIDE);
        }
    }
}

export default TabPanel;
