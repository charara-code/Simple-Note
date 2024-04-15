


export const fetchUsernameCall = async () => {
  try {
    //throw new Error("Failed to fetch username (experimental error, please ignore)");
    const response = await fetch("/profile");
    const data = await response.json();
    return data.name;
  } catch (error) {
    return { error: error.message };
  }
};

export const fetchNotesCall = async (limit, offset) => {
  try {
    const response = await fetch(`/notes?_limit=${limit}&_start=${offset}`);
    const data = await response.json();
    return data;
  } catch (error) {
    return { error: error.message };
  }
};

export const createNoteCall = async (note) => {
  try {
    const response = await fetch("/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(note),
      });
      const newNote = await response.json();
      return newNote;
  } catch (error) {
    return { error: error.message };
  } 
};

export const updateNoteCall = async (noteId, updatedNote) => {
    try {
        const response = await fetch(`/notes/${noteId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedNote),
          });
          const savedNote = await response.json();
          return savedNote;
    } catch (error) {
        return { error: error.message };
    }
};

export const deleteNoteCall = async (noteId) => {
  try {
    const response = await fetch(`/notes/${noteId}`, {
        method: "DELETE",
      });
      return response.ok;
  } catch (error) {
    return { error: error.message };
  }
};

export const togglePinCall = async (noteId, noteToToggle) => {
    try {
        const response = await fetch(`/notes/${noteId}`, {
            method: "PUT",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify(noteToToggle),
        });
        const updatedNote = await response.json();
        return updatedNote;
    } catch (error) {
        return { error: error.message };
    }
}

export const toggleDoneCall = async (noteId, noteToToggle) => {
    try {
        const response = await fetch(`/notes/${noteId}`, {
            method: "PUT",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify(noteToToggle),
        });
        const updatedNote = await response.json();
        return updatedNote;
    } catch (error) {
        return { error: error.message };
    }
}

export const loadMoreNotesCall = async (limit, offset) => {
    try {
        const response = await fetch(`/notes?_limit=${limit}&_start=${offset}`);
        const data = await response.json();
        return data;
    } catch (error) {
        return { error: error.message };
    }
}