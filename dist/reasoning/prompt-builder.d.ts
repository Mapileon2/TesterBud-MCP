import { ContextLayerGatherer } from '../context/layer-gatherers';
import { ModeManager } from './mode-manager';
export declare class PromptBuilder {
    private contextFormatter;
    private modeManager;
    private contextLayers;
    constructor(modeManager: ModeManager, contextLayers: ContextLayerGatherer[]);
    buildPrompt(userQuery: string): Promise<string>;
}
//# sourceMappingURL=prompt-builder.d.ts.map