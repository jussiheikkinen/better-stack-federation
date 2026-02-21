import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import LicenseWebpackPlugin from 'webpack-license-plugin';
import mfConfig from './module-federation.config';

export default defineConfig({
  server: {
    port: 3002,
  },
  output: {
    assetPrefix: process.env.ASSET_PREFIX,
  },
  plugins: [pluginReact(), mfConfig],
  tools: {
    rspack: (config) => {
      config.plugins.push(
        new LicenseWebpackPlugin({
          outputFilename: 'licenses.txt',
        }),
      );
      return config;
    },
  },
});
