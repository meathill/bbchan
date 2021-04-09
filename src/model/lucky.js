import { Object } from 'leancloud-storage';

export const LUCKY = 'lucky';

export const STATUS_NORMAL = 0;
export const STATUS_CANCELED = 50;
export const STATUS_COMPLETED = 100;
export const STATUS_LABEL = {
  [STATUS_NORMAL]: '进行中',
  [STATUS_CANCELED]: '取消',
  [STATUS_COMPLETED]: '已完成',
};

class Lucky extends Object {

}

Object.register(Lucky, LUCKY);

export default Lucky;
