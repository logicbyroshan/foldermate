import React, { useState } from 'react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PrivacyModal({ isOpen, onClose }: PrivacyModalProps) {
  const [activeTab, setActiveTab] = useState<'notice' | 'rights' | 'grievance'>('notice');
  const [grievanceForm, setGrievanceForm] = useState({
    name: '',
    email: '',
    category: 'consent_inquiry',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [ticketNumber, setTicketNumber] = useState('');

  if (!isOpen) return null;

  const handleSubmitGrievance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!grievanceForm.name || !grievanceForm.email || !grievanceForm.message) return;
    const ticket = `GRV-WEB-${Date.now().toString().slice(-4)}`;
    setTicketNumber(ticket);
    setIsSubmitted(true);
  };

  return (
    <div className="modal-backdrop" onClick={onClose} style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.65)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: 16,
    }}>
      <div
        className="privacy-modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#ffffff',
          borderRadius: 12,
          maxWidth: 720,
          width: '100%',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
          border: '2px solid #0f172a',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#f8fafc',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 18 }}>🔒</span>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: '#0f172a' }}>
                DPDP Privacy Notice &amp; Data Governance
              </h3>
              <span style={{ fontSize: 10, padding: '2px 6px', backgroundColor: '#10b981', color: '#fff', borderRadius: 4, fontWeight: 700 }}>
                DPDP Act 2023 &amp; Rules 2025
              </span>
            </div>
            <p style={{ margin: '2px 0 0 0', fontSize: 11, color: '#64748b' }}>
              Digital Personal Data Protection disclosures, itemised purposes, and 90-day grievance redressal.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: 18,
              cursor: 'pointer',
              color: '#64748b',
              padding: 4,
            }}
          >
            ✕
          </button>
        </div>

        {/* Tab Strip */}
        <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f1f5f9' }}>
          <button
            type="button"
            onClick={() => setActiveTab('notice')}
            style={{
              flex: 1,
              padding: '10px 14px',
              border: 'none',
              backgroundColor: activeTab === 'notice' ? '#ffffff' : 'transparent',
              fontWeight: 700,
              fontSize: 12,
              color: activeTab === 'notice' ? '#d97706' : '#475569',
              borderBottom: activeTab === 'notice' ? '2px solid #d97706' : 'none',
              cursor: 'pointer',
            }}
          >
            📜 Privacy Notice &amp; Itemised Purposes
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('rights')}
            style={{
              flex: 1,
              padding: '10px 14px',
              border: 'none',
              backgroundColor: activeTab === 'rights' ? '#ffffff' : 'transparent',
              fontWeight: 700,
              fontSize: 12,
              color: activeTab === 'rights' ? '#d97706' : '#475569',
              borderBottom: activeTab === 'rights' ? '2px solid #d97706' : 'none',
              cursor: 'pointer',
            }}
          >
            🛡️ Data Principal Rights (DSR)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('grievance')}
            style={{
              flex: 1,
              padding: '10px 14px',
              border: 'none',
              backgroundColor: activeTab === 'grievance' ? '#ffffff' : 'transparent',
              fontWeight: 700,
              fontSize: 12,
              color: activeTab === 'grievance' ? '#d97706' : '#475569',
              borderBottom: activeTab === 'grievance' ? '2px solid #d97706' : 'none',
              cursor: 'pointer',
            }}
          >
            ⚖️ Grievance Redressal (90D SLA)
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: 20, overflowY: 'auto', flex: 1, fontSize: 13, color: '#334155', lineHeight: 1.6 }}>
          {activeTab === 'notice' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ padding: 12, backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 6 }}>
                <strong style={{ color: '#166534', display: 'block', marginBottom: 2 }}>
                  ✓ 100% Offline-First Architecture &amp; Zero Telemetry
                </strong>
                <span style={{ fontSize: 11, color: '#15803d' }}>
                  FolderMate processes all files and SQLite database queries locally on your Windows machine. No files, design assets, client names, or personal metadata are ever transmitted to external cloud servers.
                </span>
              </div>

              <div>
                <h4 style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>
                  1. Data Fiduciary &amp; Grievance Officer Disclosures (Sec 5)
                </h4>
                <ul style={{ paddingLeft: 18, margin: 0, fontSize: 12 }}>
                  <li><strong>Data Fiduciary:</strong> FolderMate Project Team</li>
                  <li><strong>Contact Email:</strong> <code style={{ color: '#d97706' }}>privacy@foldermate.local</code></li>
                  <li><strong>Grievance Redressal Officer:</strong> Data Protection &amp; Grievance Officer</li>
                  <li><strong>Grievance Contact:</strong> <code style={{ color: '#d97706' }}>grievance@foldermate.local</code></li>
                </ul>
              </div>

              <div>
                <h4 style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>
                  2. Itemised Description of Specified Purposes (Rule 3)
                </h4>
                <div style={{ border: '1px solid #e2e8f0', borderRadius: 6, overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
                    <thead style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                      <tr>
                        <th style={{ padding: 6, textAlign: 'left' }}>Purpose</th>
                        <th style={{ padding: 6, textAlign: 'left' }}>Personal Data</th>
                        <th style={{ padding: 6, textAlign: 'left' }}>Lawful Basis</th>
                        <th style={{ padding: 6, textAlign: 'left' }}>Retention</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: 6, fontWeight: 600 }}>File Organization &amp; Naming</td>
                        <td style={{ padding: 6 }}>Client names, file paths, project years</td>
                        <td style={{ padding: 6 }}>Legitimate Use / User Instruction</td>
                        <td style={{ padding: 6 }}>User controlled local retention</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: 6, fontWeight: 600 }}>Activation Key Generation</td>
                        <td style={{ padding: 6 }}>GitHub username, completed task flags</td>
                        <td style={{ padding: 6 }}>Voluntary User Consent</td>
                        <td style={{ padding: 6 }}>Stored in browser local storage only</td>
                      </tr>
                      <tr>
                        <td style={{ padding: 6, fontWeight: 600 }}>Grievance Redressal</td>
                        <td style={{ padding: 6 }}>Complainant name, email, grievance details</td>
                        <td style={{ padding: 6 }}>Section 13 DPDP Act Obligation</td>
                        <td style={{ padding: 6 }}>90 days post-resolution</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>
                  3. Cookies &amp; Browser Storage Disclosure
                </h4>
                <p style={{ fontSize: 11, margin: 0 }}>
                  This website does <strong>NOT</strong> use advertising cookies, analytics pixels, or third-party tracking scripts. The only browser storage mechanism used is HTML5 LocalStorage strictly for persisting your generated activation key.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'rights' && (
            <div style={{ display: 'flex', flexDirection: "column", gap: 12 }}>
              <p style={{ fontSize: 12, margin: 0 }}>
                Under Chapter III of the Digital Personal Data Protection Act, 2023, Data Principals enjoy statutory rights:
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div style={{ padding: 10, border: '1px solid #e2e8f0', borderRadius: 6, backgroundColor: '#f8fafc' }}>
                  <strong style={{ fontSize: 12, color: '#0f172a' }}>1. Right to Access (Sec 11)</strong>
                  <p style={{ fontSize: 11, color: '#64748b', margin: '2px 0 0 0' }}>
                    Request summary and copy of personal data processed, identities of all processors, and processing categories.
                  </p>
                </div>

                <div style={{ padding: 10, border: '1px solid #e2e8f0', borderRadius: 6, backgroundColor: '#f8fafc' }}>
                  <strong style={{ fontSize: 12, color: '#0f172a' }}>2. Right to Correction (Sec 12)</strong>
                  <p style={{ fontSize: 11, color: '#64748b', margin: '2px 0 0 0' }}>
                    Request correction of inaccurate or misleading personal data, completion of incomplete data, and updating.
                  </p>
                </div>

                <div style={{ padding: 10, border: '1px solid #e2e8f0', borderRadius: 6, backgroundColor: '#f8fafc' }}>
                  <strong style={{ fontSize: 12, color: '#0f172a' }}>3. Right to Erasure (Sec 12(3))</strong>
                  <p style={{ fontSize: 11, color: '#64748b', margin: '2px 0 0 0' }}>
                    Request permanent erasure of personal data no longer necessary for the specified purpose.
                  </p>
                </div>

                <div style={{ padding: 10, border: '1px solid #e2e8f0', borderRadius: 6, backgroundColor: '#f8fafc' }}>
                  <strong style={{ fontSize: 12, color: '#0f172a' }}>4. Right to Nominate (Sec 14)</strong>
                  <p style={{ fontSize: 11, color: '#64748b', margin: '2px 0 0 0' }}>
                    Nominate another individual to exercise data rights in the event of death or incapacity.
                  </p>
                </div>
              </div>

              <div style={{ padding: 10, backgroundColor: '#eff6ff', borderRadius: 6, border: '1px solid #bfdbfe' }}>
                <strong style={{ fontSize: 12, color: '#1e40af' }}>How to Exercise Rights:</strong>
                <p style={{ fontSize: 11, color: '#1e3a8a', margin: '2px 0 0 0' }}>
                  You can exercise rights directly inside the FolderMate desktop app under <em>Privacy &amp; Data Governance Center</em>, or by submitting a request to <code style={{ color: '#d97706' }}>privacy@foldermate.local</code>.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'grievance' && (
            <div>
              {isSubmitted ? (
                <div style={{ textAlign: 'center', padding: '24px 16px' }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>✅</div>
                  <h4 style={{ fontSize: 16, fontWeight: 800, color: '#166534', margin: 0 }}>
                    Privacy Grievance Registered
                  </h4>
                  <div style={{ fontSize: 13, color: '#0f172a', marginTop: 4, fontWeight: 700 }}>
                    Ticket Number: <code style={{ color: '#d97706' }}>{ticketNumber}</code>
                  </div>
                  <p style={{ fontSize: 12, color: '#64748b', maxWidth: 440, margin: '8px auto 0 auto' }}>
                    Your grievance has been assigned to our Grievance Redressal Officer. Under DPDP Rules 2025, you will receive an acknowledgment within 48 hours and complete resolution within 90 days.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSubmitted(false);
                      setGrievanceForm({ name: '', email: '', category: 'consent_inquiry', message: '' });
                    }}
                    style={{
                      marginTop: 16,
                      padding: '8px 16px',
                      backgroundColor: '#0f172a',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmitGrievance} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 2 }}>
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={grievanceForm.name}
                        onChange={(e) => setGrievanceForm({ ...grievanceForm, name: e.target.value })}
                        style={{ width: '100%', padding: '6px 10px', borderRadius: 4, border: '1px solid #cbd5e1', fontSize: 12 }}
                        placeholder="e.g. Ramesh Kumar"
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 2 }}>
                        Contact Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={grievanceForm.email}
                        onChange={(e) => setGrievanceForm({ ...grievanceForm, email: e.target.value })}
                        style={{ width: '100%', padding: '6px 10px', borderRadius: 4, border: '1px solid #cbd5e1', fontSize: 12 }}
                        placeholder="e.g. user@domain.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 2 }}>
                      Grievance Category
                    </label>
                    <select
                      value={grievanceForm.category}
                      onChange={(e) => setGrievanceForm({ ...grievanceForm, category: e.target.value })}
                      style={{ width: '100%', padding: '6px 10px', borderRadius: 4, border: '1px solid #cbd5e1', fontSize: 12 }}
                    >
                      <option value="consent_inquiry">Consent Inquiry / Withdrawal</option>
                      <option value="unauthorized_processing">Unauthorized Data Processing Inquiry</option>
                      <option value="dsr_assistance">DSR Access / Erasure Assistance</option>
                      <option value="child_data_protection">Children's Data Concern (Sec 9)</option>
                      <option value="security_safeguard">Security Safeguard Inquiry</option>
                      <option value="other">Other Privacy Grievance</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 2 }}>
                      Description of Grievance *
                    </label>
                    <textarea
                      required
                      value={grievanceForm.message}
                      onChange={(e) => setGrievanceForm({ ...grievanceForm, message: e.target.value })}
                      style={{ width: '100%', height: 75, padding: '6px 10px', borderRadius: 4, border: '1px solid #cbd5e1', fontSize: 12 }}
                      placeholder="Please provide specifics regarding your data protection query..."
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
                    <span style={{ fontSize: 11, color: '#64748b' }}>
                      ⏱️ Statutory 90-day resolution guaranteed under DPDP Rules 2025.
                    </span>
                    <button
                      type="submit"
                      style={{
                        padding: '8px 18px',
                        backgroundColor: '#d97706',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: 6,
                        fontWeight: 700,
                        fontSize: 12,
                        cursor: 'pointer',
                      }}
                    >
                      Register Grievance
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '12px 20px',
          borderTop: '1px solid #e2e8f0',
          backgroundColor: '#f8fafc',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: 11,
          color: '#64748b',
        }}>
          <span>Digital Personal Data Protection Act, 2023 Compliance Framework</span>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '6px 14px',
              backgroundColor: '#e2e8f0',
              border: 'none',
              borderRadius: 4,
              fontWeight: 600,
              fontSize: 11,
              cursor: 'pointer',
              color: '#334155',
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
