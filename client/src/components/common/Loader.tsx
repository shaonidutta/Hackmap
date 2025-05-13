import React from 'react';

interface LoaderProps {
  fullScreen?: boolean;
  size?: 'small' | 'medium' | 'large';
  color?: 'blue' | 'white' | 'gray';
  text?: string;
}

const Loader: React.FC<LoaderProps> = ({
  fullScreen = false,
  size = 'medium',
  color = 'blue',
  text
}) => {
  // Determine size class
  const sizeClass = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8',
    large: 'h-12 w-12'
  }[size];

  // Determine color class
  const colorClass = {
    blue: 'text-blue-600',
    white: 'text-white',
    gray: 'text-gray-600'
  }[color];

  const loader = (
    <div className={`flex flex-col items-center justify-center ${fullScreen ? 'fixed inset-0 bg-white bg-opacity-75 z-50' : ''}`}>
      <svg
        className={`animate-spin ${sizeClass} ${colorClass}`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      {text && <p className={`mt-2 text-sm font-medium ${colorClass}`}>{text}</p>}
    </div>
  );

  return loader;
};

export default Loader;
