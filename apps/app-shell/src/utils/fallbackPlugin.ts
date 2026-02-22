import type { ModuleFederationRuntimePlugin } from '@module-federation/enhanced/runtime';

const fallbackPlugin: () => ModuleFederationRuntimePlugin = () => ({
  name: 'fallback-plugin',
  errorLoadRemote(args) {
    const { lifecycle, id, error } = args;

    if (error) {
      console.warn(`Failed to load remote ${id} at ${lifecycle}:`, (error as Error)?.message || error);
    }

    switch (lifecycle) {
      case 'afterResolve':
        return {
          id: id || 'fallback',
          name: id || 'fallback',
          remoteEntry: '',
          metaData: {
            name: id || 'fallback',
            globalName: id || 'fallback',
            publicPath: '',
            type: 'module',
            getPublicPath: '',
            remoteEntry: { path: '', type: 'module', name: 'remoteEntry.js' },
            types: { path: '', name: '', zip: '', api: '' },
            buildInfo: { buildVersion: '0.0.0', buildName: id || 'fallback' },
          },
          shared: [],
          remotes: [],
          exposes: [],
        };

      case 'beforeRequest':
        console.warn(`Request processing failed for ${id}`);
        return void 0;

      case 'onLoad':
        return () => ({
          __esModule: true,
          default: () => 'Fallback Component',
        });

      case 'beforeLoadShare':
        console.warn(`Shared dependency loading failed for ${id}`);
        return () => ({
          __esModule: true,
          default: {},
        });

      default:
        console.warn(`Unknown lifecycle ${lifecycle} for ${id}`);
        return void 0;
    }
  },
});

export default fallbackPlugin;
