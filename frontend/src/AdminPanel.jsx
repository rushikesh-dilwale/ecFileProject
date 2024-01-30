// frontend/src/AdminPanel.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/admin');
        setUsers(response.data);
      } catch (error) {
        console.error('Admin Panel Error:', error.response.data.error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>Admin Panel</h2>
      <ul>
        {users.map((user) => (
          <li key={user._id}>
            <strong>Name:</strong> {user.name} | <strong>Email:</strong> {user.email} | <strong>Mobile:</strong> {user.mobile}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminPanel;
