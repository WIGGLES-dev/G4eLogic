export class State {
    stateStack: Set<stateChange> = new Set()
    currentState: stateChange = {
        undo() { },
        redo() { }
    }

    constructor() {

    }

    addState(state: stateChange) {
        this.stateStack.add(state);
        this.currentState = state;
    }

    iterStack() { return Array.from(this.stateStack) }

    getStateIndex(state: stateChange) {
        return this.iterStack().indexOf(state);
    }
    private getNextState(state?: stateChange) {
        return this.iterStack()[this.getStateIndex(state || this.currentState) + 1] || this.popState()
    }
    private getPreviousState(state?: stateChange) {
        return this.iterStack()[this.getStateIndex(state || this.currentState) - 1] || this.unshiftState()
    }

    unshiftState() {
        return this.iterStack().shift() || {
            undo() { },
            redo() { }
        }
    }
    popState() {
        return this.iterStack().pop() || {
            undo() { },
            redo() { }
        }
    }

    undo(depth: number = 1) {
        while (depth > 0) {
            this.undoOne();
            depth--
        }
    }
    redo(depth: number = 1) {
        while (depth > 0) {
            this.redoOne();
            depth--
        }
    }

    private undoOne() {
        this.currentState?.undo();
        this.currentState = this.getPreviousState(this.currentState)
    }
    private redoOne() {
        this.currentState?.redo();
        this.currentState = this.getNextState(this.currentState);
    }
}

type stateChange = {
    undo: () => void
    redo: () => void
}