import PouchDB from 'pouchdb-browser';

export const danmuDb = PouchDB('danmu', {
  revs_limit: 0,
});
