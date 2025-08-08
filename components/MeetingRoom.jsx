import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import { LiveKitRoom, VideoConference } from "@livekit/components-react";
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function MeetingRoom({ roomName, participantName }) {
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [agentStarted, setAgentStarted] = useState(false);
  const router = useRouter();

  const serverUrl = process.env.NEXT_PUBLIC_LIVEKIT_WS_URL;

  const createMeetingToken = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`${BACKEND_URL}/create-meeting`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify({
          name: participantName,
          room: roomName
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create meeting: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.token) {
        throw new Error('No token received from server');
      }

      setToken(data.token);
    } catch (err) {
      console.error('Error creating meeting:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [participantName, roomName]);

  const startAgent = useCallback(async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/start-agent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify({
          room: roomName
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to start agent: ${response.status}`);
      }

      setAgentStarted(true);
      console.log('Agent started successfully');
    } catch (err) {
      console.error('Error starting agent:', err);
      alert('Failed to start AI agent');
    }
  }, [roomName]);

  useEffect(() => {
    if (participantName && roomName) {
      createMeetingToken();
    }
  }, [participantName, roomName, createMeetingToken]);

  const handleDisconnected = useCallback(() => {
    router.push('/');
  }, [router]);

  if (!serverUrl) {
    return (
      <div className="container">
        <div className="card">
          <h2>Configuration Error</h2>
          <p>LiveKit server URL is not configured properly.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container">
        <div className="card">
          <h2>Connecting to meeting...</h2>
          <p>Please wait while we set up your meeting room.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="card">
          <h2>Connection Error</h2>
          <p>{error}</p>
          <div className="button-group">
            <button onClick={createMeetingToken}>Try Again</button>
            <button onClick={() => router.push('/')}>Go Home</button>
          </div>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="container">
        <div className="card">
          <h2>Unable to join meeting</h2>
          <p>Failed to get meeting token.</p>
          <button onClick={() => router.push('/')}>Go Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="meeting-container">
      <div className="meeting-header">
        <h3>Room: {roomName}</h3>
        <div className="meeting-controls">
          {!agentStarted && (
            <button 
              onClick={startAgent}
              className="start-agent-btn"
            >
              Start AI Agent
            </button>
          )}
          {agentStarted && (
            <span className="agent-status">AI Agent Active</span>
          )}
        </div>
      </div>
      
      <LiveKitRoom
        token={token}
        serverUrl={serverUrl}
        connect={true}
        data-lk-theme="default"
        style={{ height: 'calc(100vh - 80px)' }}
        onDisconnected={handleDisconnected}
      >
        <VideoConference />
      </LiveKitRoom>
    </div>
  );
}
