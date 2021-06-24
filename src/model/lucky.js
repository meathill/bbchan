import { Object } from 'leancloud-storage';

export const LUCKY = 'lucky';

export const STATUS_NORMAL = 0;
export const STATUS_CANCELED = 50;
export const STATUS_COMPLETED = 100;
export const STATUS_LABEL = {
  [STATUS_NORMAL]: '进行中',
  [STATUS_CANCELED]: '已取消',
  [STATUS_COMPLETED]: '已完成',
};
export const STATUS_STYLE = {
  [STATUS_NORMAL]: 'text-primary fw-bold fs-5',
  [STATUS_CANCELED]: 'text-muted',
  [STATUS_COMPLETED]: 'text-success',
};

export function formatLuck(model) {
  if (!model) {
    return null;
  }
  const {
    objectId,
    createdAt,
    updatedAt,
    owner,
    ...json
  } = model.toJSON();
  return json;
}

class Lucky extends Object {

}

Object.register(Lucky, LUCKY);

export default Lucky;
