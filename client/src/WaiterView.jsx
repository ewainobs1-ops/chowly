import { useEffect, useState } from 'react';
import { getOrders, getStaff, assignOrder, serveOrder } from './services/api';

export default function WaiterView() {
  const [orders, setOrders] = useState([]);
  const [staff, setStaff] = useState({ waiters: [], chefs: [], bartenders: [] });
  const [message, setMessage] = useState('');
  const [selectedWaiter, setSelectedWaiter] = useState({});
  const [selectedChef, setSelectedChef] = useState({});
  const [selectedBartender, setSelectedBartender] = useState({});

  const loadOrders = () => {
    getOrders().then(res => setOrders(res.data)).catch(() => setMessage('Could not load orders.'));
  };

  useEffect(() => {
    loadOrders();
    getStaff().then(res => setStaff(res.data));
    const interval = setInterval(loadOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleAssign = async (order) => {
    const waiterId = selectedWaiter[order.OrderID];
    if (!waiterId) {
      setMessage('Pick a waiter first.');
      return;
    }
    const assignments = order.OrderItems.map(oi => ({
      orderItemId: oi.OrderItemID,
      chefId: oi.MenuItem.ItemType === 'Food' ? (selectedChef[oi.OrderItemID] || null) : null,
      bartenderId: oi.MenuItem.ItemType === 'Drink' ? (selectedBartender[oi.OrderItemID] || null) : null
    }));
    try {
      await assignOrder(order.OrderID, { waiterId, assignments });
      setMessage(`Order #${order.OrderID} assigned.`);
      loadOrders();
    } catch (err) {
      setMessage(err.response?.data?.error || 'Could not assign the order.');
    }
  };

  const handleServe = async (order) => {
    try {
      await serveOrder(order.OrderID);
      setMessage(`Order #${order.OrderID} marked as served.`);
      loadOrders();
    } catch (err) {
      setMessage(err.response?.data?.error || 'Could not mark as served.');
    }
  };

  return (
    <div className="panel">
      <h2>Waiter dashboard</h2>
      {message && <p className="message">{message}</p>}
      {orders.length === 0 && <p>No orders yet.</p>}
      {orders.map(order => (
        <div key={order.OrderID} className="order-card">
          <h3>Order #{order.OrderID} — {order.OrderStatus}</h3>
          <p>Customer: {order.Customer?.CustomerName} ({order.Customer?.PhoneNumber})</p>
          <ul>
            {order.OrderItems?.map(oi => (
              <li key={oi.OrderItemID}>
                {oi.MenuItem.ItemName} x{oi.Quantity} ({oi.MenuItem.ItemType})
                {oi.Chef && ` — chef: ${oi.Chef.ChefName}`}
                {oi.Bartender && ` — bartender: ${oi.Bartender.BartenderName}`}
              </li>
            ))}
          </ul>

          {order.OrderStatus === 'Pending' && (
            <div>
              <select onChange={e => setSelectedWaiter(prev => ({ ...prev, [order.OrderID]: e.target.value }))}>
                <option value="">Select waiter</option>
                {staff.waiters.map(w => <option key={w.WaiterID} value={w.WaiterID}>{w.WaiterName}</option>)}
              </select>
              {order.OrderItems?.map(oi => (
                <div key={oi.OrderItemID}>
                  <span>{oi.MenuItem.ItemName}: </span>
                  {oi.MenuItem.ItemType === 'Food' ? (
                    <select onChange={e => setSelectedChef(prev => ({ ...prev, [oi.OrderItemID]: e.target.value }))}>
                      <option value="">Select chef</option>
                      {staff.chefs.map(c => <option key={c.ChefID} value={c.ChefID}>{c.ChefName}</option>)}
                    </select>
                  ) : (
                    <select onChange={e => setSelectedBartender(prev => ({ ...prev, [oi.OrderItemID]: e.target.value }))}>
                      <option value="">Select bartender</option>
                      {staff.bartenders.map(b => <option key={b.BartenderID} value={b.BartenderID}>{b.BartenderName}</option>)}
                    </select>
                  )}
                </div>
              ))}
              <button onClick={() => handleAssign(order)}>Assign order</button>
            </div>
          )}

          {order.OrderStatus === 'In Progress' && (
            <button onClick={() => handleServe(order)}>Mark as served</button>
          )}
        </div>
      ))}
    </div>
  );
}
