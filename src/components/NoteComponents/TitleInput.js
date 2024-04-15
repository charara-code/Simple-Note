
import './styles/TitleInput.css';

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

  

export default TitleInput;