import { Resource } from "@internal";
import { Resolver } from '@ui/fieldConfig';

export const deleteResource = {
    label: 'Delete',
    callback(this: Resource) { this.delete() },
    show(this: Resource) { return true }
}
export const makeContainer = {
    label: 'Make Container',
    callback: new Resolver((src: Resource) => () => src.updateRegistry({ canContainChildren: true })),
    show: new Resolver((src: Resource) => () => src.getMetadata().canContainChildren !== true),
}
export const undoMakeContainer = {
    label: 'Undo Make Container',
    callback: new Resolver((src: Resource) => () => src.eject()),
    show: new Resolver((src: Resource) => () => src.getMetadata().canContainChildren === true),
}