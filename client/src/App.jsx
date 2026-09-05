import { useState } from 'react';
import CustomerView from './CustomerView';
import WaiterView from './WaiterView';
import './App.css';

export default function App() {
  const [role, setRole] = useState('customer');

  return (
    <div className="app">
      <header className="header">
        <div className="header-text">
          <h1>Chowly — The Grill House</h1>
          <p className="subtitle">Lekki, Lagos</p>
        </div>
        <div className="role-switch">
          <button
            className={role === 'customer' ? 'active' : ''}
            onClick={() => setRole('customer')}
          >
            Customer
          </button>
          <button
            className={role === 'waiter' ? 'active' : ''}
            onClick={() => setRole('waiter')}
          >
            Waiter
          </button>
        </div>
      </header>
      {role === 'customer' ? <CustomerView /> : <WaiterView />}
    </div>
  );
}
