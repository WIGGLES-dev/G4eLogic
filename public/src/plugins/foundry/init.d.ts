import { IDatabaseChange } from 'dexie-observable/api';
export declare function handleFoundryEvent(event: FoundryEvent): Promise<void>;
export declare function handleValorEvent(change: IDatabaseChange): Promise<void>;
