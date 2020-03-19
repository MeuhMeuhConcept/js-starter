"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const loader_1 = require("./loader");
class ResourcesLoader {
    constructor() {
        this._elementInDom = false;
        this._errorShown = false;
        this.errorMessage = null;
        this._loader = new loader_1.MultiResourceLoader();
        this._loader.onUpdate((l) => {
            this.show();
            if (l.status === 'done') {
                this.done();
                return;
            }
            else if (l.status === 'error') {
                this.error();
                return;
            }
            this._progressBarElement.setAttribute('style', `width: ${l.progress}%`);
        });
        this._element = document.createElement('div');
        this._element.className = 'resources-loader-layout';
        const box = document.createElement('div');
        box.className = 'resources-loader-box';
        const indicator = document.createElement('div');
        indicator.className = 'resources-loader-indicator';
        const progress = document.createElement('div');
        progress.className = 'progress resources-loader-progress';
        this._progressBarElement = document.createElement('div');
        this._progressBarElement.className = 'progress-bar bg-primary';
        this._progressBarElement.setAttribute('style', 'width: 0%');
        progress.appendChild(this._progressBarElement);
        indicator.appendChild(progress);
        box.appendChild(indicator);
        this._element.appendChild(box);
    }
    addResources(resources) {
        for (let key in resources) {
            let resource = resources[key];
            if (/\.js$/.test(resource)) {
                this._loader.addResourceLoader(key, new loader_1.JSLoader(resource, false, false));
            }
            else if (/\.css$/.test(resource)) {
                this._loader.addResourceLoader(key, new loader_1.CSSLoader(resource, false, false));
            }
            else {
                this._loader.addResourceLoader(key, new loader_1.SimpleResourceLoader(resource, false, false));
            }
        }
        this._loader.load();
    }
    show() {
        if (this._elementInDom) {
            return;
        }
        document.body.appendChild(this._element);
        this._elementInDom = true;
    }
    hide() {
        if (!this._elementInDom) {
            return;
        }
        document.body.removeChild(this._element);
        this._elementInDom = false;
    }
    done() {
        this._loader.append();
        this.hide();
    }
    error() {
        if (this._errorShown) {
            return;
        }
        this._progressBarElement.setAttribute('style', 'width: 100%');
        this._progressBarElement.className = 'progress-bar bg-danger';
        if (this.errorMessage) {
            this._element.className = this._element.className + ' error';
            this._progressBarElement.appendChild(document.createTextNode(this.errorMessage));
        }
        this._errorShown = true;
    }
}
exports.default = ResourcesLoader;
