import "./App.css";
import { useEffect, useRef, useState } from "react";
import  CreateNoteButton  from "./components/Buttons/CreateNoteButton";
import  SearchButton  from "./components/Buttons/SearchButton";
import  SaveButton  from "./components/Buttons/SaveButton";
import  NoteButton  from "./components/Buttons/NoteButton";
import  Spinner  from "./components/Misc/Spinner";
import  UsernameDisplay from "./components/Misc/UsernameDisplay";
import  TitleInput  from "./components/NoteComponents/TitleInput";
import  NoteEditor  from "./components/NoteComponents/NoteEditor";
import  LoadMoreButton  from "./components/Buttons/LoadMoreButton";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [notes, setNotes] = useState(null);
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [selectedNote, setSelectedNote] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [username, setUsername] = useState("");
  const [saveTimeoutId, setSaveTimeoutId] = useState(null);
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(10);
  const asideRef = useRef();
  const [isLoadingMoreNotes, setIsLoadingMoreNotes] = useState(false);
 

  const fetchUsername = async () => {
    const response = await fetch("/profile");
    const data = await response.json();
    setUsername(data.name);
    
  };

  const fetchNotes = async () => {
    const response = await fetch(`/notes?_limit=${limit}&_start=${offset}`);
    const data = await response.json();
    const sortedData = data.sort((a, b) => b.isPinned - a.isPinned || new Date(b.lastUpdatedAt) - new Date(a.lastUpdatedAt));
    // add the new notes to the existing notes if notes is not null
    setNotes(sortedData);
    setOffset(offset + limit);
    
    setIsLoading(false);
  };

  const loadMoreNotes = async () => {
    // Store the current scroll position
    setIsLoadingMoreNotes(true);
    setOffset(offset + limit);
    //setIsLoading(true);
    const response = await fetch(`/notes?_limit=${limit}&_start=${offset}`);
    const data = await response.json();
    const newNotes = [...notes, ...data];
    const sortedData = newNotes.sort((a, b) => b.isPinned - a.isPinned || new Date(b.lastUpdatedAt) - new Date(a.lastUpdatedAt));
    setNotes(sortedData);
    
    
    setIsLoadingMoreNotes(false);

    
    
  };

  useEffect(() => {
    if (!isLoadingMoreNotes) {
      asideRef.current.scrollTop = asideRef.current.scrollHeight;
    }
  }, [ isLoadingMoreNotes] );

  
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
    
    if (event.target.value === selectedNote.content) { 
      return;
    } else {
      const newNote = selectedNote;
      newNote.content = event.target.value;
      setSelectedNote(newNote);
    }


    const noteButton = document.querySelector(".Note-button-selected");

    noteButton.style.color = `rgba(255, 255, 255, 0.5)`;
    
    
    if (saveTimeoutId) {
      clearTimeout(saveTimeoutId);
    }
  
    setSaveTimeoutId(setTimeout(() => {
      saveNote();
      noteButton.style.color = "white";
    }, 500));
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
    //setSelectedNote(updatedNote);
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
    //setSelectedNoteId(savedNote.id);
    //setSelectedNote(savedNote);
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
    const response = await fetch(`/notes/${noteId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      setNotes(notes.filter(note => note.id !== noteId));
      setSelectedNoteId(null);
      setSelectedNote(null);


    }
  };

  const sortNotes = async () => {
    setNotes(prevNotes => [...prevNotes].sort((a, b) => b.isPinned - a.isPinned || new Date(b.lastUpdatedAt) - new Date(a.lastUpdatedAt)));
    
  };

  const togglePin = async (noteId) => {
    const noteToToggle = notes.find((note) => note.id === noteId);
    noteToToggle.isPinned = !noteToToggle.isPinned;
    
    //setIsSaving(true);
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
    //setIsSaving(false);
  };

  const toggleDone = async (noteId) => {
    const noteToToggle = notes.find((note) => note.id === noteId);
    noteToToggle.isDone = !noteToToggle.isDone;
    
    //setIsSaving(true);
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
    //setIsSaving(false);
  }

  
  return (
    <>
      <aside className="Side" ref={asideRef}>
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
          ? <Spinner/>
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
          {isLoadingMoreNotes ? <Spinner/> : null}
        <LoadMoreButton
          loadMoreNotes={loadMoreNotes}
          isLoadingMoreNotes={isLoadingMoreNotes}
        />
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
              isSaving={isSaving} 
              saveNote={saveNote} 
            />
            
          </>
      )}
      </main>
    </>
  );
}

export default App;