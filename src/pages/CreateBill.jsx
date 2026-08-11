import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../components/layout/PageContainer';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { formatCurrency } from '../utils/currency';
import { validateBillForm } from '../utils/validators';
import { Plus, Trash2, Save, ArrowLeft } from 'lucide-react';

export const CreateBill = () => {
  const { addBill, settings } = useApp();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [customerName, setCustomerName] = useState('');
  const [date, setDate] = useState('2026-08-10');
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [splitCashAmount, setSplitCashAmount] = useState(0);
  const [splitCardAmount, setSplitCardAmount] = useState(0);
  const [errors, setErrors] = useState({});

  const [items, setItems] = useState([
    { productName: 'Commercial Product Package A', quantity: 1, unitPrice: 15000, total: 15000 }
  ]);

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    if (field === 'quantity' || field === 'unitPrice') {
      const qty = Number(newItems[index].quantity) || 0;
      const price = Number(newItems[index].unitPrice) || 0;
      newItems[index].total = qty * price;
    }
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { productName: '', quantity: 1, unitPrice: 0, total: 0 }]);
  };

  const removeItem = (index) => {
    if (items.length === 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const subtotal = items.reduce((sum, item) => sum + Number(item.total || 0), 0);
  const grandTotal = Math.max(0, subtotal - Number(discount || 0));

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = { customerName, items };
    const errs = validateBillForm(formData);

    if (paymentMethod === 'Split') {
      if (Number(splitCashAmount) + Number(splitCardAmount) !== grandTotal) {
        errs.split = `Split payment total (${formatCurrency(Number(splitCashAmount) + Number(splitCardAmount))}) must match Grand Total (${formatCurrency(grandTotal)})`;
      }
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      showToast('Please fix validation errors', 'error');
      return;
    }

    let payments = [];
    if (paymentMethod === 'Split') {
      payments = [
        { method: 'Cash', amount: Number(splitCashAmount) },
        { method: 'Card', amount: Number(splitCardAmount) }
      ];
    } else {
      payments = [{ method: paymentMethod, amount: grandTotal }];
    }

    const created = addBill({
      customerName,
      date,
      subtotal,
      discount: Number(discount),
      total: grandTotal,
      paymentMethod,
      payments,
      cardRate: settings.cardRate,
      items
    });

    showToast(`Bill ${created.billNumber} created successfully!`, 'success');
    navigate('/income/bills');
  };

  return (
    <PageContainer title="Create Bill / Invoice" breadcrumb="Income / Bills / Create">
      <div style={{ marginBottom: '1.5rem' }}>
        <button className="btn btn-secondary btn-sm" onClick={() => navigate('/income/bills')} style={{ marginBottom: '0.75rem' }}>
          <ArrowLeft size={16} /> Back to Bills
        </button>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>New Sales Bill</h2>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>Customer Details</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Customer Name</label>
              <input
                type="text"
                className="form-control"
                value={customerName}
                onChange={e => setCustomerName(e.target.value)}
                placeholder="e.g. Apex Traders Ltd"
              />
              {errors.customerName && <span className="form-error">{errors.customerName}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Bill Date</label>
              <input
                type="date"
                className="form-control"
                value={date}
                onChange={e => setDate(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Bill Items Section */}
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Bill Items</h3>
            <button type="button" className="btn btn-secondary btn-sm" onClick={addItem}>
              <Plus size={16} /> Add Item
            </button>
          </div>

          {errors.items && <div className="form-error" style={{ marginBottom: '0.5rem' }}>{errors.items}</div>}

          {items.map((item, index) => (
            <div key={index} style={{ display: 'grid', gridTemplateColumns: '3fr 1fr 1.5fr 1.5fr 40px', gap: '0.75rem', alignItems: 'center', marginBottom: '0.75rem' }}>
              <input
                type="text"
                className="form-control"
                placeholder="Product/Service description"
                value={item.productName}
                onChange={e => handleItemChange(index, 'productName', e.target.value)}
              />
              <input
                type="number"
                className="form-control"
                placeholder="Qty"
                min="1"
                value={item.quantity}
                onChange={e => handleItemChange(index, 'quantity', e.target.value)}
              />
              <input
                type="number"
                className="form-control"
                placeholder="Unit Price"
                min="0"
                value={item.unitPrice}
                onChange={e => handleItemChange(index, 'unitPrice', e.target.value)}
              />
              <div style={{ fontWeight: 600, textAlign: 'right' }}>
                {formatCurrency(item.total)}
              </div>
              <button
                type="button"
                className="btn-icon"
                onClick={() => removeItem(index)}
                style={{ color: 'var(--accent-rose)' }}
                disabled={items.length === 1}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        {/* Payment & Summary */}
        <div className="card" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>Payment Method</h3>
            <div className="form-group">
              <label className="form-label">Method</label>
              <select className="form-control" value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
                <option value="Cash">Cash</option>
                <option value="Card">Card Payment (Card charge applied)</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="PickMe">PickMe Delivery</option>
                <option value="Split">Split Payment (Cash + Card)</option>
              </select>
            </div>

            {paymentMethod === 'Split' && (
              <div style={{ backgroundColor: 'var(--bg-surface-hover)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Cash Amount</label>
                  <input
                    type="number"
                    className="form-control"
                    value={splitCashAmount}
                    onChange={e => setSplitCashAmount(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Card Amount</label>
                  <input
                    type="number"
                    className="form-control"
                    value={splitCardAmount}
                    onChange={e => setSplitCardAmount(e.target.value)}
                  />
                </div>
                {errors.split && <span className="form-error">{errors.split}</span>}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '260px' }}>
              <span>Subtotal:</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '260px', alignItems: 'center' }}>
              <span>Discount:</span>
              <input
                type="number"
                className="form-control"
                style={{ width: '120px', textAlign: 'right' }}
                value={discount}
                onChange={e => setDiscount(e.target.value)}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '260px', fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary-600)', paddingTop: '0.75rem', borderTop: '2px solid var(--border-color)' }}>
              <span>Grand Total:</span>
              <span>{formatCurrency(grandTotal)}</span>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '260px', marginTop: '1rem' }}>
              <Save size={18} /> Save & Issue Bill
            </button>
          </div>
        </div>
      </form>
    </PageContainer>
  );
};
