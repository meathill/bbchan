import List from './views/lucky-list';
import Lucky from './views/lucky';

export default [
  {
    path: '/luckys',
    name: 'lucky.list',
    component: List,
  },

  {
    path: '/lucky/:id',
    name: 'lucky.edit',
    component: Lucky,
  },
  {
    path: '/lucky/new',
    name: 'lucky.new',
    component: Lucky,
  },
];
