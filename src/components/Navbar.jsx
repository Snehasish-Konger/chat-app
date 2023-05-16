import React, { useContext } from 'react';
import { logout } from '../appwrite';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { currentUser } = useContext(AuthContext);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  return (
    <div className="navbar">
      <span className="logo">Ping Me</span>
      {currentUser && (
        <div className="user">
          <img src={currentUser.photoURL} alt="" />
          <span>{currentUser.displayName}</span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
};

export default Navbar;
