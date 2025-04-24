import React from 'react';

interface ResponsiveGridProps {
  children: React.ReactNode;
  className?: string;
  columns?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  className = '',
  columns = {
    xs: 1,
    sm: 2,
    md: 3,
    lg: 4,
    xl: 4,
  },
  gap = 'md',
}) => {
  // Get columns classes
  const getColumnsClasses = () => {
    const { xs = 1, sm, md, lg, xl } = columns;
    
    return `
      grid-cols-${xs}
      ${sm ? `sm:grid-cols-${sm}` : ''}
      ${md ? `md:grid-cols-${md}` : ''}
      ${lg ? `lg:grid-cols-${lg}` : ''}
      ${xl ? `xl:grid-cols-${xl}` : ''}
    `;
  };
  
  // Get gap class
  const getGapClass = () => {
    switch (gap) {
      case 'none':
        return 'gap-0';
      case 'xs':
        return 'gap-2';
      case 'sm':
        return 'gap-3';
      case 'lg':
        return 'gap-6';
      case 'xl':
        return 'gap-8';
      default:
        return 'gap-4'; // md
    }
  };
  
  return (
    <div 
      className={`
        grid 
        ${getColumnsClasses()} 
        ${getGapClass()} 
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default ResponsiveGrid;
