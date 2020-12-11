import { ResourceLoader, ResourceLoaderStatus, ResourceLoaderUpdateCallback } from '.';
export default class MultiResourceLoader implements ResourceLoader {
    private _resourceLoaders;
    private _nbResourceLoaders;
    private _listeners;
    private _status;
    private _progress;
    addResourceLoader(key: string, resourceLoader: ResourceLoader): void;
    getResourceLoader(key: string): ResourceLoader | null;
    onUpdate(c: ResourceLoaderUpdateCallback): void;
    get status(): ResourceLoaderStatus;
    get progress(): number;
    get responseData(): any;
    abort(): void;
    load(): void;
    append(): void;
    dispatch(): void;
    refreshStatus(): void;
    refreshProgress(): void;
    private refreshNbResourceLoaders;
}
