import {danmuDb} from '@/db';

(async () => {
  const doc = await danmuDb.get('hello-world');
  console.log(doc);
})();
