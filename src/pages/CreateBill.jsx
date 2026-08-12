import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageContainer } from "../components/layout/PageContainer";
import { useApp } from "../context/AppContext";
import { useToast } from "../context/ToastContext";
import { formatCurrency } from "../utils/currency";
import { validateBillForm } from "../utils/validators";
import { Save, ArrowLeft } from "lucide-react";

export const CreateBill = () => {
  const { addBill, settings } = useApp();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [date, setDate] = useState(() => {
    const t = new Date();
    const yyyy = t.getFullYear();
    const mm = String(t.getMonth() + 1).padStart(2, "0");
    const dd = String(t.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  });
  const [totalIncome, setTotalIncome] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [business, setBusiness] = useState("Agro Mart");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();

    const amount = Number(totalIncome);
    const formData = {
      customerName: "Direct Income",
      items: [
        {
          productName: "Full Income",
          quantity: 1,
          unitPrice: amount,
          total: amount,
        },
      ],
    };

    const errs = validateBillForm(formData);
    if (!amount || amount <= 0) {
      errs.totalIncome = "Total income must be greater than zero";
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      showToast("Please fix validation errors", "error");
      return;
    }

    const created = addBill({
      customerName: business,
      business: business,
      date,
      subtotal: amount,
      discount: 0,
      total: amount,
      paymentMethod,
      payments: [{ method: paymentMethod, amount }],
      cardRate: settings.cardRate,
      items: [
        {
          productName: `${business} Daily Income`,
          quantity: 1,
          unitPrice: amount,
          total: amount,
        },
      ],
      referenceNumber,
      notes,
    });

    showToast(`Income ${created.billNumber} recorded successfully!`, "success");
    navigate("/income/bills");
  };

  return (
    <PageContainer title="Add Full Income" breadcrumb="Income / Add Income">
      <div style={{ marginBottom: "1.5rem" }}>
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => navigate("/income/bills")}
          style={{ marginBottom: "0.75rem" }}
        >
          <ArrowLeft size={16} /> Back to Bills
        </button>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 700 }}>
          Add Full Income
        </h2>
      </div>

      <form onSubmit={handleSubmit} style={{ maxWidth: "720px" }}>
        <div
          className="card"
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          <div className="form-group">
            <label className="form-label">Total Income</label>
            <input
              type="number"
              className="form-control"
              value={totalIncome}
              onChange={(e) => setTotalIncome(e.target.value)}
              placeholder="0.00"
            />
            {errors.totalIncome && (
              <span className="form-error">{errors.totalIncome}</span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Income Date</label>
            <input
              type="date"
              className="form-control"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label"> Business </label>
            <select
              className="form-control"
              value={business}
              onChange={(e) => setBusiness(e.target.value)}
            >
              <option value="Agro Mart">Agro Mart</option>
              <option value="SKY 8">SKY 8</option>
              <option value="Wine">Wine</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Payment Method</label>
            <select
              className="form-control"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="Cash">Cash</option>
              <option value="Card">Card</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Reference / Receipt Number</label>
            <input
              type="text"
              className="form-control"
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
              placeholder="Optional reference"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Notes</label>
            <textarea
              className="form-control"
              rows="3"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Optional details for this income entry"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ padding: "0.75rem", marginTop: "0.5rem" }}
          >
            <Save size={18} /> Save Income
          </button>
        </div>
      </form>
    </PageContainer>
  );
};
