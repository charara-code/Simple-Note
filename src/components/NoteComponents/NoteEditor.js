import './styles/NoteEditor.css';
import  { useState, useEffect } from 'react';


function NoteEditor({ selectedNote, handleNoteChange}) {
    const [nbCharacters, setNbCharacters] = useState(0);
    const [font, setFont] = useState('Arial');
  
  
  
    
    const handleNbCharacters = (event) => {
      setNbCharacters(event.target.value.length);
    }
  
    const handleChange = (event) => { 
      handleNoteChange(event);
      handleNbCharacters(event);
    }
  
    // Update nbCharacters when selectedNote.content changes
    useEffect(() => {
      setNbCharacters(selectedNote.content.length);
      
      
    }, [selectedNote.content]);
    
    return (
      <div className="note-editor-wrapper">
        <textarea 
        className="Note-editor"
        value={selectedNote.content}
        onChange={handleChange}
        
        style={{ fontFamily: font }}
  
        
      />
      <div className="Note-editor-footer">
         Characters: {nbCharacters}  |  Font: 
        <select value={font} onChange={(e) => {setFont(e.target.value)}} className="Note-editor-select-font">
            
            <option value="Arial">Arial</option>
            <option value="Courier New">Courier New</option>
            <option value="Georgia">Georgia</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Verdana">Verdana</option>
            <option value="Comic Sans MS">Comic Sans MS</option>
            <option value="Impact">Impact</option>
            <option value="Lucida Console">Lucida Console</option>
            <option value="Tahoma">Tahoma</option>
            <option value="Trebuchet MS">Trebuchet MS</option>
            <option value="Palatino Linotype">Palatino Linotype</option>
            <option value="Garamond">Garamond</option>
            <option value="Bookman">Bookman</option>
            <option value="Avant Garde">Avant Garde</option>
            <option value="Century Gothic">Century Gothic</option>
            <option value="Copperplate">Copperplate</option>
            <option value="Brush Script MT">Brush Script MT</option>
            <option value="Courier">Courier</option>
            <option value="MS Sans Serif">MS Sans Serif</option>
            <option value="MS Serif">MS Serif</option>
            <option value="Symbol">Symbol</option>
          </select>
      </div>
  
      </div>
    );
  }

  
export default NoteEditor;