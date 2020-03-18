import { ResourceLoader, ResourceLoaderStatus, ResourceLoaderUpdateCallback } from '.'

export default class SimpleResourceLoader implements ResourceLoader {
    private _xhr: XMLHttpRequest | null = null
    private _url: string = ''
    private _listeners: ResourceLoaderUpdateCallback[] = []

    private _responseStatus: number | null = null
    private _responseTextStatus: string = ''
    private _responseData: any | null = null

    protected _status: ResourceLoaderStatus = 'waiting'
    protected _progress: number = 0

    private isAppend: boolean = false
    private autoAppend: boolean = true

    get status () {
        return this._status
    }

    get progress () {
        return this._progress
    }

    get responseStatus () {
        return this._responseStatus
    }

    get responseTextStatus () {
        return this._responseTextStatus
    }

    get responseData () {
        return this._responseData
    }

    constructor (url: string, autoLoad: boolean = true, autoAppend: boolean = true) {
        this._url = url

        this.autoAppend = autoAppend

        if (autoLoad) {
            this.load()
        }
    }

    onUpdate (c: ResourceLoaderUpdateCallback) {
        this._listeners.push(c)
    }

    abort () {
        if (this._xhr) {
            this._xhr.abort()
        }
    }

    load () {
        this.abort()

        this._status = 'pending'

        this._xhr = new XMLHttpRequest()
        this._xhr.onprogress = this.callbackProgress
        this._xhr.onerror = this.callbackFail
        this._xhr.onload = this.callbackDone
        this._xhr.onabort = this.callbackAbort

        this._xhr.open('GET', this._url, true)
        this._xhr.send(null)

        this.dispatch()
    }

    callbackDone = (event: ProgressEvent) => {
        if (!this._xhr) {
            return
        }

        this._responseStatus = this._xhr.status
        this._responseTextStatus = this._xhr.statusText
        this._responseData = this._xhr.responseText

        this._progress = 100
        this._status = this._xhr.status === 200 ? 'done' : 'error'

        this._xhr = null

        this.dispatch()
    }

    callbackFail = (event: ProgressEvent) => {
        if (!this._xhr) {
            return
        }

        this._responseStatus = this._xhr.status
        this._responseTextStatus = this._xhr.statusText
        this._responseData = this._xhr.responseText

        this._progress = 100
        this._status = 'error'

        this._xhr = null

        this.dispatch()
    }

    callbackProgress = (event: ProgressEvent) => {
        if (event.lengthComputable) {
            this._progress = Math.ceil(100 * event.loaded / event.total)
        }

        this.dispatch()
    }

    callbackAbort = (event: ProgressEvent) => {
        if (!this._xhr) {
            return
        }

        this._progress = 100
        this._status = 'canceled'

        this._xhr = null

        this.dispatch()
    }

    dispatch () {
        for (let c of this._listeners) {
            c(this)
        }

        if (this.autoAppend && this.status === 'done') {
            this.append()
        }
    }

    append () {
        if (this.status !== 'done' || this.isAppend) {
            return
        }

        this.doAppend()

        this.isAppend = true
    }

    doAppend () {
        // Do nothing
    }
}
