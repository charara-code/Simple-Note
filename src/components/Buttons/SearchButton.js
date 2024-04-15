import './styles/SearchButton.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';


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

  

export default SearchButton;