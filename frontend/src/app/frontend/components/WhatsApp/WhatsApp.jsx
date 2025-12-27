import React, { useState, useEffect } from 'react';
import { FaWhatsapp } from 'react-icons/fa';

const WhatsApp = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const phoneNumber = '03032798007'; // Replace with your WhatsApp number
  const message = 'Hello! I have a question about your travel services.';
  
  // Check if mobile on component mount and window resize
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    // Initial check
    checkIfMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile);
    
    // Set initial visibility for mobile animation
    if (isMobile) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(true);
    }
    
    return () => window.removeEventListener('resize', checkIfMobile);
  }, [isMobile]);
  
  const handleClick = () => {
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  // Pulsing animation effect
  const [isPulsing, setIsPulsing] = useState(false);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setIsPulsing(true);
      setTimeout(() => setIsPulsing(false), 1000);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  // Mobile tap effect
  const [isTapped, setIsTapped] = useState(false);
  
  const handleTouchStart = () => {
    setIsTapped(true);
    setTimeout(() => setIsTapped(false), 200);
  };

  // Animation classes
  const buttonClasses = `
    bg-[#25D366] text-black w-14 h-14 rounded-full 
    flex items-center justify-center cursor-pointer shadow-lg 
    transform transition-all duration-300 
    ${isMobile ? 'active:scale-90' : 'hover:scale-110 hover:rotate-12'} 
    ${isPulsing ? 'animate-pulse' : ''}
    ${isTapped ? 'scale-90' : ''}
    ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}
  `;

  const tooltipClasses = `
    absolute ${isMobile ? 'bottom-0 right-16' : 'bottom-full right-0 mb-3'}
    w-48 p-2 bg-gray-800 text-white text-sm rounded-md 
    shadow-lg transition-opacity duration-300
    ${isMobile ? 'flex items-center' : ''}
  `;

  return (
    <div className={`fixed ${isMobile ? 'bottom-6 right-4' : 'bottom-8 right-8'} z-50`}>
      {/* Tooltip */}
      {isHovered && !isMobile && (
        <div className={tooltipClasses}>
          Chat with us on WhatsApp!
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-gray-800 transform rotate-45 translate-x-1/2 -translate-y-1/2"></div>
        </div>
      )}
      
      {/* Mobile tooltip */}
      {isMobile && isHovered && (
        <div className={tooltipClasses}>
          <div className="absolute -right-1 w-3 h-3 bg-gray-800 transform rotate-45 -translate-x-1/2"></div>
          Chat with us!
        </div>
      )}
      
      {/* WhatsApp Button */}
      <div 
        className={buttonClasses}
        onClick={handleClick}
        onMouseEnter={() => !isMobile && setIsHovered(true)}
        onMouseLeave={() => !isMobile && setIsHovered(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={() => setIsHovered(prev => !prev)}
        style={{
          transition: 'transform 0.3s, opacity 0.5s ease-out',
          ...(isMobile && {
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
          })
        }}
      >
        <FaWhatsapp className="text-3xl transform transition-transform duration-300 active:scale-125" />
      </div>
    </div>
  );
};

export default WhatsApp;
