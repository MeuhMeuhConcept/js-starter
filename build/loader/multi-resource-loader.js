"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MultiResourceLoader {
    constructor() {
        this._resourceLoaders = {};
        this._nbResourceLoaders = 0;
        this._listeners = [];
        this._status = 'waiting';
        this._progress = 0;
    }
    addResourceLoader(key, resourceLoader) {
        if (!this._resourceLoaders[key]) {
            this._resourceLoaders[key] = resourceLoader;
            resourceLoader.onUpdate((l) => {
                this.refreshStatus();
                this.refreshProgress();
            });
        }
        this.refreshNbResourceLoaders();
    }
    getResourceLoader(key) {
        if (this._resourceLoaders[key]) {
            return this._resourceLoaders[key];
        }
        return null;
    }
    onUpdate(c) {
        this._listeners.push(c);
    }
    get status() {
        return this._status;
    }
    get progress() {
        return this._progress;
    }
    get responseData() {
        const datas = {};
        for (let key in this._resourceLoaders) {
            datas[key] = this._resourceLoaders[key].responseData;
        }
        return datas;
    }
    abort() {
        for (let key in this._resourceLoaders) {
            this._resourceLoaders[key].abort();
        }
    }
    load() {
        for (let key in this._resourceLoaders) {
            if (this._resourceLoaders[key].status !== 'done') {
                this._resourceLoaders[key].load();
            }
        }
        if (!this._nbResourceLoaders) {
            this._status = 'done';
            this.dispatch();
        }
    }
    append() {
        for (let key in this._resourceLoaders) {
            this._resourceLoaders[key].append();
        }
    }
    dispatch() {
        for (let c of this._listeners) {
            c(this);
        }
    }
    refreshStatus() {
        const resourceLoadersByStatus = {
            'waiting': 0,
            'pending': 0,
            'canceled': 0,
            'error': 0,
            'done': 0
        };
        for (let key in this._resourceLoaders) {
            resourceLoadersByStatus[this._resourceLoaders[key].status]++;
        }
        let prevStatus = this._status;
        if (resourceLoadersByStatus['error'] > 0) {
            this._status = 'error';
        }
        else if (resourceLoadersByStatus['done'] === this._nbResourceLoaders) {
            this._status = 'done';
        }
        else if (resourceLoadersByStatus['canceled'] === this._nbResourceLoaders) {
            this._status = 'canceled';
        }
        else if (resourceLoadersByStatus['pending'] > 0) {
            this._status = 'pending';
        }
        else {
            this._status = 'waiting';
        }
        if (prevStatus !== this._status) {
            this.dispatch();
        }
    }
    refreshProgress() {
        let prevProgress = this._progress;
        if (!this._nbResourceLoaders) {
            this._progress = 100;
        }
        else {
            let progress = 0;
            for (let key in this._resourceLoaders) {
                progress += this._resourceLoaders[key].progress;
            }
            this._progress = Math.round(progress / this._nbResourceLoaders);
        }
        if (prevProgress !== this._progress) {
            this.dispatch();
        }
    }
    refreshNbResourceLoaders() {
        this._nbResourceLoaders = 0;
        for (let key in this._resourceLoaders) {
            this._nbResourceLoaders++;
        }
    }
}
exports.default = MultiResourceLoader;
