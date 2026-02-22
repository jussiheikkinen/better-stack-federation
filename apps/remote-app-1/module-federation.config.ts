import { pluginModuleFederation } from '@module-federation/rsbuild-plugin';

export default pluginModuleFederation({
  name: 'app_1',
  exposes: {
    './App': './src/App.tsx',
  },
  shared: {
    react: { singleton: true },
    'react-dom': { singleton: true },
  },
  dts: true,
});
