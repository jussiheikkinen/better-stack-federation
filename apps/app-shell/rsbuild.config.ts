import { defineConfig, loadEnv } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import mfConfig from './module-federation.config';

const { publicVars } = loadEnv();

export default defineConfig({
  logLevel: process.env.NODE_ENV === 'production' ? 'warn' : 'info',
  plugins: [pluginReact()],
  dev: { hmr: false },
  source: {
    define: publicVars,
  },
  server: {
    port: 3000,
  },
  environments: {
    web: {
      plugins: [mfConfig],
      source: {
        entry: {
          index: './src/index.client',
        },
      },
      output: {
        manifest: true,
      },
      performance: {
        removeConsole: process.env.NODE_ENV === 'production',
        chunkSplit: {
          strategy: 'split-by-experience',
        },
        ...(process.env.ANALYZE === 'true' && {
          bundleAnalyze: {
            analyzerMode: 'static',
            openAnalyzer: false,
            reportFilename: '../bundle-report.html',
          },
        }),
      },
    },
    node: {
      output: {
        module: true,
        target: 'node',
        distPath: {
          root: 'dist/server',
        },
      },
      source: {
        entry: {
          index: './src/index.server',
        },
      },
    },
  },
  tools: {
    htmlPlugin: false,
    rspack: (config) => {
      // This is the direct fix for the "webpackHotUpdate" collision
      config.output!.uniqueName = 'better_stack_shell';
    },
  },
  html: {
    template: './template.html',
    templateParameters: {
      title: 'Better Auth App',
    },
  },
});
