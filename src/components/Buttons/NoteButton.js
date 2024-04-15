
import './styles/NoteButton.css'
import PinButton from './PinButton';
import DeleteButton from './DeleteButton';

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
        { note.content.length > 20 ? `${note.content.slice(0, 20)}...` : note.content}
      </div>
      </button>
      
      
      </div>
    );
  }


export default NoteButton;
  