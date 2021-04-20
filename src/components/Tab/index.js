import EventEmitter from 'eventemitter3';

const EVENTS = {
    SELECT: 'select',
    UNSELECT: 'unselect',
};

const KEY_CODES = {
    ENTER: 'Enter',
    SPACE: 'Space',
};

class Tab extends EventEmitter {
    constructor(element) {
        super();

        this.element = element;

        this.bindHandlers();
    }

    isSelected() {
        return (this.element.getAttribute('aria-selected') === 'true');
    }

    select() {
        if (!this.isSelected()) {
            this.element.setAttribute('aria-selected', true);
            this.element.removeAttribute('tabindex');
            this.emit(EVENTS.SELECT);
        }
    }

    unselect() {
        if (this.isSelected()) {
            this.element.setAttribute('aria-selected', 'false');
            this.element.setAttribute('tabindex', '-1');
            this.emit(EVENTS.UNSELECT);
        }
    }

    focus() {
        this.element.focus();
    }

    handleClick(e) {
        e.preventDefault();
        this.select();
    }

    handleKeyup(e) {
        e.preventDefault();

        const key = e.code;

        switch (key) {
            case KEY_CODES.ENTER:
            case KEY_CODES.SPACE: {
                this.select();
                break;
            }
        }
    }

    bindHandlers() {
        this.element.addEventListener('click', this.handleClick.bind(this));
        this.element.addEventListener('keyup', this.handleKeyup.bind(this));
    }

    static isTab(element) {
        return element.matches('[role="tab"]');
    }
}

export default Tab;
