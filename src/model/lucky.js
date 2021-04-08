import { Object } from 'leancloud-storage';

export const LUCKY = 'lucky';

export const STATUS_NORMAL = 0;
export const STATUS_COMPLETE = 100;

class Lucky extends Object {

}

Object.register(Lucky, LUCKY);

export default Lucky;
