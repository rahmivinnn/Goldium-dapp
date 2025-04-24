import React from 'react';

interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: boolean;
  centered?: boolean;
}

export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  className = '',
  maxWidth = 'xl',
  padding = true,
  centered = true,
}) => {
  // Get max width class
  const getMaxWidthClass = () => {
    switch (maxWidth) {
      case 'xs':
        return 'max-w-xs';
      case 'sm':
        return 'max-w-sm';
      case 'md':
        return 'max-w-md';
      case 'lg':
        return 'max-w-lg';
      case 'xl':
        return 'max-w-xl';
      case '2xl':
        return 'max-w-2xl';
      case 'full':
        return 'max-w-full';
      default:
        return 'max-w-xl';
    }
  };
  
  return (
    <div 
      className={`
        w-full 
        ${getMaxWidthClass()} 
        ${padding ? 'px-4 sm:px-6 md:px-8' : ''} 
        ${centered ? 'mx-auto' : ''} 
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default ResponsiveContainer;
