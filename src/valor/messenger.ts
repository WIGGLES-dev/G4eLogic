import { Valor, FeatureType, EntityType } from "@internal";

export enum ValorEvent {
    Create = "create",
    Update = "update",
    Delete = "delete",
    Embed = 'embed',

    Roll = "roll"
}
export interface ValorMessage {
    event: ValorEvent
    type: FeatureType | EntityType
    id?: string
    user?: string
    merge?: any
    [key: string]: any
}
export function valorPostMessage(message: ValorMessage) {
    if (!window) return
    window.opener?.postMessage(message, "*");
    Valor.channel.postMessage(message);
}