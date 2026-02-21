import { pluginModuleFederation } from '@module-federation/rsbuild-plugin';

export default pluginModuleFederation({
  name: 'app-shell',
  remotes: {
    app1: `app_1@${process.env.REMOTE_APP1}`,
    appbar: `app_bar@${process.env.REMOTE_APPBAR}`,
  },
  shared: {
    react: { singleton: true },
    'react-dom': { singleton: true },
  },
  dts: true,
});