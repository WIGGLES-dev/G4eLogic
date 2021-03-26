import type { System } from "@internal";
import type { Remote } from "comlink";
export declare function sync(this: Remote<typeof System>): Promise<void>;
