export type ResourceLoaderStatus = 'waiting' | 'pending' | 'done' | 'error' | 'canceled'

export type ResourceLoaderUpdateCallback = (l: ResourceLoader) => void

export interface ResourceLoader {
    status: ResourceLoaderStatus
    progress: number
    readonly responseData: any | null
    load (): void
    abort (): void
    append (): void
    onUpdate (l: ResourceLoaderUpdateCallback): void
}
