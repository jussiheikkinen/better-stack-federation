import { Suspense } from 'react';
import { renderToPipeableStream } from 'react-dom/server';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';

export default function render(url: string) {
  // This function must return the object containing .pipe()
  return renderToPipeableStream(
    <ErrorBoundary>
      <Suspense fallback={<div>Loading...</div>}>
        <App req={{ url }} />
      </Suspense>
    </ErrorBoundary>,
    {
      onShellReady() {
        console.log('Shell is ready');
      },
      onAllReady() {
        console.log('All content is ready');
      },
      onError(err) {
        console.error('SSR Error:', err);
      },
    },
  );
}
