//-----
// This is the root of the admin panel - all frontend UI is rendered through this call to renderAdmin.

// The only higher level is
// packages/core/strapi/src/node/staticFiles.ts
// packages/core/strapi/src/node/develop.ts
// packages/core/strapi/src/node/build.ts
// That respond to node scripts (yarn develop, build etc) and grab the "renderAdmin" for use in the static file entry points.

// We have core plugins defined through imports in this file.
// With extended strapi plugins passed in through the `plugins` prop.

// Go here to see external plugins loading implementation
// packages/core/strapi/src/node/core/plugins.ts
//-----

import { RenderAdminArgs, renderAdmin } from '@strapi/admin/strapi-admin';
import contentTypeBuilder from '@strapi/content-type-builder/strapi-admin';
import contentManager from '@strapi/content-manager/strapi-admin';
import email from '@strapi/email/strapi-admin';
// @ts-expect-error – No types, yet.
import upload from '@strapi/upload/strapi-admin';
import i18n from '@strapi/i18n/strapi-admin';
import contentReleases from '@strapi/content-releases/strapi-admin';
import reviewWorkflows from '@strapi/review-workflows/strapi-admin';

const render = (mountNode: HTMLElement | null, { plugins, ...restArgs }: RenderAdminArgs) => {
  return renderAdmin(mountNode, {
    ...restArgs,
    plugins: {
      'content-manager': contentManager,
      'content-type-builder': contentTypeBuilder,
      // @ts-expect-error – TODO: fix this
      email,
      upload,
      // @ts-expect-error – TODO: fix this, the "types" folder has it wrong.
      contentReleases,
      i18n,
      // @ts-expect-error – TODO: fix this, the "types" folder has it wrong.
      reviewWorkflows,

      // Strapi has been extended with the plugins passed in through the "plugins" prop.
      ...plugins,
    },
  });
};

export { render as renderAdmin };
export type { RenderAdminArgs };

export * from '@strapi/admin/strapi-admin';
