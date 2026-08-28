import { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'recipe-ui-components',
  globalStyle: 'src/global/_variables.css',
  outputTargets: [
    // {
    //   type: 'dist',
    //   esmLoaderPath: '../loader',
    // },
    {
      type: 'dist-custom-elements',
      dir: 'dist/custom-elements',
      customElementsExportBehavior: 'auto-define-custom-elements',
      externalRuntime: false,
    },
    {
      type: 'docs-readme',
    },
    // {
    //   type: 'www',
    //   serviceWorker: null, // disable service workers
    // },
  ],
};
