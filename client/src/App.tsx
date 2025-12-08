import { useState, useEffect, useCallback } from 'react';
import { Ticket } from './types';
import { getTickets } from './api';
import { VapiButton } from './components/VapiButton';
import './App.css';

function App() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTickets();
    const interval = setInterval(fetchTickets, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchTickets = async () => {
    try {
      const data = await getTickets();
      setTickets(data);
      setError(null);
    } catch {
      setError('Unable to connect to the ticketing system.');
    } finally {
      setLoading(false);
    }
  };

  const handleCallEnd = useCallback(() => {
    setTimeout(fetchTickets, 2000);
  }, []);

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <div className="logo-icon">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <rect width="32" height="32" rx="6" fill="url(#logo-gradient)"/>
                <path d="M8 20L16 8L24 20H20L16 14L12 20H8Z" fill="white"/>
                <circle cx="16" cy="22" r="2" fill="white"/>
                <defs>
                  <linearGradient id="logo-gradient" x1="0" y1="0" x2="32" y2="32">
                    <stop stopColor="#3b82f6"/>
                    <stop offset="1" stopColor="#8b5cf6"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div className="logo-text">
              <span className="logo-company">Acme Corp</span>
              <span className="logo-product">IT Helpdesk</span>
            </div>
          </div>
          <div className="powered-by">
            Powered by <span className="vapi-badge">Vapi</span>
          </div>
        </div>
      </header>

      <main className="main">
        <section className="hero">
          <div className="hero-content">
            <h1 className="hero-title">
              IT Support
              <span className="gradient-text"> Voice Assistant</span>
            </h1>
            <p className="hero-description">
              Get instant help with your technical issues. Our AI-powered voice assistant 
              can verify your identity, look up your devices, and create support tickets
              automatically. Available 24/7.
            </p>
            <div className="hero-cta">
              <VapiButton onCallEnd={handleCallEnd} />
            </div>
          </div>
        </section>

        <section className="flow-section">
          <div className="section-header">
            <h2>How It Works</h2>
            <p>Get a support ticket in under 60 seconds</p>
          </div>
          <div className="flow-steps">
            <div className="flow-step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h4>Start a Call</h4>
                <p>Click the button above to connect with our voice assistant</p>
              </div>
            </div>
            <div className="flow-connector"></div>
            <div className="flow-step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h4>Verify Your Identity</h4>
                <p>Provide your employee ID for verification</p>
              </div>
            </div>
            <div className="flow-connector"></div>
            <div className="flow-step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h4>Describe Your Issue</h4>
                <p>Tell us which device is affected and what the problem is</p>
              </div>
            </div>
            <div className="flow-connector"></div>
            <div className="flow-step">
              <div className="step-number">4</div>
              <div className="step-content">
                <h4>Get Your Ticket</h4>
                <p>Receive a ticket number for tracking your request</p>
              </div>
            </div>
          </div>
        </section>

        <section className="tickets-section">
          <div className="section-header">
            <h2>Recent Tickets</h2>
            <p>Support tickets created through the voice assistant</p>
          </div>
          <div className="tickets-container">
            {loading ? (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Loading tickets...</p>
              </div>
            ) : error ? (
              <div className="error-state">
                <p>{error}</p>
                <button onClick={fetchTickets} className="retry-button">
                  Retry
                </button>
              </div>
            ) : tickets.length === 0 ? (
              <div className="empty-state">
                <p>No tickets yet. Start a call to create your first ticket.</p>
              </div>
            ) : (
              <div className="tickets-table-wrapper">
                <table className="tickets-table">
                  <thead>
                    <tr>
                      <th>Ticket</th>
                      <th>Employee</th>
                      <th>Device</th>
                      <th>Issue</th>
                      <th>Status</th>
                      <th>Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tickets.map((ticket) => (
                      <tr key={ticket.ticketNumber}>
                        <td className="ticket-number">{ticket.ticketNumber}</td>
                        <td>{ticket.employeeId}</td>
                        <td><code>{ticket.deviceAssetTag}</code></td>
                        <td className="issue-summary">{ticket.issueSummary}</td>
                        <td>
                          <span className={`status-badge status-${ticket.status.toLowerCase()}`}>
                            {ticket.status}
                          </span>
                        </td>
                        <td className="created-at">
                          {new Date(ticket.createdAt).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>Acme Corp IT Helpdesk</p>
        <p className="footer-subtitle">
          Powered by Vapi Voice AI
        </p>
      </footer>
    </div>
  );
}

export default App;
