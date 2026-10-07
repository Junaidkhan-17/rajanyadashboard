import { FileText, Download } from "lucide-react";
import "./InvoiceInfo.css";

const InvoiceInfo = ({ payment }) => {
  if (!payment) return null;

  const invoiceNumber = payment.invoiceNumber || "N/A";
  const invoiceDate = payment.invoiceDate || "N/A";
  const amount = Number(payment.amount || 0);
  const customer = payment.customer || "N/A";
  const transactionId = payment.transactionId || "N/A";
  const status = payment.status || "N/A";
  const paymentMethod = payment.method || "Razorpay";

  const isPaid = String(status).toLowerCase() === "paid";

  const downloadPDF = () => {
    if (!isPaid) return;

    const printWindow = window.open("", "_blank", "width=900,height=700");

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
              background: #ffffff;
              border: 1px solid #e2e8f0;
              border-radius: 16px;
              padding: 40px;
            }

            .invoice-header {
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

            .invoice-heading {
              text-align: right;
            }

            .invoice-heading h1 {
              margin: 0 0 8px;
              font-size: 24px;
            }

            .invoice-heading p {
              margin: 0;
              color: #64748b;
              font-size: 14px;
            }

            .invoice-section {
              margin-top: 30px;
            }

            .section-title {
              margin: 0 0 14px;
              font-size: 15px;
              font-weight: 700;
              color: #334155;
            }

            .info-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 14px 30px;
            }

            .info-item {
              display: flex;
              justify-content: space-between;
              gap: 20px;
              padding: 10px 0;
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
              word-break: break-word;
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
              text-align: center;
              color: #64748b;
              font-size: 12px;
            }

            @media print {
              body {
                padding: 0;
                background: #ffffff;
              }

              .invoice {
                max-width: none;
                border: none;
                border-radius: 0;
                padding: 20px;
              }
            }

            @media (max-width: 600px) {
              body {
                padding: 15px;
              }

              .invoice {
                padding: 22px;
              }

              .invoice-header {
                flex-direction: column;
              }

              .invoice-heading {
                text-align: left;
              }

              .info-grid {
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
            <div class="invoice-header">
              <div class="brand">
                RAJANYA
              </div>

              <div class="invoice-heading">
                <h1>Invoice</h1>
                <p>${invoiceNumber}</p>
              </div>
            </div>

            <div class="invoice-section">
              <h2 class="section-title">
                Invoice Information
              </h2>

              <div class="info-grid">
                <div class="info-item">
                  <span class="label">
                    Invoice Number
                  </span>

                  <span class="value">
                    ${invoiceNumber}
                  </span>
                </div>

                <div class="info-item">
                  <span class="label">
                    Invoice Date
                  </span>

                  <span class="value">
                    ${invoiceDate}
                  </span>
                </div>

                <div class="info-item">
                  <span class="label">
                    Customer
                  </span>

                  <span class="value">
                    ${customer}
                  </span>
                </div>

                <div class="info-item">
                  <span class="label">
                    Transaction ID
                  </span>

                  <span class="value">
                    ${transactionId}
                  </span>
                </div>

                <div class="info-item">
                  <span class="label">
                    Payment Method
                  </span>

                  <span class="value">
                    ${paymentMethod}
                  </span>
                </div>

                <div class="info-item">
                  <span class="label">
                    Payment Status
                  </span>

                  <span class="value">
                    ${status}
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

  return (
    <div className="invoice-info-card bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-md">
      {/* Header */}
      <div className="invoice-info-header flex items-center gap-3 px-6 py-5 border-b">
        <FileText
          size={24}
          className="invoice-info-header-icon text-slate-700 shrink-0"
        />

        <h2 className="invoice-info-title text-2xl font-bold text-slate-900">
          Invoice Information
        </h2>
      </div>

      {/* Body */}
      <div className="invoice-info-body p-6 flex flex-col justify-between min-h-[270px]">
        <div className="invoice-info-details space-y-6">
          {/* Invoice Number */}
          <div className="invoice-info-row flex justify-between items-center gap-4">
            <span className="invoice-info-label text-slate-400 text-lg">
              Invoice Number :
            </span>

            <span className="invoice-info-value font-bold text-slate-700 text-xl text-right">
              {invoiceNumber}
            </span>
          </div>

          {/* Invoice Date */}
          <div className="invoice-info-row flex justify-between items-center gap-4">
            <span className="invoice-info-label text-slate-400 text-lg">
              Invoice Date :
            </span>

            <span className="invoice-info-value font-bold text-slate-700 text-xl text-right">
              {invoiceDate}
            </span>
          </div>

          {/* Invoice Amount */}
          <div className="invoice-info-row flex justify-between items-center gap-4">
            <span className="invoice-info-label text-slate-400 text-lg">
              Invoice Amount :
            </span>

            <span className="invoice-info-value invoice-info-amount font-bold text-slate-700 text-xl text-right">
              ₹{amount.toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        {/* Download */}
        <div className="invoice-info-action flex justify-end mt-10">
          <button
            type="button"
            onClick={downloadPDF}
            disabled={!isPaid}
            className="invoice-info-download flex items-center justify-center gap-2 px-6 h-12 rounded-xl border-2 bg-black text-white hover:bg-gray-500 transition disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-black"
            aria-label={
              isPaid
                ? "Download invoice PDF"
                : "Invoice download unavailable until payment is paid"
            }
          >
            <Download size={18} />

            <span>Download PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceInfo;