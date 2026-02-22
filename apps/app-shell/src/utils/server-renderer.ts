import fs from 'node:fs';
import path from 'node:path';
import { Writable } from 'node:stream';
import type { RsbuildDevServer } from '@rsbuild/core';
import type { Context } from 'hono';
import { stream } from 'hono/streaming';
import type { PipeableStream } from 'react-dom/server';

interface ServerBundle {
  // Updated: render now returns the pipeable stream object
  render: (pathname: string) => Promise<PipeableStream>;
}

interface Manifest {
  entries: {
    index: {
      initial: {
        js?: string[];
        css?: string[];
      };
      async?: {
        js?: string[];
        css?: string[];
      };
    };
  };
}

/**
 * Creates a server-side rendering handler with shared logic
 *
 * @param templateHtml - HTML template string with placeholders
 * @param loadBundle - Async function that returns the server bundle
 * @param getManifest - Optional function that returns manifest JSON string
 * @returns Hono middleware function for rendering requests
 */
export const createServerRenderer = (
  templateHtml: string,
  loadBundle: () => Promise<ServerBundle>,
  getManifest: () => string | null = () => null,
) => {
  return async (c: Context) => {
    // 1. Force the header immediately at the start of the request
    c.header('Content-Type', 'text/html; charset=utf-8');

    const bundle = await loadBundle();
    const pathname = c.req.path;
    const streamInstance = await bundle.render(pathname);

    let headContent = '';
    const manifestData = getManifest();
    if (manifestData) {
      try {
        const { entries } = JSON.parse(manifestData) as Manifest;
        const { js = [], css = [] } = entries.index.initial;
        const { js: asyncJs = [], css: asyncCss = [] } = entries.index.async || {};
        
        // Include both initial and async CSS files
        const allCss = [...css, ...asyncCss];
        const allJs = [...js, ...asyncJs];
        
        const scriptTags = allJs.map((file) => `<script src="${file}" defer></script>`).join('\n');
        const styleTags = allCss.map((file) => `<link rel="stylesheet" href="${file}">`).join('\n');
        headContent = `${styleTags}\n${scriptTags}`;
      } catch {
        /* manifest error fallback */
      }
    }

    // 2. Ensure these markers match exactly what is in your index.html
    const htmlWithHead = templateHtml.replace('<!--app-head-->', headContent);
    const [templateStart, templateEnd] = htmlWithHead.split('<!--app-content-->');

    return stream(c, async (honoStream) => {
      // 3. Write the opening HTML
      await honoStream.write(templateStart);

      await new Promise((resolve, reject) => {
        const writableBridge = new Writable({
          write(chunk, _encoding, callback) {
            honoStream
              .write(chunk)
              .then(() => callback())
              .catch(callback);
          },
          final(callback) {
            // 4. Write the closing HTML when React finishes
            honoStream
              .write(templateEnd)
              .then(() => callback())
              .catch(callback);
          },
        });

        writableBridge.on('finish', resolve);
        writableBridge.on('error', reject);

        // Start the engine
        streamInstance.pipe(writableBridge);
      });
    });
  };
};

/**
 * Creates a development server renderer with hot-reloading support
 *
 * @param serverAPI - Rsbuild development server instance
 * @param templateHtml - HTML template string
 * @returns Hono middleware function for development rendering
 */
export const createDevRenderer = (serverAPI: RsbuildDevServer, templateHtml: string) => {
  return createServerRenderer(
    templateHtml,
    async () => {
      const indexModule = (await serverAPI.environments.node.loadBundle('index')) as ServerBundle;
      return indexModule;
    },
    () => {
      try {
        // In development, try to read from the expected dist location
        return fs.readFileSync('./dist/manifest.json', 'utf-8');
      } catch {
        return null;
      }
    },
  );
};

/**
 * Creates a production server renderer for static bundles
 *
 * @param templateHtml - HTML template string
 * @returns Hono middleware function for production rendering
 */
export const createProdRenderer = (templateHtml: string) => {
  return createServerRenderer(
    templateHtml,
    async () => {
      const remotesPath = path.join(process.cwd(), `./dist/server/index.js`);
      const module = await import(remotesPath);
      return module.default || module;
    },
    () => {
      try {
        return fs.readFileSync('./dist/manifest.json', 'utf-8');
      } catch {
        return null;
      }
    },
  );
};
