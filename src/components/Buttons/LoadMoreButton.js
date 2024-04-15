
import './styles/LoadMoreButton.css';

function LoadMoreButton({ loadMoreNotes, isLoadingMoreNotes }) {
    return (
      <div className="Load-more-button-container">
        <button 
        className="Load-more-button" 
        onClick={loadMoreNotes}
        disabled={isLoadingMoreNotes}
        >
          Show more
        </button>
      </div>
    );
  }

  

export default LoadMoreButton;