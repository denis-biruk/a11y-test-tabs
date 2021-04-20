import fs from 'fs';
import path from 'path';

global.readHtmlFromFile = (dirname, filePath) => {
    return fs.readFileSync(path.resolve(dirname, filePath), 'utf8').toString();
};

global.fillBodyContentWithHtml = (html) => {
    const container = document.createElement('div');
    container.innerHTML = html;

    const element = container.firstChild;

    document.body.innerHTML = '';
    document.body.appendChild(element);

    return element;
};
