import { Dexie } from 'dexie';
export const db = new Dexie('Valor');
const stores = {
    'index': 'id,type'
};
db.version(1).stores(stores);