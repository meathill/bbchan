import UserList from './views/user-list';
import UserEdit from './views/user-edit';
import ChangePassword from './views/change-password';

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
  {
    path: '/user/change-password',
    name: 'user.change-password',
    component: ChangePassword,
  }
];
