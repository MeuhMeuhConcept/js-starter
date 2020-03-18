import SimpleResourceLoader from './simple-resource-loader'

export default class CSSLoader extends SimpleResourceLoader {

    doAppend = () => {
        const style = document.createElement('style')
        style.appendChild(document.createTextNode(this.responseData))
        let head = document.head
        if (!head) {
            head = document.createElement('head')
            document.appendChild(head)
        }

        head.appendChild(style)
    }
}
