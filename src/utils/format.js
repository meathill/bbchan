import moment from 'moment';

export function rowItemFormatter(item) {
  const time = moment(item.get('ts') * 1000).format('Y-M-D H:mm:ss');
  return {
    ...item.toJSON(),
    id: item.id,
    model: item,
    time,
  };
}
