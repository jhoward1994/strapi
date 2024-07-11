import pluginPkg from '../../package.json';

import { PERMISSIONS } from './constants';
import getTrad from './utils/getTrad';
import { prefixPluginTranslations } from './utils/prefixPluginTranslations';

const name = pluginPkg.strapi.name;

export default {
  register(app) {
    // Create the plugin's settings section
    app.createSettingSection(
      {
        id: 'users-permissions',
        intlLabel: {
          id: '🐶',
          defaultMessage: 'API Access & Permissions',
        },
      },
      [
        {
          intlLabel: {
            id: '🛑',
            defaultMessage: 'API Roles',
          },
          id: 'roles',
          to: `users-permissions/roles`,
          Component: () => import('./pages/Roles'),
          permissions: PERMISSIONS.accessRoles,
        },
        {
          intlLabel: {
            id: '🛑',
            defaultMessage: 'API Providers',
          },
          id: 'providers',
          to: `users-permissions/providers`,
          Component: () => import('./pages/Providers'),
          permissions: PERMISSIONS.readProviders,
        },
        {
          intlLabel: {
            id: getTrad('HeaderNav.link.advancedSettings'),
            defaultMessage: 'Advanced Settings',
          },
          id: 'advanced-settings',
          to: `users-permissions/advanced-settings`,
          Component: () =>
            import('./pages/AdvancedSettings').then((mod) => ({
              default: mod.ProtectedAdvancedSettingsPage,
            })),
          permissions: PERMISSIONS.readAdvancedSettings,
        },
        // TODO rename Email Templates
        // TODO if we want to move this to a different section
        // That is very difficult with how plugins provide settings sections
        {
          intlLabel: {
            id: getTrad('HeaderNav.link.emailTemplates'),
            defaultMessage: 'Email templates',
          },
          id: 'email-templates',
          to: `users-permissions/email-templates`,
          Component: () =>
            import('./pages/EmailTemplates').then((mod) => ({
              default: mod.ProtectedEmailTemplatesPage,
            })),
          permissions: PERMISSIONS.readEmailTemplates,
        },
      ]
    );

    app.registerPlugin({
      id: 'users-permissions',
      name,
    });
  },
  bootstrap() {},
  async registerTrads({ locales }) {
    const importedTrads = await Promise.all(
      locales.map((locale) => {
        return import(`./translations/${locale}.json`)
          .then(({ default: data }) => {
            return {
              data: prefixPluginTranslations(data, 'users-permissions'),
              locale,
            };
          })
          .catch(() => {
            return {
              data: {},
              locale,
            };
          });
      })
    );

    return Promise.resolve(importedTrads);
  },
};
