// import css from styles folder 

import "./styles/CreateNoteButton.css";



function CreateNoteButton({ createNote }) {
    return <button className="CreateNote-button" onClick={createNote}>+ New note</button>;
}


export default CreateNoteButton;