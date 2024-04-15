import './styles/PinButton.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbTack } from "@fortawesome/free-solid-svg-icons";  

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
  

export default PinButton;