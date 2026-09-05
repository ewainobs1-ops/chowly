import { useEffect, useState, useRef } from 'react';
import { getMenu, placeOrder, getOrder, submitComplaint, submitPayment } from './services/api';

const ORDER_KEY = 'chowly_order_id';

export default function CustomerView() {
  const [menu, setMenu] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [cart, setCart] = useState({});
  const [order, setOrder] = useState(null);
  const [waitingTime, setWaitingTime] = useState(null);
  const [complaintText, setComplaintText] = useState('');
  const [rating, setRating] = useState(3);
  const [message, setMessage] = useState('');
  const [loadingOrder, setLoadingOrder] = useState(true);
  const pollRef = useRef(null);

  useEffect(() => {
    getMenu().then(res => setMenu(res.data)).catch(() => setMessage('Could not load the menu.'));
  }, []);

  // on mount, restore an in-progress order from this browser (survives tab switches and refreshes)
  useEffect(() => {
    const savedId = localStorage.getItem(ORDER_KEY);
    if (savedId) {
      getOrder(savedId)
        .then(res => setOrder(res.data))
        .catch(() => localStorage.removeItem(ORDER_KEY))
        .finally(() => setLoadingOrder(false));
    } else {
      setLoadingOrder(false);
    }
  }, []);

  useEffect(() => {
    if (!order || order.OrderStatus === 'Paid') {
      clearInterval(pollRef.current);
      return;
    }
    pollRef.current = setInterval(() => {
      getOrder(order.OrderID).then(res => setOrder(res.data));
    }, 4000);
    return () => clearInterval(pollRef.current);
  }, [order]);

  const setQuantity = (menuItemId, qty) => {
    setCart(prev => ({ ...prev, [menuItemId]: qty }));
  };

  const handlePlaceOrder = async () => {
    setMessage('');
    if (!customerName || !phoneNumber) {
      setMessage('Please enter your name and phone number.');
      return;
    }
    const items = Object.entries(cart)
      .filter(([, qty]) => qty > 0)
      .map(([menuItemId, quantity]) => ({ menuItemId: Number(menuItemId), quantity }));
    if (!items.length) {
      setMessage('Select at least one item.');
      return;
    }
    try {
      const res = await placeOrder({ customerName, phoneNumber, items });
      setOrder(res.data.order);
      setWaitingTime(res.data.estimatedWaitingTime);
      localStorage.setItem(ORDER_KEY, res.data.order.OrderID);
    } catch (err) {
      setMessage(err.response?.data?.error || 'Could not place the order.');
    }
  };

  const handleComplaint = async () => {
    try {
      await submitComplaint(order.OrderID, { description: complaintText, rating });
      setMessage('Complaint submitted.');
      setComplaintText('');
    } catch (err) {
      setMessage(err.response?.data?.error || 'Could not submit the complaint.');
    }
  };

  const orderTotal = () => {
    if (!order?.OrderItems) return 0;
    return order.OrderItems.reduce((sum, oi) => sum + Number(oi.MenuItem.Price) * oi.Quantity, 0);
  };

  const handlePayment = async () => {
    try {
      await submitPayment(order.OrderID, { amount: orderTotal(), method: 'Card' });
      setOrder(prev => ({ ...prev, OrderStatus: 'Paid' }));
      setMessage(`Payment recorded (pretend payment). Amount: ₦${orderTotal()}`);
    } catch (err) {
      setMessage(err.response?.data?.error || 'Could not record payment.');
    }
  };

  const startNewOrder = () => {
    localStorage.removeItem(ORDER_KEY);
    setOrder(null);
    setWaitingTime(null);
    setCart({});
    setCustomerName('');
    setPhoneNumber('');
    setMessage('');
  };

  if (loadingOrder) {
    return <div className="panel"><p>Loading...</p></div>;
  }

  if (order) {
    return (
      <div className="panel">
        <h2>Order #{order.OrderID}</h2>
        <p>Status: <strong>{order.OrderStatus}</strong></p>
        {waitingTime !== null && <p>Estimated waiting time: {waitingTime} minutes</p>}
        <h3>Items</h3>
        <ul>
          {order.OrderItems?.map(oi => (
            <li key={oi.OrderItemID}>
              {oi.MenuItem.ItemName} x{oi.Quantity} — ₦{oi.MenuItem.Price} each
              {oi.Chef && ` (prepared by chef ${oi.Chef.ChefName})`}
              {oi.Bartender && ` (prepared by ${oi.Bartender.BartenderName})`}
            </li>
          ))}
        </ul>
        <p><strong>Total: ₦{orderTotal()}</strong></p>

        {order.OrderStatus !== 'Paid' && (
          <div className="section">
            <h3>Submit a complaint</h3>
            <textarea value={complaintText} onChange={e => setComplaintText(e.target.value)} placeholder="Describe the issue" />
            <select value={rating} onChange={e => setRating(Number(e.target.value))}>
              {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n} star{n > 1 && 's'}</option>)}
            </select>
            <button onClick={handleComplaint} disabled={!complaintText}>Submit complaint</button>
          </div>
        )}

        {order.OrderStatus === 'Served' && (
          <div className="section">
            <button onClick={handlePayment}>Pay ₦{orderTotal()} (pretend payment)</button>
          </div>
        )}

        {order.OrderStatus === 'Paid' && (
          <div className="section">
            <p>Thank you, your payment has been recorded. Enjoy the rest of your visit.</p>
            <button onClick={startNewOrder}>Start a new order</button>
          </div>
        )}

        {message && <p className="message">{message}</p>}
      </div>
    );
  }

  return (
    <div className="panel">
      <h2>Menu</h2>
      <input placeholder="Your name" value={customerName} onChange={e => setCustomerName(e.target.value)} />
      <input placeholder="Phone number" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} />
      <table>
        <thead><tr><th>Item</th><th>Type</th><th>Price</th><th>Avg. wait</th><th>Qty</th></tr></thead>
        <tbody>
          {menu.map(item => (
            <tr key={item.MenuItemID}>
              <td>{item.ItemName}</td>
              <td>{item.ItemType}</td>
              <td>₦{item.Price}</td>
              <td>{item.AvgWaitingTime} min</td>
              <td>
                <input
                  type="number" min="0" style={{ width: '50px' }}
                  value={cart[item.MenuItemID] || 0}
                  onChange={e => setQuantity(item.MenuItemID, Number(e.target.value))}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handlePlaceOrder}>Place order</button>
      {message && <p className="message">{message}</p>}
    </div>
  );
}
