import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageContainer } from "../components/layout/PageContainer";
import { DataTable } from "../components/common/DataTable";
import { Modal } from "../components/common/Modal";
import { useApp } from "../context/AppContext";
import { useToast } from "../context/ToastContext";
import { formatCurrency } from "../utils/currency";
import { PlusCircle, Eye, Printer, Slash, Download } from "lucide-react";

export const Bills = () => {
  const { bills, updateBillStatus } = useApp();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [selectedBill, setSelectedBill] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showVoidModal, setShowVoidModal] = useState(false);

  const handleVoid = () => {
    if (selectedBill) {
      updateBillStatus(selectedBill.id, "Void");
      showToast(`Bill ${selectedBill.billNumber} has been voided.`, "warning");
      setShowVoidModal(false);
    }
  };

  const columns = [
    { header: "Record No", accessor: "billNumber", sortable: true },
    { header: "Date", accessor: "date", sortable: true },
    { header: "Business", accessor: "customerName", sortable: true },
    {
      header: "Total Income",
      accessor: "total",
      render: (val) => (
        <span style={{ fontWeight: 600 }}>{formatCurrency(val)}</span>
      ),
    },
    {
      header: "Payment Method",
      accessor: "paymentMethod",
      render: (val) => <span className="badge badge-info">{val}</span>,
    },
    {
      header: "Status",
      accessor: "status",
      render: (val) => (
        <span
          className={`badge ${val === "Completed" ? "badge-success" : val === "Void" ? "badge-danger" : "badge-warning"}`}
        >
          {val}
        </span>
      ),
    },
  ];

  return (
    <PageContainer
      title="Income Management — Daily Total Income"
      breadcrumb="Income / Daily Income"
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
        }}
      >
        <div>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700 }}>Income</h2>
          <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>
            Manage total daily income records, track revenue, and calculate card net earnings
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/income/bills/create")}
        >
          <PlusCircle size={18} />
          <span>Add Daily Income</span>
        </button>
      </div>

      <DataTable
        columns={columns}
        data={bills}
        actions={(row) => (
          <div
            style={{
              display: "flex",
              gap: "0.25rem",
              justifyContent: "flex-end",
            }}
          >
            <button
              className="btn-icon"
              title="View Details"
              onClick={() => {
                setSelectedBill(row);
                setShowViewModal(true);
              }}
            >
              <Eye size={16} />
            </button>
            <button
              className="btn-icon"
              title="Print Bill"
              onClick={() => window.print()}
            >
              <Printer size={16} />
            </button>
            {row.status !== "Void" && (
              <button
                className="btn-icon"
                title="Void Bill"
                style={{ color: "var(--accent-rose)" }}
                onClick={() => {
                  setSelectedBill(row);
                  setShowVoidModal(true);
                }}
              >
                <Slash size={16} />
              </button>
            )}
          </div>
        )}
      />

      {/* View Bill Modal */}
      <Modal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        title={`Income Record Details — ${selectedBill?.billNumber}`}
        footer={
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              className="btn btn-secondary"
              onClick={() => window.print()}
            >
              <Printer size={16} /> Print
            </button>
            <button
              className="btn btn-primary"
              onClick={() => setShowViewModal(false)}
            >
              Close
            </button>
          </div>
        }
      >
        {selectedBill && (
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "1rem",
                paddingBottom: "0.5rem",
                borderBottom: "1px solid var(--border-color)",
              }}
            >
              <div>
                <div
                  style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}
                >
                  Business
                </div>
                <div style={{ fontWeight: 600 }}>
                  {selectedBill.customerName}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div
                  style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}
                >
                  Income Date
                </div>
                <div style={{ fontWeight: 600 }}>{selectedBill.date}</div>
              </div>
            </div>

            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                marginBottom: "1rem",
                fontSize: "0.875rem",
              }}
            >
              <thead>
                <tr
                  style={{
                    borderBottom: "1px solid var(--border-color)",
                    color: "var(--text-muted)",
                  }}
                >
                  <th style={{ textAlign: "left", padding: "0.5rem 0" }}>
                    Description
                  </th>
                  <th style={{ textAlign: "center" }}>Qty</th>
                  <th style={{ textAlign: "right" }}>Amount</th>
                  <th style={{ textAlign: "right" }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {selectedBill.items.map((item, idx) => (
                  <tr
                    key={idx}
                    style={{ borderBottom: "1px solid var(--border-color)" }}
                  >
                    <td style={{ padding: "0.5rem 0" }}>{item.productName}</td>
                    <td style={{ textAlign: "center" }}>{item.quantity}</td>
                    <td style={{ textAlign: "right" }}>
                      {formatCurrency(item.unitPrice)}
                    </td>
                    <td style={{ textAlign: "right", fontWeight: 600 }}>
                      {formatCurrency(item.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.375rem",
                alignItems: "flex-end",
                fontSize: "0.875rem",
              }}
            >
              <div
                style={{
                  fontSize: "1.125rem",
                  fontWeight: 700,
                  color: "var(--primary-600)",
                  marginTop: "0.25rem",
                }}
              >
                Total Income: {formatCurrency(selectedBill.total)}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Void Confirmation Modal */}
      <Modal
        isOpen={showVoidModal}
        onClose={() => setShowVoidModal(false)}
        title="Confirm Void Income Record"
        footer={
          <>
            <button
              className="btn btn-secondary"
              onClick={() => setShowVoidModal(false)}
            >
              Cancel
            </button>
            <button className="btn btn-danger" onClick={handleVoid}>
              Confirm Void
            </button>
          </>
        }
      >
        <p>
          Are you sure you want to void record{" "}
          <strong>{selectedBill?.billNumber}</strong>? This action will subtract
          the income amount from gross income calculations.
        </p>
      </Modal>
    </PageContainer>
  );
};
