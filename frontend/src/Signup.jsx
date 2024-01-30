import React, { useState } from 'react';
import axios from 'axios';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, file: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataWithFile = new FormData();
      formDataWithFile.append('name', formData.name);
      formDataWithFile.append('email', formData.email);
      formDataWithFile.append('mobile', formData.mobile);
      formDataWithFile.append('password', formData.password);
      formDataWithFile.append('file', formData.file);

      const response = await axios.post('http://localhost:3001/signup', formDataWithFile);
      console.log(response.data);
    } catch (error) {
      console.error('Signup Error:', error.response.data.error);
    }
  };

  return (
    <div>
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <label>Name:</label>
        <input type="text" name="name" onChange={handleChange} required />

        <label>Email:</label>
        <input type="email" name="email" onChange={handleChange} required />

        <label>Mobile:</label>
        <input type="text" name="mobile" onChange={handleChange} required />

        <label>Password:</label>
        <input type="password" name="password" onChange={handleChange} required />

        <label>Upload File:</label>
        <input type="file" name="file" onChange={handleFileChange} required />

        <button type="submit">Signup</button>
      </form>
    </div>
  );
};

export default Signup;
