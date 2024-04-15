import "./App.css";
import { useEffect, useState } from "react";
import { Button } from "./components/Button/Button";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { faThumbTack } from "@fortawesome/free-solid-svg-icons";  



function CreateNoteButton({ createNote }) {
  return <button className="CreateNote-button" onClick={createNote}>+ New note</button>;
}

function SearchButton({ searchTerm, setSearchTerm }) {
  return (
    <div className="Search-wrapper">
      <FontAwesomeIcon icon={faSearch} className="Search-icon" />
      <input
        className="Search-input"
        placeholder="Search…"
        value={searchTerm}
        type="text"
        onChange={(event) => setSearchTerm(event.target.value)}
      />
    </div>
  );
}

// NoteButton.js
function NoteButton({ note, selectedNoteId, setSelectedNoteId, toggleDone , togglePin, deleteNote}) {
  return (
    <div className="Note-button-wrapper">
      <button
      className={`Note-button ${
        selectedNoteId === note.id ? "Note-button-selected" : ""
      } ${note.isDone ? "Note-button-done" : ""}`}
      onClick={() => {
        setSelectedNoteId(note.id);
      }}
      onDoubleClick={() => {
        toggleDone(note.id);
      }}
    >
    <PinButton note={note} togglePin={togglePin} />
      {note.title.length > 15 ? `${note.title.slice(0, 15)}...` : note.title}
    <DeleteButton note={note} deleteNote={deleteNote} />
    <div className="note-date-display">{`${new Date(note.lastUpdatedAt).toLocaleDateString()} ${new Date(note.lastUpdatedAt).toLocaleTimeString()}`}</div>
    <div className="note-preview">
      {note.content.length > 20 ? `${note.content.slice(0, 20)}...` : note.content}
    </div>
    </button>
    
    
    </div>
  );
}


// PinButton.js
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
//import { faThumbTack } from "@fortawesome/free-solid-svg-icons";  

function PinButton({ note, togglePin }) {
  return (
    <button
      className="Pin-button"
      onClick={(event) => {
        event.stopPropagation(); // Prevent the note button's onClick from being called
        togglePin(note.id);
      }}
    >
      <FontAwesomeIcon icon={faThumbTack} className={`${note.isPinned ? 'Pin-icon-pinned' : 'Pin-icon-unpinned'}`} />
    </button>
  );
}

// DeleteButton.js
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
//import { faTrash } from '@fortawesome/free-solid-svg-icons';

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

// SaveButton.js
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

// TitleInput.js
function TitleInput({ isEditingTitle, editedTitle, handleTitleChange, handleTitleBlur, handleTitleDoubleClick, selectedNote, handleKeyDown }) {

  

  return isEditingTitle ? (
    <input
      className="Note-title Note-title-editing"
      value={editedTitle}
      onChange={handleTitleChange}
      onBlur={handleTitleBlur}
      onKeyDown={handleKeyDown}
      autoFocus
    />
  ) : (
    <h1 className="Note-title" onDoubleClick={handleTitleDoubleClick}>
      {selectedNote.title.length > 50 ? `${selectedNote.title.slice(0, 50)}...` : selectedNote.title}
    </h1>
  );

}

function NoteEditor({ selectedNote, handleNoteChange }) {
  return (
    <textarea 
      className="Note-editor"
      value={selectedNote.content} 
      onChange={handleNoteChange} 
    />
  );
}

// UsernameDisplay.js
function UsernameDisplay({ username }) {
  return <div className="Username-display">User: {username}</div>;
}

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [notes, setNotes] = useState(null);
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [selectedNote, setSelectedNote] = useState(null);
  const [isSvaing, setIsSaving] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [username, setUsername] = useState("");
  const [saveTimeoutId, setSaveTimeoutId] = useState(null);
  

  const fetchUsername = async () => {
    const response = await fetch("/profile");
    const data = await response.json();
    setUsername(data.name);
    
  };

  const fetchNotes = async () => {
    const response = await fetch("/notes");
    const data = await response.json();

    const sortedData = data.sort((a, b) => b.isPinned - a.isPinned || new Date(b.lastUpdatedAt) - new Date(a.lastUpdatedAt));
    setNotes(sortedData);
    setIsLoading(false);

    
    
  };

  const createNote = async () => {
    const response = await fetch("/notes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: "New note",
        content: "",
        lastUpdatedAt: new Date(),
        isPinned: false,
        isDone: false,
      }),
    });
    const newNote = await response.json();
    const updatedNotes = [...notes, newNote];
    updatedNotes.sort((a, b) => b.isPinned - a.isPinned || new Date(b.lastUpdatedAt) - new Date(a.lastUpdatedAt));
    setNotes(updatedNotes);
    setSelectedNoteId(newNote.id);
    setSelectedNote(newNote);
  };

  useEffect(() => {
    fetchNotes();
    fetchUsername();
  }, []);

  useEffect(() => {
    if (notes && selectedNoteId) {
      const note = notes.find((note) => note.id === selectedNoteId);
      setSelectedNote(note);
    }
  }, [notes, selectedNoteId]);

  

  const handleNoteChange = (event) => {
    setSelectedNote({
      ...selectedNote,
      content: event.target.value,
    });

    
    
    if (saveTimeoutId) {
      clearTimeout(saveTimeoutId);
    }
  
    setSaveTimeoutId(setTimeout(() => {
      saveNote();
      
    }, 3000));
  };

  useEffect(() => {
    return () => {
      if (saveTimeoutId) {
        clearTimeout(saveTimeoutId);
      }
    };
  }, []);

  const saveNote = async () => {
    setIsSaving(true);
    const updatedNote = {
      ...selectedNote,
      // if savetimeoutid is null then the note is being saved by the user
      lastUpdatedAt: saveTimeoutId ? new Date() : selectedNote.lastUpdatedAt,
    };
    setSelectedNote(updatedNote);
    const response = await fetch(`/notes/${selectedNoteId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedNote),
    });
    const savedNote = await response.json();
    const updatedNotes = notes.map((note) => (note.id === savedNote.id ? savedNote : note));
    setNotes([...updatedNotes.sort((a, b) => b.isPinned - a.isPinned || new Date(b.lastUpdatedAt) - new Date(a.lastUpdatedAt))]);
    setSelectedNoteId(savedNote.id);
    setSelectedNote(savedNote);
    setIsSaving(false);
};

  const handleTitleDoubleClick = () => {
    setEditedTitle(selectedNote.title);
    setIsEditingTitle(true);
  };
  
  const handleTitleChange = (event) => {
    setEditedTitle(event.target.value);
  };

  const handleTitleEnterKey = (event) => {
    if (event.key === "Enter") {
      handleTitleBlur();
    }

  };
  
  const handleTitleBlur = () => {
    selectedNote.title = editedTitle;
    setIsEditingTitle(false);

    saveNote();
  };

  const deleteNote = async (noteId) => {
    if (selectedNote) {
      const response = await fetch(`/notes/${noteId}`, {
        method: "DELETE",
      });
  
      if (response.ok) {
        setNotes(notes.filter(note => note.id !== noteId));
        setSelectedNoteId(null);
      }
    }
  };

  const sortNotes = async () => {
    setNotes(prevNotes => [...prevNotes].sort((a, b) => b.isPinned - a.isPinned || new Date(b.lastUpdatedAt) - new Date(a.lastUpdatedAt)));
    
  };

  const togglePin = async (noteId) => {
    const noteToToggle = notes.find((note) => note.id === noteId);
    noteToToggle.isPinned = !noteToToggle.isPinned;
    
    setIsSaving(true);
    const response = await fetch(`/notes/${noteId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(noteToToggle),
    });
  
    const updatedNote = await response.json();
    setNotes(notes.map((note) => (note.id === updatedNote.id ? updatedNote : note)));
    sortNotes();
    setIsSaving(false);
  };

  const toggleDone = async (noteId) => {
    const noteToToggle = notes.find((note) => note.id === noteId);
    noteToToggle.isDone = !noteToToggle.isDone;
    
    setIsSaving(true);
    const response = await fetch(`/notes/${noteId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(noteToToggle),
    });
  
    const updatedNote = await response.json();
    setNotes(notes.map((note) => (note.id === updatedNote.id ? updatedNote : note)));
    //sortNotes();
    setIsSaving(false);
  }

  
  return (
    <>
      <aside className="Side">
        <div className="Create-note-wrapper">
          <UsernameDisplay 
            username={username} 
          />
          <CreateNoteButton 
            createNote={createNote} 
          />
        </div>
        <SearchButton 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm} 
        />
        {isLoading
          ? "Loading…"
          : notes?.filter(
            (note) => note.title.toLowerCase().includes(searchTerm.toLowerCase()) || note.content.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((note) => (
            <div className="Note-container" key={note.id}>
              <NoteButton 
                note={note} 
                selectedNoteId={selectedNoteId} 
                setSelectedNoteId={setSelectedNoteId} 
                toggleDone={toggleDone}
                togglePin={togglePin}
                deleteNote={deleteNote}
              />
            </div>
          ))}
      </aside>
      <main className="Main">
        {selectedNote && (
          <>
            <TitleInput
              isEditingTitle={isEditingTitle}
              editedTitle={editedTitle}
              handleTitleChange={handleTitleChange}
              handleTitleBlur={handleTitleBlur}
              handleTitleDoubleClick={handleTitleDoubleClick}
              selectedNote={selectedNote}
              handleKeyDown={handleTitleEnterKey}
            />
            <NoteEditor 
              selectedNote={selectedNote} 
              handleNoteChange={handleNoteChange} 
            />
            <SaveButton 
              isSaving={isSvaing} 
              saveNote={saveNote} 
            />
            
          </>
      )}
      </main>
    </>
  );
}

export default App;