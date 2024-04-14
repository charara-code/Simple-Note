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
function NoteButton({ note, selectedNoteId, setSelectedNoteId }) {
  return (
    <button
      className={`Note-button ${
        selectedNoteId === note.id ? "Note-button-selected" : ""
      }`}
      onClick={() => {
        setSelectedNoteId(note.id);
      }}
    >
      {note.title.length > 17 ? `${note.title.slice(0, 17)}...` : note.title}
    </button>
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
  return (
    <button
      className="Delete-button"
      onClick={(event) => {
        event.stopPropagation(); // Prevent the note button's onClick from being called
        deleteNote(note.id);
      }}
    >
      <FontAwesomeIcon icon={faTrash} className="Trashcan-icon"/>
    </button>
  );
}

// SaveButton.js
function SaveButton({ isSaving, saveNote }) {

  const [saveStatus, setSaveStatus] = useState("Save");

  useEffect( () => {
    if (isSaving) {
      setSaveStatus("Saving...");
    } else {
      setSaveStatus("Saved! 🎉");
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
function TitleInput({ isEditingTitle, editedTitle, handleTitleChange, handleTitleBlur, handleTitleDoubleClick, selectedNote }) {
  return isEditingTitle ? (
    <input
      className="Note-title Note-title-editing"
      value={editedTitle}
      onChange={handleTitleChange}
      onBlur={handleTitleBlur}
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

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [notes, setNotes] = useState(null);
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [selectedNote, setSelectedNote] = useState(null);
  const [isSvaing, setIsSaving] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [searchTerm, setSearchTerm] = useState('');



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
    
  };

  const saveNote = async () => {
    setIsSaving(true);
    const updatedNote = {
      ...selectedNote,
      lastUpdatedAt: new Date(),
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

  
  return (
    <>
      <aside className="Side">
        <div className="Create-note-wrapper">
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
              />
              <PinButton 
                note={note} 
                togglePin={togglePin} 
              />
              <DeleteButton 
                note={note} 
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