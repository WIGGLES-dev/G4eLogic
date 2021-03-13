declare module 'worker-loader!*' {
    class WebpackWorker extends Worker {
        constructor();
    }
    export default WebpackWorker;
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