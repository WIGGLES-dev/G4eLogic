import type { AbstractSystem } from "@internal";
import type { Remote } from "comlink";
export async function sync(this: Remote<AbstractSystem>) {
  try {
    const table = await this.getTable("index");
    const hash = table.reduce(
      (hash, entry) => Object.assign(hash, { [entry.id]: entry }),
      {}
    );
    const actors = [...game.actors];
    const items = [...game.items];
    const ownedActors = actors.filter((actor) => actor.permission === 3);
    const ownedItems = items.filter((item) => item.permission === 3);
    for (const entity of [...ownedActors, ...ownedItems]) {
      const entry = hash[entity.id];
      const entryTimestamp =
        entry?.__meta__?.lastEdit ?? Number.POSITIVE_INFINITY;
      if (entry?.id === entity?.id) {
        const entityTimestamp =
          entity?.data?.data?.__meta__?.lastEdit ?? Number.NEGATIVE_INFINITY;
        if (entryTimestamp > entityTimestamp) {
          entity.update({
            data: entry,
          });
        } else {
          const data = Object.assign({}, entity.data.data, {
            type: entity.data.type,
            id: entity.id,
          });
          this.update("index", entity.id, data);
        }
      } else {
        const data = Object.assign({}, entity.data.data, {
          type: entity.data.type,
          id: entity.id,
        });
        this.add("index", data, entity.id);
      }
    }
  } catch (err) {
    setTimeout(sync.bind(this), 1000);
  }
}
