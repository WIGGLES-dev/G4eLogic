import { Sheet } from "@character/character";

export class Party<T extends Sheet> {
    #members: Map<string, T>

    addMember(character: T) {
        this.#members.set("", character)
    }

    removeMember() {

    }
}