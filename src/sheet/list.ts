import { applyTransaction } from "@datorama/akita";
import { Feature } from "@internal";

export function resolveWeights(list: Feature[], target?: Feature, newWeight?: number) {
    if (!list) return
    let arr = list.sort((a, b) => a.listWeight - b.listWeight);
    if (target && newWeight > -1 && list.some(feature => feature.id === target.id)) {
        arr.splice(newWeight, 0, arr.splice(target.listWeight, 1)[0]);
    }
    applyTransaction(
        () => {
            arr.forEach((item, i) => item.update(data => { data.keys.ui.listWeight = i }));
        }
    );
}