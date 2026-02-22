import type React from 'react';
import { dynamic } from '../utils/dynamic';

interface RemoteApp1Props {
  className?: string;
}

const RemoteApp1 = dynamic<RemoteApp1Props>(() => import('app1/App'), {
  loading: (
    <div className="animate-pulse bg-green-100 h-12 rounded flex items-center justify-center">
      Loading Remote App 1...
    </div>
  ),
  ssr: false,
});

const RemoteApp1Component: React.FC<RemoteApp1Props> = ({ className }) => {
  return <RemoteApp1 className={className} />;
};

export default RemoteApp1Component;
