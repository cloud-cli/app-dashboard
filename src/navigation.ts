import Help from './components/Help.vue';
import Settings from './components/Settings.vue';

export default [
  {
    path: '/settings',
    name: 'Settings',
    icon: 'settings',
    component: Settings
  },
  {
    path: '/help',
    name: 'Help',
    icon: 'help_outline',
    component: Help
  },
];

