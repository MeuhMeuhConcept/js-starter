import { ResourceLoader, ResourceLoaderStatus, ResourceLoaderUpdateCallback } from '.'

export default class MultiResourceLoader implements ResourceLoader {
    private _resourceLoaders: {[key: string]: ResourceLoader} = {}
    private _nbResourceLoaders: number = 0
    private _listeners: ResourceLoaderUpdateCallback[] = []

    private _status: ResourceLoaderStatus = 'waiting'
    private _progress: number = 0

    addResourceLoader (key: string, resourceLoader: ResourceLoader) {
        if (!this._resourceLoaders[key]) {
            this._resourceLoaders[key] = resourceLoader
            resourceLoader.onUpdate((l: ResourceLoader) => {
                this.refreshStatus()
                this.refreshProgress()
            })
        }

        this.refreshNbResourceLoaders()
    }

    getResourceLoader (key: string): ResourceLoader | null {
        if (this._resourceLoaders[key]) {
            return this._resourceLoaders[key]
        }

        return null
    }

    onUpdate (c: ResourceLoaderUpdateCallback) {
        this._listeners.push(c)
    }

    get status (): ResourceLoaderStatus {
        return this._status
    }

    get progress (): number {
        return this._progress
    }

    get responseData (): any {
        const datas: {[key: string]: any} = {}
        for (let key in this._resourceLoaders) {
            datas[key] = this._resourceLoaders[key].responseData
        }

        return datas
    }

    abort (): void {
        for (let key in this._resourceLoaders) {
            this._resourceLoaders[key].abort()
        }
    }

    load (): void {
        for (let key in this._resourceLoaders) {
            if (this._resourceLoaders[key].status !== 'done') {
                this._resourceLoaders[key].load()
            }
        }

        if (!this._nbResourceLoaders) {
            this._status = 'done'
            this.dispatch()
        }
    }

    append (): void {
        for (let key in this._resourceLoaders) {
            this._resourceLoaders[key].append()
        }
    }

    dispatch () {
        for (let c of this._listeners) {
            c(this)
        }
    }

    refreshStatus () {
        const resourceLoadersByStatus = {
            'waiting': 0,
            'pending': 0,
            'canceled': 0,
            'error': 0,
            'done': 0
        }

        for (let key in this._resourceLoaders) {
            resourceLoadersByStatus[this._resourceLoaders[key].status] ++
        }

        let prevStatus = this._status

        if (resourceLoadersByStatus['error'] > 0) {
            this._status = 'error'
        } else if (resourceLoadersByStatus['done'] === this._nbResourceLoaders) {
            this._status = 'done'
        } else if (resourceLoadersByStatus['canceled'] === this._nbResourceLoaders) {
            this._status = 'canceled'
        } else if (resourceLoadersByStatus['pending'] > 0) {
            this._status = 'pending'
        } else {
            this._status = 'waiting'
        }

        if (prevStatus !== this._status) {
            this.dispatch()
        }
    }

    refreshProgress () {
        let prevProgress = this._progress

        if (!this._nbResourceLoaders) {
            this._progress = 100
        } else {
            let progress = 0
            for (let key in this._resourceLoaders) {
                progress += this._resourceLoaders[key].progress
            }

            this._progress = Math.round(progress / this._nbResourceLoaders)
        }

        if (prevProgress !== this._progress) {
            this.dispatch()
        }
    }

    private refreshNbResourceLoaders () {
        this._nbResourceLoaders = 0
        for (let key in this._resourceLoaders) {
            this._nbResourceLoaders++
        }
    }
}
