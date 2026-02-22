import type { ModuleFederationRuntimePlugin } from '@module-federation/runtime/types';

export default function (): ModuleFederationRuntimePlugin {
  return {
    name: 'node-internal-plugin',
    beforeInit(args: { userOptions: any; options: any; origin: any; shareInfo: any }) {
      const { userOptions, options } = args;
      if (!options.inBrowser) {
        console.log('Server-side, disabling remotes');
        userOptions.remotes = [];
        options.remotes = [];
      }
      return args;
    },
    init(args: { options: any; origin: any }) {
      return args;
    },
    beforeRequest(args: { id: string; options: any; origin: any }) {
      return args;
    },
  };
}
