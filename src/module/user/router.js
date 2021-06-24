import UserList from './views/user-list';
import UserEdit from './views/user-edit';

export default [
  {
    path: '/users',
    name: 'user.list',
    component: UserList,
  },

  {
    path: '/user/:id',
    name: 'user.edit',
    component: UserEdit,
  },
  {
    path: '/user/new',
    name: 'user.new',
    component: UserEdit,
  },
];
