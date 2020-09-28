import { Sheet } from "@character/character";

export class Party<T extends Sheet<any>> {
    #members: Map<string, T>

    addMember(character: T) {
        this.#members.set("", character)
    }

    removeMember() {

    }
}