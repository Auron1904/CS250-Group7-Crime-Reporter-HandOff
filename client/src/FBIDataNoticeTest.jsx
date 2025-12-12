
import { useState, useEffect } from "react";
import "./Styles/FBIDataNotice.css";

export default function FBIDataNotice() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Check if user has dismissed the notice before
    const dismissed = localStorage.getItem('fbiNoticeDismissed');
    if (dismissed === 'true') {
      setIsVisible(false);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('fbiNoticeDismissed', 'true');
  };

  if (!isVisible) return null;

  return (
    <div className="fbi-notice-container">
      <div className="fbi-notice-icon">
        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      </div>
      <div className="fbi-notice-content">
        <h3 className="fbi-notice-title">FBI Crime Data Not Yet Available</h3>
        <p className="fbi-notice-text">
          Official FBI crime statistics integration is currently out of scope for this release. 
          All crime reports shown are user-submitted and unverified. 
          For official crime data, please contact SDSU Police Department at (619) 594-1991.
        </p>
      </div>
      <button 
        className="fbi-notice-dismiss" 
        onClick={handleDismiss}
        aria-label="Dismiss notice"
        title="Dismiss this notice"
      >
        ×
      </button>
    </div>
  );
}