import EventEmitter from 'eventemitter3';

const EVENTS = {
    SELECT: 'select',
    UNSELECT: 'unselect',
};

class Tab extends EventEmitter {
    constructor(element) {
        super();

        this.element = element;

        this.bindHandlers();
    }

    isSelected() {
        return (this.element.dataset.active === 'true');
    }

    select() {
        if (!this.isSelected()) {
            this.element.dataset.active = 'true';
            this.emit(EVENTS.SELECT);
        }
    }

    unselect() {
        if (this.isSelected()) {
            this.element.dataset.active = 'false';
            this.emit(EVENTS.UNSELECT);
        }
    }

    handleClick(e) {
        e.preventDefault();
        this.select();
    }

    bindHandlers() {
        this.element.addEventListener('click', this.handleClick.bind(this));
    }
}

export default Tab;
