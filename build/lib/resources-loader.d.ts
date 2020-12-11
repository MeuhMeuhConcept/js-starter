export default class ResourcesLoader {
    private _loader;
    private _element;
    private _progressBarElement;
    private _elementInDom;
    private _errorShown;
    errorMessage: string | null;
    constructor();
    addResources(resources: {
        [key: string]: string;
    }): void;
    show(): void;
    hide(): void;
    done(): void;
    error(): void;
}
