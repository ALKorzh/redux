// services/userService.js
export const getUserFromLocalStorage = () => {
  return JSON.parse(localStorage.getItem('user'));
};

export const saveUserToLocalStorage = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
};
