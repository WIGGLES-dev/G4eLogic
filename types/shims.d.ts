declare module 'worker-loader!*' {
    export class WebpackWorker extends Worker {
        constructor()
    }
}
declare module '*!shared-worker' {
    export default class WebpackSharedWorker extends SharedWorker {
        constructor()
    }
}
declare module '*!worker' {
    export class WebpackWorker extends Worker {
        constructor()
    }
}
declare module '*.png' {
    const value: string
    export default value
}
declare module '*.svg' {
    const value: string
    export default value
}
declare module '*.yaml' {
    const content: Record<string, any>
    export default content
}