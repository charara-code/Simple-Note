import './styles/SaveButton.css';
import { useState, useEffect } from "react";


function SaveButton({ isSaving, saveNote }) {

    const [saveStatus, setSaveStatus] = useState("Save");
  
    useEffect( () => {
      if (isSaving) {
        setSaveStatus("Saving...");
      } else {
        setSaveStatus("Saved!");
        setTimeout(() => 
          setSaveStatus("Save"), 500
        );
      }
    } , [isSaving])
  
    return (
      <button className="Save-button" onClick={saveNote} disabled={isSaving}>
        {saveStatus}
      </button>
    );
  }

export default SaveButton;