export const setNotes = (notes) => {
  // Добавляем проверку, чтобы гарантировать, что notes всегда массив
  return {
    type: 'SET_NOTES',
    payload: Array.isArray(notes) ? notes : [],
  };
};

export const addNote = (note) => ({
  type: 'ADD_NOTE',
  payload: note,
});

export const updateNote = (note) => ({
  type: 'UPDATE_NOTE',
  payload: note,
});

export const deleteNote = (id) => ({
  type: 'DELETE_NOTE',
  payload: id,
});
