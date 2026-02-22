import type React from 'react';
import { dynamic } from '../utils/dynamic';

interface RemoteAppBarProps {
  className?: string;
}

const RemoteAppBar = dynamic<RemoteAppBarProps>(() => import('appbar/App'), {
  loading: (
    <div className="animate-pulse bg-blue-100 h-12 rounded flex items-center justify-center">Loading AppBar...</div>
  ),
  ssr: false,
});

const RemoteAppBarComponent: React.FC<RemoteAppBarProps> = ({ className }) => {
  return <RemoteAppBar className={className} />;
};

export default RemoteAppBarComponent;
