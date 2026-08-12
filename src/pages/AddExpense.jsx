import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageContainer } from "../components/layout/PageContainer";
import { useApp } from "../context/AppContext";
import { useToast } from "../context/ToastContext";
import { validateExpenseForm } from "../utils/validators";
import { Save, ArrowLeft } from "lucide-react";

export const AddExpense = () => {
  const { addExpense, categories } = useApp();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [category, setCategory] = useState("Electricity");
  const [customCategory, setCustomCategory] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [expenseDate, setExpenseDate] = useState(() => {
    const t = new Date();
    const yyyy = t.getFullYear();
    const mm = String(t.getMonth() + 1).padStart(2, "0");
    const dd = String(t.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  });
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [business, setBusiness] = useState("Agro Mart");
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const targetCategory = category === "Custom" ? customCategory : category;
    const formData = {
      category: targetCategory,
      description,
      amount,
      expenseDate,
    };
    const errs = validateExpenseForm(formData);

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      showToast("Please fix validation errors", "error");
      return;
    }

    const created = addExpense({
      category: targetCategory,
      description,
      amount: Number(amount),
      expenseDate,
      paymentMethod,
      referenceNumber,
      notes,
      createdBy: "Admin User",
    });

    showToast(`Expense ${created.expenseId} recorded successfully!`, "success");
    navigate("/expenditure");
  };

  return (
    <PageContainer
      title="Add Business Expense"
      breadcrumb="Expenditure / Add Expense"
    >
      <div style={{ marginBottom: "1.5rem" }}>
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => navigate("/expenditure")}
          style={{ marginBottom: "0.75rem" }}
        >
          <ArrowLeft size={16} /> Back to Expenses
        </button>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 700 }}>
          Record Operational Expense
        </h2>
      </div>

      <form onSubmit={handleSubmit} style={{ maxWidth: "700px" }}>
        <div
          className="card"
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          <div className="form-group">
            <label className="form-label">Expense Category</label>
            <select
              className="form-control"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
              <option value="Custom">+ Custom Category</option>
            </select>
          </div>

          {category === "Custom" && (
            <div className="form-group">
              <label className="form-label">Custom Category Name</label>
              <input
                type="text"
                className="form-control"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                placeholder="Specify custom category"
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Expense Date</label>
            <input
              type="date"
              className="form-control"
              value={expenseDate}
              onChange={(e) => setExpenseDate(e.target.value)}
            />
            {errors.expenseDate && (
              <span className="form-error">{errors.expenseDate}</span>
            )}
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
            <label className="form-label">Description</label>
            <input
              type="text"
              className="form-control"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Electricity bill for main office"
            />
            {errors.description && (
              <span className="form-error">{errors.description}</span>
            )}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
            }}
          >
            <div className="form-group">
              <label className="form-label">Amount (LKR)</label>
              <input
                type="number"
                className="form-control"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
              />
              {errors.amount && (
                <span className="form-error">{errors.amount}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Payment Method</label>
              <select
                className="form-control"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Cash">Cash</option>
                <option value="Card">Card</option>
                <option value="Cheque">Cheque</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Reference / Receipt Number</label>
            <input
              type="text"
              className="form-control"
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
              placeholder="e.g. REF-80492"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Additional Notes</label>
            <textarea
              className="form-control"
              rows="3"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Optional operational details..."
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ padding: "0.75rem", marginTop: "0.5rem" }}
          >
            <Save size={18} /> Record Expense
          </button>
        </div>
      </form>
    </PageContainer>
  );
};
