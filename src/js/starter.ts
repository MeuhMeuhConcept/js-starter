require('../css/starter.scss')

import ResourcesLoader from './lib/resources-loader'

declare global {
    interface Window {
        __ENV__: any
    }
}

const resourcesLoader = new ResourcesLoader('app')
resourcesLoader.errorMessage = 'Oups...'
resourcesLoader.addResources(window.__ENV__.resources)
