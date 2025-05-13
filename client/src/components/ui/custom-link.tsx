import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

interface CustomLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const CustomLink: React.FC<CustomLinkProps> = ({ href, children, className, onClick }) => {
  // Check if the link is internal (starts with / or #) or external
  const isInternalLink = href.startsWith('/') || href.startsWith('#');

  if (isInternalLink) {
    // For hash links (anchor links)
    if (href.startsWith('#')) {
      return (
        <a href={href} className={className} onClick={onClick}>
          {children}
        </a>
      );
    }
    
    // For internal app routes
    return (
      <RouterLink to={href} className={className} onClick={onClick}>
        {children}
      </RouterLink>
    );
  }
  
  // For external links
  return (
    <a 
      href={href} 
      className={className} 
      target="_blank" 
      rel="noopener noreferrer"
      onClick={onClick}
    >
      {children}
    </a>
  );
};
