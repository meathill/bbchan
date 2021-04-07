import { Object } from 'leancloud-storage';

export const LUCKY = 'lucky';

class Lucky extends Object {

}

Object.register(Lucky, LUCKY);

export default Lucky;
