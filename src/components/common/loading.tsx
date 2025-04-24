import React from 'react';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  fullScreen?: boolean;
}

export const Loading: React.FC<LoadingProps> = ({ 
  size = 'md', 
  text = 'Loading...', 
  fullScreen = false 
}) => {
  const sizeClass = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
  }[size];
  
  const content = (
    <div className="flex flex-col items-center justify-center">
      <div className={`loading loading-spinner text-goldium-500 ${sizeClass}`}></div>
      {text && <p className="mt-4 text-center">{text}</p>}
    </div>
  );
  
  if (fullScreen) {
    return (
      <div className="loading-overlay">
        {content}
      </div>
    );
  }
  
  return content;
};

export const PageLoading: React.FC = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Loading size="lg" text="Loading page..." />
    </div>
  );
};

export const ButtonLoading: React.FC = () => {
  return <span className="loading loading-spinner loading-xs"></span>;
};

export default Loading;
