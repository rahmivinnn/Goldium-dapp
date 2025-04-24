import React from 'react';
import { useSound } from './sound-manager';

interface LoadingButtonProps {
  isLoading: boolean;
  onClick: () => void;
  loadingText?: string;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'goldium' | 'skyblue' | 'outline' | 'ghost';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
}

export const LoadingButton: React.FC<LoadingButtonProps> = ({
  isLoading,
  onClick,
  loadingText = 'Loading...',
  children,
  className = '',
  disabled = false,
  type = 'button',
  variant = 'primary',
  size = 'md',
  icon,
}) => {
  const { playSound } = useSound();
  
  // Get button variant class
  const getVariantClass = () => {
    switch (variant) {
      case 'goldium':
        return 'btn-goldium';
      case 'skyblue':
        return 'btn-skyblue';
      case 'secondary':
        return 'btn-secondary';
      case 'outline':
        return 'btn-outline';
      case 'ghost':
        return 'btn-ghost';
      default:
        return 'btn-primary';
    }
  };
  
  // Get button size class
  const getSizeClass = () => {
    switch (size) {
      case 'xs':
        return 'btn-xs';
      case 'sm':
        return 'btn-sm';
      case 'lg':
        return 'btn-lg';
      default:
        return '';
    }
  };
  
  const handleClick = () => {
    if (!disabled && !isLoading) {
      playSound('click');
      onClick();
    }
  };
  
  const handleMouseEnter = () => {
    if (!disabled && !isLoading) {
      playSound('hover');
    }
  };
  
  return (
    <button
      type={type}
      className={`btn ${getVariantClass()} ${getSizeClass()} ${className} ${isLoading ? 'loading' : ''}`}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      disabled={disabled || isLoading}
    >
      {isLoading ? (
        <span>{loadingText}</span>
      ) : (
        <>
          {icon && <span className="mr-2">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
};

export default LoadingButton;
