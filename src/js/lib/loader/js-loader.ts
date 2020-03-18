import SimpleResourceLoader from './simple-resource-loader'

export default class JSLoader extends SimpleResourceLoader {
    doAppend = () => {
        const script = document.createElement('script')
        script.type = 'text/javascript'
        script.appendChild(document.createTextNode(this.responseData))

        document.body.appendChild(script)
    }
}
