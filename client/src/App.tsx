import { useState, useEffect, useCallback } from 'react';
import { Ticket } from './types';
import { getTickets } from './api';
import { VapiButton } from './components/VapiButton';
import './App.css';

/**
 * Acme Voice IT Helpdesk - Frontend Application
 * 
 * This demo showcases a Vapi-powered voice agent for enterprise IT support.
 * Integrated with Vapi Web SDK for real voice interactions.
 */

function App() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTickets();
    // Refresh tickets every 10 seconds to show new ones created by voice agent
    const interval = setInterval(fetchTickets, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchTickets = async () => {
    try {
      const data = await getTickets();
      setTickets(data);
      setError(null);
    } catch (err) {
      setError('Unable to connect to backend. Make sure the backend is running on port 3001.');
    } finally {
      setLoading(false);
    }
  };

  // Refresh tickets when a call ends (new ticket may have been created)
  const handleCallEnd = useCallback(() => {
    // Wait a moment for the ticket to be created, then refresh
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
              <span className="logo-product">Voice IT Helpdesk</span>
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
            <div className="hero-badge">Enterprise IT Support Demo</div>
            <h1 className="hero-title">
              AI Voice Agent for
              <span className="gradient-text"> IT Helpdesk</span>
            </h1>
            <p className="hero-description">
              Experience the future of enterprise IT support. Our Vapi-powered voice agent 
              handles Tier-1 support calls 24/7, verifies employees, and automatically 
              creates IT tickets—reducing wait times and freeing your team for complex issues.
            </p>
            <div className="hero-cta">
              <VapiButton onCallEnd={handleCallEnd} />
            </div>
          </div>
        </section>

        <section className="problem-solution">
          <div className="section-header">
            <h2>The Challenge & Solution</h2>
          </div>
          <div className="cards-grid">
            <div className="card problem-card">
              <div className="card-icon">⚠️</div>
              <h3>The Problem</h3>
              <ul>
                <li>High volume of repetitive Tier-1 calls</li>
                <li>Expensive 24/7 staffing requirements</li>
                <li>Agents "swivel chair" between systems</li>
                <li>Inconsistent ticket quality</li>
                <li>Long wait times hurt productivity</li>
              </ul>
            </div>
            <div className="card solution-card">
              <div className="card-icon">✨</div>
              <h3>The Solution</h3>
              <ul>
                <li>24/7 automated voice support</li>
                <li>Instant employee verification</li>
                <li>Automatic device lookup</li>
                <li>Consistent, structured tickets</li>
                <li>Complex cases escalated to humans</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="flow-section">
          <div className="section-header">
            <h2>How It Works</h2>
            <p>A complete voice-to-ticket experience in under 60 seconds</p>
          </div>
          <div className="flow-steps">
            <div className="flow-step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h4>Employee Calls</h4>
                <p>Employee initiates call via web widget or phone number</p>
              </div>
            </div>
            <div className="flow-connector"></div>
            <div className="flow-step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h4>Identity Verification</h4>
                <p>Agent asks for employee ID, calls <code>get_employee</code> API</p>
              </div>
            </div>
            <div className="flow-connector"></div>
            <div className="flow-step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h4>Device & Issue Capture</h4>
                <p>Agent identifies affected device and understands the issue</p>
              </div>
            </div>
            <div className="flow-connector"></div>
            <div className="flow-step">
              <div className="step-number">4</div>
              <div className="step-content">
                <h4>Ticket Creation</h4>
                <p>Agent calls <code>create_ticket</code> API to open IT ticket</p>
              </div>
            </div>
            <div className="flow-connector"></div>
            <div className="flow-step">
              <div className="step-number">5</div>
              <div className="step-content">
                <h4>Confirmation</h4>
                <p>Agent reads ticket number back to employee</p>
              </div>
            </div>
          </div>
        </section>

        <section className="tickets-section">
          <div className="section-header">
            <h2>Live Ticket Feed</h2>
            <p>Tickets created by the voice agent appear here in real-time</p>
          </div>
          <div className="tickets-container">
            {loading ? (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Connecting to backend...</p>
              </div>
            ) : error ? (
              <div className="error-state">
                <p>{error}</p>
                <button onClick={fetchTickets} className="retry-button">
                  Retry Connection
                </button>
              </div>
            ) : tickets.length === 0 ? (
              <div className="empty-state">
                <p>No tickets yet. Try speaking to the voice agent!</p>
              </div>
            ) : (
              <div className="tickets-table-wrapper">
                <table className="tickets-table">
                  <thead>
                    <tr>
                      <th>Ticket #</th>
                      <th>Employee ID</th>
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
        <p>
          Built as a Forward Deployed Engineer demo for{' '}
          <a href="https://vapi.ai" target="_blank" rel="noopener noreferrer">
            Vapi
          </a>
        </p>
        <p className="footer-subtitle">
          Enterprise Voice AI for IT Helpdesk Automation
        </p>
      </footer>
    </div>
  );
}

export default App;

