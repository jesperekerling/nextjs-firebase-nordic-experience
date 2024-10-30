'use client';

import React, { useState } from 'react';

const SetAdminPage = () => {
  const [uid, setUid] = useState('');
  const [action, setAction] = useState('add');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await fetch('/api/set-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uid, action }),
      });

      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      if (error instanceof Error) {
        setMessage(`Error: ${error.message}`);
      } else {
        setMessage('An unknown error occurred');
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Set Admin Role</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="User ID"
          value={uid}
          onChange={(e) => setUid(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        />
        <select
          value={action}
          onChange={(e) => setAction(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        >
          <option value="add">Add Admin</option>
          <option value="delete">Remove Admin</option>
        </select>
        <button type="submit" className="p-2 bg-blue-500 text-white rounded">
          Submit
        </button>
      </form>
      {message && <p className="mt-4">{message}</p>}
    </div>
  );
};

export default SetAdminPage;