import TabList from '../TabList';

class Tabs {
    constructor() {
        this.init();
    }

    handleDOMContentLoaded() {
        document.querySelectorAll('[role="tablist"]').forEach((element) => {
            new TabList(element);
        });
    }

    init() {
        const handleDOMContentLoaded = this.handleDOMContentLoaded.bind(this);

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', handleDOMContentLoaded);
        } else {
            handleDOMContentLoaded();
        }
    }
}

export default Tabs;
