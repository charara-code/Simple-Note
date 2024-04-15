import React, { useState } from 'react';
import './styles/ErrorDialog.css';

function ErrorDialog({ errorMessage }) {
    const [isVisible, setIsVisible] = useState(true);

    const handleDismiss = () => {
        setIsVisible(false);
    }

    if (errorMessage === '' || !isVisible) {
        return null;
    }

    // disable the background when the error message is shown
    return (
        <div className="error-dialog-overlay">
            <div className="error-message">
                {errorMessage}
                <button 
                  onClick={handleDismiss}
                  className='error-dialog-dismiss-button'
                >
                  Dismiss
                </button>
            </div>
        </div>
    );
}

export default ErrorDialog;