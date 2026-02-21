import { pluginModuleFederation } from '@module-federation/rsbuild-plugin';

export default pluginModuleFederation({
  name: 'app_bar',
  exposes: {
    './App': './src/App.tsx',
  },
  shared: {
    react: { singleton: true },
    'react-dom': { singleton: true },
  },
  dts: true,
});
