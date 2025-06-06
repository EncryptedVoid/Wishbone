// Put this in a new file: TestWishlist.jsx
import React, { useState } from 'react';
import { mockWishItems } from '../../data/mockData';

const TestWishlist = () => {
  const [search, setSearch] = useState('');

  const items = mockWishItems.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase())
  ).slice(0, 10);

  return (
    <div style={{ padding: 20 }}>
      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search..."
        style={{ width: '100%', padding: 10, marginBottom: 20, border: '1px solid #ccc' }}
      />
      {items.map(item => (
        <div key={item.id} style={{
          border: '1px solid #ccc',
          padding: 16,
          marginBottom: 16,
          borderRadius: 8
        }}>
          <h3 style={{ margin: 0 }}>{item.name}</h3>
          <p style={{ margin: '8px 0', color: '#666' }}>{item.description}</p>
          <small>Score: {item.desireScore}</small>
        </div>
      ))}
    </div>
  );
};

export default TestWishlist;