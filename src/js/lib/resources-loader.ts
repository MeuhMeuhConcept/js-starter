import { MultiResourceLoader, SimpleResourceLoader, CSSLoader, JSLoader, ResourceLoader } from './loader'

export default class ResourcesLoader {

    private _loader: MultiResourceLoader
    private _element: Element
    private _contentElement?: Element
    private _progressBarElement: Element
    private _elementInDom: boolean = false
    private _errorShown: boolean = false

    public errorMessage: string | null = null

    constructor (contentId?: string) {
        this._loader = new MultiResourceLoader()

        if (contentId) {
            this._contentElement = document.getElementById(contentId) as Element
        }

        this._loader.onUpdate((l: ResourceLoader) => {
            this.show()

            if (l.status === 'done') {
                this.done()
                return
            } else if (l.status === 'error') {
                this.error()
                return
            }
            this._progressBarElement.setAttribute('style', `width: ${l.progress}%`)
        })

        this._element = document.createElement('div')
        this._element.className = 'resources-loader-layout'

        const box = document.createElement('div')
        box.className = 'resources-loader-box'

        const indicator = document.createElement('div')
        indicator.className = 'resources-loader-indicator'

        const progress = document.createElement('div')
        progress.className = 'progress resources-loader-progress'

        this._progressBarElement = document.createElement('div')
        this._progressBarElement.className = 'progress-bar bg-primary'
        this._progressBarElement.setAttribute('style', 'width: 0%')

        progress.appendChild(this._progressBarElement)
        indicator.appendChild(progress)
        box.appendChild(indicator)
        this._element.appendChild(box)
    }

    addResources (resources: {[key: string]: string}) {
        for (let key in resources) {
            let resource = resources[key]
            if (/\.js$/.test(resource)) {
                this._loader.addResourceLoader(key, new JSLoader(resource, false, false))
            } else if (/\.css$/.test(resource)) {
                this._loader.addResourceLoader(key, new CSSLoader(resource, false, false))
            } else {
                this._loader.addResourceLoader(key, new SimpleResourceLoader(resource, false, false))
            }
        }

        this._loader.load()
    }

    show () {
        if (this._elementInDom) {
            return
        }

        if (this._contentElement) {
            this._contentElement.setAttribute('style', 'display: none')
        }

        document.body.appendChild(this._element)
        this._elementInDom = true
    }

    hide () {
        if (!this._elementInDom) {
            return
        }

        if (this._contentElement) {
            this._contentElement.removeAttribute('style')
        }

        document.body.removeChild(this._element)
        this._elementInDom = false
    }

    done () {
        this._loader.append()

        this.hide()
    }

    error () {
        if (this._errorShown) {
            return
        }

        this._progressBarElement.setAttribute('style', 'width: 100%')
        this._progressBarElement.className = 'progress-bar bg-danger'

        if (this.errorMessage) {
            this._element.className = this._element.className + ' error'
            this._progressBarElement.appendChild(document.createTextNode(this.errorMessage))
        }

        this._errorShown = true
    }
}
