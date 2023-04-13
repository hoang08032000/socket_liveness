import React from 'react';
import {
  InformationCircleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationCircleIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/solid';

interface Map {
  [key: string]: any;
}

const BACKGROUNDS: Map = {
  info: 'bg-blue-600',
  success: 'bg-green-600',
  danger: 'bg-red-600',
  warning: 'bg-yellow-500',
};

const colors: Map = {
  info: 'text-blue-600',
  success: 'text-green-600',
  danger: 'text-red-600',
  warning: 'text-yellow-500',
};

const ICONS: Map = {
  info: InformationCircleIcon,
  success: CheckCircleIcon,
  danger: XCircleIcon,
  warning: ExclamationCircleIcon,
};

interface Props {
  visibility: boolean;
  level?: string;
  message?: string;
}

export default function Alert({ visibility = false, level, message }: Props) {
  const textColor = React.useMemo(() => colors[level || 'info'], [level]);
  const bgColor = React.useMemo(() => BACKGROUNDS[level || 'info'], [level]);
  const Icon = React.useMemo(() => ICONS[level || 'info'], [level]);

  function handleRetryClick() {
    window.location.reload();
  }

  return (
    <section
      className={`absolute w-full h-full flex flex-col justify-center items-center ${bgColor} ${
        visibility ? '' : 'hidden'
      }`}
    >
      <article className="w-full max-w-xs flex flex-col justify-center items-center gap-5">
        <div className={`rounded-full p-5 bg-gray-50 ${textColor}`}>
          <Icon className="h-10 w-10" />
        </div>
        <div className='mb-2'>
          <p className="mb-2 text-md text-gray-50">
            <span className="font-semibold">{message || 'Alert'}</span>
          </p>
          {/* <p className="text-xs">{message}</p> */}
        </div>
        <button
          className={`focus:ring-1 focus:outline-none focus:ring-gray-900 text-sm px-5 py-2.5 text-center flex items-center bg-gray-50 ${textColor}`}
          onClick={handleRetryClick}
        >
          {/* <ArrowPathIcon className="h-6 w-6 mr-2" /> */}
          <span>Retry</span>
        </button>
      </article>
    </section>
  );
}
