import { FC } from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export const LoadingSpinner: FC<LoadingSpinnerProps> = ({ size = 'md', text = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className={`relative ${sizeClasses[size]}`}>
        {/* Outer ring */}
        <div className="absolute inset-0 border-4 border-gray-700 rounded-full"></div>
        
        {/* Animated ring */}
        <div className="absolute inset-0 border-4 border-transparent border-t-yellow-500 rounded-full animate-spin-slow"></div>
        
        {/* Inner glow */}
        <div className="absolute inset-1 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-full animate-pulse-slow"></div>
        
        {/* Center dot */}
        <div className="absolute inset-2 bg-yellow-500 rounded-full animate-pulse"></div>
      </div>
      
      {text && (
        <div className="text-center">
          <p className="text-gray-300 text-sm font-medium">{text}</p>
          <div className="flex space-x-1 mt-2 justify-center">
            <div className="w-1 h-1 bg-yellow-500 rounded-full animate-bounce"></div>
            <div className="w-1 h-1 bg-yellow-500 rounded-full animate-bounce delay-100"></div>
            <div className="w-1 h-1 bg-yellow-500 rounded-full animate-bounce delay-200"></div>
          </div>
        </div>
      )}
    </div>
  );
}; 