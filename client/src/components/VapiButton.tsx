import { useEffect, useRef, useState, useCallback } from 'react';
import Vapi from '@vapi-ai/web';
import { VAPI_PUBLIC_KEY, VAPI_ASSISTANT_ID, isVapiConfigured } from '../config/vapi';
import './VapiButton.css';

type CallStatus = 'idle' | 'connecting' | 'active' | 'ending';

interface VapiButtonProps {
  onCallStart?: () => void;
  onCallEnd?: () => void;
  onMessage?: (message: unknown) => void;
}

export function VapiButton({ onCallStart, onCallEnd, onMessage }: VapiButtonProps) {
  const [callStatus, setCallStatus] = useState<CallStatus>('idle');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [transcript, setTranscript] = useState<string>('');
  const vapiRef = useRef<Vapi | null>(null);

  // Initialize Vapi instance
  useEffect(() => {
    if (!isVapiConfigured()) {
      console.warn('Vapi is not configured. Please set VITE_VAPI_PUBLIC_KEY and VITE_VAPI_ASSISTANT_ID');
      return;
    }

    const vapi = new Vapi(VAPI_PUBLIC_KEY);
    vapiRef.current = vapi;

    // Event listeners
    vapi.on('call-start', () => {
      setCallStatus('active');
      setTranscript('');
      onCallStart?.();
    });

    vapi.on('call-end', () => {
      setCallStatus('idle');
      setIsSpeaking(false);
      setVolumeLevel(0);
      onCallEnd?.();
    });

    vapi.on('speech-start', () => {
      setIsSpeaking(true);
    });

    vapi.on('speech-end', () => {
      setIsSpeaking(false);
    });

    vapi.on('volume-level', (level: number) => {
      setVolumeLevel(level);
    });

    vapi.on('message', (message: unknown) => {
      onMessage?.(message);
      
      // Handle transcript messages
      const msg = message as { type?: string; transcript?: string; role?: string };
      if (msg.type === 'transcript' && msg.transcript) {
        setTranscript(prev => {
          const prefix = msg.role === 'assistant' ? 'Agent: ' : 'You: ';
          return prev + (prev ? '\n' : '') + prefix + msg.transcript;
        });
      }
    });

    vapi.on('error', (error: Error) => {
      console.error('Vapi error:', error);
      setCallStatus('idle');
    });

    return () => {
      vapi.stop();
    };
  }, [onCallStart, onCallEnd, onMessage]);

  const startCall = useCallback(async () => {
    if (!vapiRef.current || !isVapiConfigured()) return;

    try {
      setCallStatus('connecting');
      await vapiRef.current.start(VAPI_ASSISTANT_ID);
    } catch (error) {
      console.error('Failed to start call:', error);
      setCallStatus('idle');
    }
  }, []);

  const endCall = useCallback(() => {
    if (!vapiRef.current) return;

    setCallStatus('ending');
    vapiRef.current.stop();
  }, []);

  const toggleCall = useCallback(() => {
    if (callStatus === 'idle') {
      startCall();
    } else if (callStatus === 'active') {
      endCall();
    }
  }, [callStatus, startCall, endCall]);

  // If not configured, show setup instructions
  if (!isVapiConfigured()) {
    return (
      <div className="vapi-button-container">
        <div className="vapi-not-configured">
          <div className="config-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
          </div>
          <h3>Vapi Setup Required</h3>
          <p>Add your Vapi credentials to enable voice calls:</p>
          <div className="config-steps">
            <code>
              VITE_VAPI_PUBLIC_KEY=your_key<br />
              VITE_VAPI_ASSISTANT_ID=your_id
            </code>
          </div>
          <p className="config-hint">
            Get credentials from <a href="https://dashboard.vapi.ai" target="_blank" rel="noopener noreferrer">dashboard.vapi.ai</a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="vapi-button-container">
      <button
        className={`vapi-button ${callStatus} ${isSpeaking ? 'speaking' : ''}`}
        onClick={toggleCall}
        disabled={callStatus === 'connecting' || callStatus === 'ending'}
        aria-label={callStatus === 'active' ? 'End call' : 'Start call'}
      >
        {/* Animated rings */}
        {callStatus === 'active' && (
          <>
            <span className="pulse-ring ring-1" style={{ animationDelay: '0s' }}></span>
            <span className="pulse-ring ring-2" style={{ animationDelay: '0.5s' }}></span>
            <span className="pulse-ring ring-3" style={{ animationDelay: '1s' }}></span>
          </>
        )}
        
        {/* Volume visualizer */}
        {callStatus === 'active' && (
          <span 
            className="volume-ring" 
            style={{ 
              transform: `scale(${1 + volumeLevel * 0.5})`,
              opacity: 0.3 + volumeLevel * 0.4 
            }}
          ></span>
        )}

        {/* Icon */}
        <span className="button-icon">
          {callStatus === 'idle' && (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
              <line x1="12" y1="19" x2="12" y2="23"/>
              <line x1="8" y1="23" x2="16" y2="23"/>
            </svg>
          )}
          {callStatus === 'connecting' && (
            <div className="connecting-spinner"></div>
          )}
          {callStatus === 'active' && (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
          )}
          {callStatus === 'ending' && (
            <div className="connecting-spinner"></div>
          )}
        </span>
      </button>

      <div className="button-label">
        {callStatus === 'idle' && 'Click to start call'}
        {callStatus === 'connecting' && 'Connecting...'}
        {callStatus === 'active' && (isSpeaking ? 'Agent speaking...' : 'Listening...')}
        {callStatus === 'ending' && 'Ending call...'}
      </div>

      {/* Live transcript */}
      {callStatus === 'active' && transcript && (
        <div className="live-transcript">
          <div className="transcript-header">Live Transcript</div>
          <div className="transcript-content">
            {transcript.split('\n').map((line, i) => (
              <p key={i} className={line.startsWith('Agent:') ? 'agent' : 'user'}>
                {line}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

