export interface ContextLayerGatherer {
    getContext(query: string): any[];
}
export declare class FileContextLayer implements ContextLayerGatherer {
    private filePath;
    constructor(filePath: string);
    getContext(query: string): any[];
}
export declare class DatabaseContextLayer implements ContextLayerGatherer {
    private dbQuery;
    constructor(dbQuery: string);
    getContext(query: string): any[];
}
//# sourceMappingURL=layer-gatherers.d.ts.map