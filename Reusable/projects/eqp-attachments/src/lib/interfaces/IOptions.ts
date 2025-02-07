/**
 * Interfaccia presa dal pacchetto "browser-image-compression" per specificare le opzioni di compressione
 */
export interface IOptions {
    /** @default Number.POSITIVE_INFINITY */
    maxSizeMB?: number;
    /** @default undefined */
    maxWidthOrHeight?: number;
    /** @default false */
    useWebWorker?: boolean;
}