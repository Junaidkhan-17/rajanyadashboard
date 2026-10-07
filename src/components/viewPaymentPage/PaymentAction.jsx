import { ArrowLeft, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";

import "./PaymentAction.css";

const PaymentAction = ({ payment }) => {
  const navigate = useNavigate();

  if (!payment) return null;

  const invoiceNumber = payment.invoiceNumber || "N/A";
  const transactionId = payment.transactionId || "N/A";
  const customer = payment.customer || "N/A";
  const email = payment.email || "N/A";
  const service = payment.service || "N/A";
  const amount = Number(payment.amount || 0);
  const paymentMethod = payment.method || "Razorpay";
  const status = payment.status || "N/A";
  const invoiceDate = payment.invoiceDate || "N/A";
  const paymentDate = payment.date || "N/A";

  const isPaid = String(status).toLowerCase() === "paid";

  const handleDownload = () => {
    if (!isPaid) return;

    const printWindow = window.open(
      "",
      "_blank",
      "width=900,height=700"
    );

    if (!printWindow) {
      return;
    }

    const invoiceHTML = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />

          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />

          <title>${invoiceNumber}</title>

          <style>
            * {
              box-sizing: border-box;
            }

            body {
              margin: 0;
              padding: 40px;
              background: #f8fafc;
              color: #0f172a;
              font-family:
                Arial,
                Helvetica,
                sans-serif;
            }

            .invoice {
              width: 100%;
              max-width: 800px;
              margin: 0 auto;
              padding: 40px;
              background: #ffffff;
              border: 1px solid #e2e8f0;
              border-radius: 16px;
            }

            .header {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              gap: 30px;
              padding-bottom: 25px;
              border-bottom: 1px solid #e2e8f0;
            }

            .brand {
              font-size: 28px;
              font-weight: 700;
              letter-spacing: 1px;
            }

            .invoice-title {
              text-align: right;
            }

            .invoice-title h1 {
              margin: 0 0 8px;
              font-size: 24px;
            }

            .invoice-title p {
              margin: 0;
              color: #64748b;
              font-size: 14px;
            }

            .section {
              margin-top: 30px;
            }

            .section-title {
              margin: 0 0 14px;
              color: #334155;
              font-size: 15px;
              font-weight: 700;
            }

            .details {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 0 30px;
            }

            .row {
              display: flex;
              justify-content: space-between;
              gap: 20px;
              padding: 11px 0;
              border-bottom: 1px solid #f1f5f9;
            }

            .label {
              color: #64748b;
              font-size: 14px;
            }

            .value {
              color: #0f172a;
              font-size: 14px;
              font-weight: 600;
              text-align: right;
              overflow-wrap: anywhere;
            }

            .total {
              display: flex;
              justify-content: space-between;
              align-items: center;
              gap: 20px;
              margin-top: 30px;
              padding-top: 20px;
              border-top: 2px solid #0f172a;
            }

            .total-label {
              font-size: 18px;
              font-weight: 700;
            }

            .total-value {
              font-size: 28px;
              font-weight: 700;
            }

            .footer {
              margin-top: 35px;
              padding-top: 20px;
              border-top: 1px solid #e2e8f0;
              color: #64748b;
              font-size: 12px;
              text-align: center;
            }

            @media print {
              body {
                padding: 0;
                background: #ffffff;
              }

              .invoice {
                max-width: none;
                padding: 20px;
                border: none;
                border-radius: 0;
              }
            }

            @media (max-width: 600px) {
              body {
                padding: 15px;
              }

              .invoice {
                padding: 22px;
              }

              .header {
                flex-direction: column;
              }

              .invoice-title {
                text-align: left;
              }

              .details {
                grid-template-columns: 1fr;
              }

              .total-value {
                font-size: 24px;
              }
            }
          </style>
        </head>

        <body>
          <div class="invoice">
            <div class="header">
              <div class="brand">
                RAJANYA
              </div>

              <div class="invoice-title">
                <h1>Payment Invoice</h1>
                <p>${invoiceNumber}</p>
              </div>
            </div>

            <div class="section">
              <h2 class="section-title">
                Payment Details
              </h2>

              <div class="details">
                <div class="row">
                  <span class="label">
                    Invoice Number
                  </span>

                  <span class="value">
                    ${invoiceNumber}
                  </span>
                </div>

                <div class="row">
                  <span class="label">
                    Transaction ID
                  </span>

                  <span class="value">
                    ${transactionId}
                  </span>
                </div>

                <div class="row">
                  <span class="label">
                    Customer
                  </span>

                  <span class="value">
                    ${customer}
                  </span>
                </div>

                <div class="row">
                  <span class="label">
                    Email
                  </span>

                  <span class="value">
                    ${email}
                  </span>
                </div>

                <div class="row">
                  <span class="label">
                    Service
                  </span>

                  <span class="value">
                    ${service}
                  </span>
                </div>

                <div class="row">
                  <span class="label">
                    Payment Method
                  </span>

                  <span class="value">
                    ${paymentMethod}
                  </span>
                </div>

                <div class="row">
                  <span class="label">
                    Status
                  </span>

                  <span class="value">
                    ${status}
                  </span>
                </div>

                <div class="row">
                  <span class="label">
                    Invoice Date
                  </span>

                  <span class="value">
                    ${invoiceDate}
                  </span>
                </div>

                <div class="row">
                  <span class="label">
                    Payment Date
                  </span>

                  <span class="value">
                    ${paymentDate}
                  </span>
                </div>
              </div>
            </div>

            <div class="total">
              <span class="total-label">
                Total Paid
              </span>

              <span class="total-value">
                ₹${amount.toLocaleString("en-IN")}
              </span>
            </div>

            <div class="footer">
              Thank you for using Rajanya Virtual Try-On.
            </div>
          </div>

          <script>
            window.onload = function () {
              window.print();
            };
          </script>
        </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(invoiceHTML);
    printWindow.document.close();
  };

  const handleBack = () => {
    navigate("/payments");
  };

  return (
    <div className="payment-action-card bg-white rounded-2xl border border-slate-200 shadow-md p-4 sm:p-6">
      <div className="payment-action-container flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {/* Back Button */}
        <button
          type="button"
          onClick={handleBack}
          className="payment-action-button payment-action-back h-11 px-5 rounded-xl border border-slate-200 hover:bg-slate-50 transition flex items-center justify-center gap-2 font-medium text-slate-700 w-full sm:w-auto"
        >
          <ArrowLeft
            size={18}
            className="payment-action-icon shrink-0"
          />

          <span>Back to Payments</span>
        </button>

        {/* Download */}
        <button
          type="button"
          onClick={handleDownload}
          disabled={!isPaid}
          className="payment-action-button payment-action-download h-11 px-6 rounded-xl bg-black text-white hover:bg-slate-800 transition flex items-center justify-center gap-2 disabled:bg-slate-300 disabled:cursor-not-allowed w-full sm:w-auto"
          aria-label={
            isPaid
              ? "Download payment invoice"
              : "Invoice download unavailable until payment is paid"
          }
        >
          <Download
            size={18}
            className="payment-action-icon shrink-0"
          />

          <span>Download Invoice</span>
        </button>
      </div>
    </div>
  );
};

export default PaymentAction;