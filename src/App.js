import "./App.css";
import { useEffect, useState } from "react";
import { Button } from "./components/Button/Button";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { faThumbTack } from "@fortawesome/free-solid-svg-icons";  

// Cycle de vie du composant App :
// Initialement : `notes` vaut `null`, donc pas d'affichage dans le header
// Après le rendu initial : lancement de la requête au serveur (GET /notes)
// À la réponse du serveur : `notes` devient la réponse du serveur, rafraîchissement de l'affichage

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

    setNotes(data);
    setIsLoading(false);
    if (notes) {
      sortNotes();
    }
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
    setNotes([newNote, ...notes]);
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
    const response = await fetch(`/notes/${selectedNoteId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(selectedNote),
      
    });
    const updatedNote = await response.json();
    setNotes(notes.map((note) => (note.id === updatedNote.id ? updatedNote : note)));
    setIsSaving(false);
    if (notes) {
      // modify the lastUpdatedAt property of the note
      
      notes.find((note) => note.id === selectedNoteId).lastUpdatedAt = new Date();

      sortNotes();
    }
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
    setNotes(notes.sort((a, b) => b.isPinned - a.isPinned || new Date(b.lastUpdatedAt) - new Date(a.lastUpdatedAt)));    
  }

  const pinNote = async (noteId) => {
    const noteToPin = notes.find((note) => note.id === noteId);
    const response = await fetch(`/notes/${noteId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        isPinned: !noteToPin.isPinned, // Toggle the isPinned property
      }),
    });
    const pinnedNote = await response.json();
    setNotes(notes.map((note) => (note.id === pinnedNote.id ? pinnedNote : note)));
    if (notes) {
      sortNotes();
    }
  };
  
  
  return (
    <>
      <aside className="Side">
        <div className="Create-note-wrapper">
          <Button onClick={createNote}>+ New note</Button>
        </div>
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
        {isLoading
          ? "Loading…"
          : notes?.filter((note) => note.title.toLowerCase().includes(searchTerm.toLowerCase()) || note.content.toLowerCase().includes(searchTerm.toLowerCase()))
          .map((note) => (
            <div className="Note-container" key={note.id}>
            <button
              className={`Note-button ${
                selectedNoteId === note.id ? "Note-button-selected" : ""
              }`}
              onClick={() => {
                setSelectedNoteId(note.id);
              }}
            >
              {note.title}
            </button>
            <button
              className="Pin-button"
              onClick={(event) => {
                event.stopPropagation(); // Prevent the note button's onClick from being called
                pinNote(note.id);
              }}
            />
            <FontAwesomeIcon icon={faThumbTack} className="Pin-icon" />
            <button
              className="Delete-button"
              onClick={(event) => {
                event.stopPropagation(); // Prevent the note button's onClick from being called
                deleteNote(note.id);
              }}
            >
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </div>
          ))}
      </aside>
      <main className="Main">
        {selectedNote && (
          <>
            {isEditingTitle ? (
              <input
                className="Note-title Note-title-editing"
                value={editedTitle}
                onChange={handleTitleChange}
                onBlur={handleTitleBlur}
                autoFocus
              />
            ) : (
              <h1 className="Note-title" onDoubleClick={handleTitleDoubleClick}>{selectedNote.title}</h1>
            )}
            <textarea 
            className="Note-editor"
            value={selectedNote.content} 
            onChange={handleNoteChange} 
            />
            <button className="Save-button" onClick={saveNote} disabled={isSvaing}>
              {isSvaing ? "Saving…" : "Save"}
            </button>
            
          </>
      )}
      </main>
    </>
  );
}

export default App;