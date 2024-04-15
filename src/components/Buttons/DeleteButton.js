
import './styles/DeleteButton.css'
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

function DeleteButton({ note, deleteNote }) {
    const [showDialog, setShowDialog] = useState(false);
  
    const handleDialogClick = (event) => {
      event.stopPropagation();
      setShowDialog(false);
    };
  
    const handleButtonClick = (event, action) => {
      event.stopPropagation();
      if (action === 'delete') {
        deleteNote(note.id);
      }
      setShowDialog(false);
    };
  
    useEffect(() => {
      const handleKeyDown = (event) => {
        if (event.key === 'Escape') {
          setShowDialog(false);
        }
      };
  
      document.addEventListener('keydown', handleKeyDown);
  
      // Clean up the event listener when the component unmounts
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }, []);
  
  
    return (
      <>
      <button
        className="Delete-button"
        onClick={(event) => {
          event.stopPropagation(); // Prevent the note button's onClick from being called
          setShowDialog(true);
        }}
      >
        <FontAwesomeIcon icon={faTrash} className="Trashcan-icon"/>
      </button>
      {showDialog && (
          <div className="delete-note-dialog" onClick={handleDialogClick}>
            
            <div className="delete-dialog-buttons" onClick={(event) => event.stopPropagation()}>
            <h2>Are you sure you want to delete this note?</h2>
             <div className="delete-buttons-wrapper">
                <button className="Confirm-deletion-button" onClick={(event) => handleButtonClick(event, 'delete')}>Yes, delete</button>
                <button className="Cancel-deletion-button" onClick={(event) => handleButtonClick(event, 'cancel')}>No, cancel</button>
             </div>
            </div>
          </div>
        )}
    </>
    );
  }


export default DeleteButton;
  