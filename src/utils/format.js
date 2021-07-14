import moment from 'moment';
import {
  STATUS_CANCELED,
  STATUS_COMPLETED,
  STATUS_LABEL,
  STATUS_NORMAL,
} from "@/model/lucky";

export function rowItemFormatter(item) {
  const time = moment(item.get('ts') * 1000).format('Y-M-D H:mm:ss');
  return {
    ...item.toJSON(),
    id: item.id,
    model: item,
    time,
  };
}

export function getStatusInfo(status) {
  const statusLabel = STATUS_LABEL[status];
  switch (status) {
    case STATUS_NORMAL:
      return {
        statusLabel,
        statusClass: 'bg-info',
      };

    case STATUS_CANCELED:
      return {
        statusLabel,
        statusClass: 'bg-secondary',
      }

    case STATUS_COMPLETED:
      return {
        statusLabel,
        statusClass: 'bg-success',
      };
  }
}
