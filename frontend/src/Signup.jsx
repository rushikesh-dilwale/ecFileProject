import React, { useState, useEffect } from 'react';
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

  const handleDownload = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/download/${formData.file.name}`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', formData.file.name);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download Error:', error.response.data.error);
    }
  };

  const handleWebSocket = () => {
    const ws = new WebSocket('ws://localhost:3001');

    ws.onopen = () => {
      console.log('WebSocket connection opened');
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log('WebSocket message received:', message);
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
    };

    ws.send(JSON.stringify({ type: 'client_message', data: 'Hello WebSocket server!' }));
  };

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:3001');

    ws.onopen = () => {
      console.log('WebSocket connection opened');
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log('WebSocket notification received:', message);
      
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
    };

    return () => {
      
      ws.close();
    };
  }, []); 

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

        {/* Additional buttons for functionalities */}
        <button type="button" onClick={handleDownload}>
          Download File
        </button>
        <button type="button" onClick={handleWebSocket}>
          Test WebSocket
        </button>
      </form>
    </div>
  );
};

export default Signup;









// import React, { useState } from 'react';
// import axios from 'axios';

// const Signup = () => {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     mobile: '',
//     password: '',
//   });

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleFileChange = (e) => {
//     setFormData({ ...formData, file: e.target.files[0] });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const formDataWithFile = new FormData();
//       formDataWithFile.append('name', formData.name);
//       formDataWithFile.append('email', formData.email);
//       formDataWithFile.append('mobile', formData.mobile);
//       formDataWithFile.append('password', formData.password);
//       formDataWithFile.append('file', formData.file);

//       const response = await axios.post('http://localhost:3001/signup', formDataWithFile);
//       console.log(response.data);
//     } catch (error) {
//       console.error('Signup Error:', error.response.data.error);
//     }
//   };

//   return (
//     <div>
//       <h2>Signup</h2>
//       <form onSubmit={handleSubmit}>
//         <label>Name:</label>
//         <input type="text" name="name" onChange={handleChange} required />

//         <label>Email:</label>
//         <input type="email" name="email" onChange={handleChange} required />

//         <label>Mobile:</label>
//         <input type="text" name="mobile" onChange={handleChange} required />

//         <label>Password:</label>
//         <input type="password" name="password" onChange={handleChange} required />

//         <label>Upload File:</label>
//         <input type="file" name="file" onChange={handleFileChange} required />

//         <button type="submit">Signup</button>
//       </form>
//     </div>
//   );
// };

// export default Signup;
