import React, { type ComponentType, useEffect, useState } from 'react';

interface DynamicOptions {
  loading?: React.ReactNode;
  ssr?: boolean;
}

// We use a helper to check if we are in the browser
const isBrowser = typeof window !== 'undefined';

export function dynamic<T extends object>(
  loader: () => Promise<{ default: ComponentType<T> }>,
  options: DynamicOptions = {},
) {
  const { loading = null, ssr = true } = options;

  return function DynamicComponent(props: T) {
    // 1. Initialize state. If SSR is off, we must start with null.
    const [LoadedComponent, setComponent] = useState<ComponentType<T> | null>(null);
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
      setHasMounted(true);

      // Load the component immediately on mount
      loader()
        .then((mod) => {
          setComponent(() => mod.default);
        })
        .catch((err) => {
          console.error('Failed to load dynamic component:', err);
        });
    }, [loader]);

    // --- SSR Logic ---
    if (!isBrowser) {
      // If SSR is disabled, server returns loading.
      // If SSR is enabled, we still return loading here because
      // standard React components can't 'await' the loader on the server.
      return loading;
    }

    // --- Client Logic ---
    // If ssr: false, we MUST wait until hasMounted is true to avoid hydration mismatch.
    if (!ssr && !hasMounted) {
      return loading;
    }

    if (!LoadedComponent) {
      return loading;
    }

    return LoadedComponent ? React.createElement(LoadedComponent, props) : loading;
  };
}
