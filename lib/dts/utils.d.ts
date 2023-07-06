type StringMap = Record<string, string>;
export declare function findScript(url: string, attributes?: StringMap): HTMLScriptElement | null;
export interface ScriptElement {
    url: string;
    attributes?: StringMap;
    onSuccess: () => void;
    onError: OnErrorEventHandler;
}
export declare function insertScriptElement({ url, attributes, onSuccess, onError, }: ScriptElement): void;
export declare function objectToQueryString(params: StringMap): string;
export {};
