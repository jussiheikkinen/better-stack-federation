import { pluginModuleFederation } from '@module-federation/rsbuild-plugin';
import path from 'path';

export default pluginModuleFederation({
  name: 'app-shell',
  remotes: {
    app1: `app_1@${process.env.REMOTE_APP1}/mf-manifest.json`,
    // appbar: `app_bar@${process.env.REMOTE_APPBAR}/mf-manifest.json`,
  },
  runtimePlugins: [
    path.resolve(__dirname, './src/utils/nodePlugin.ts'),
    path.resolve(__dirname, './src/utils/fallbackPlugin.ts'),
  ],
  shared: {
    react: { singleton: true },
    'react-dom': { singleton: true },
  },
  dts: true,
});
