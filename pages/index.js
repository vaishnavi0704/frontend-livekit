import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function Home() {
  const [name, setName] = useState('');
  const [roomName, setRoomName] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleJoinMeeting = async (e) => {
    e.preventDefault();
    
    if (!name.trim() || !roomName.trim()) {
      alert('Please enter both name and room name');
      return;
    }

    setLoading(true);
    
    try {
      // Navigate to meeting room
      await router.push(`/meeting/${roomName}?name=${encodeURIComponent(name)}`);
    } catch (error) {
      console.error('Navigation error:', error);
      alert('Failed to join meeting');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>LiveKit Meeting App</title>
        <meta name="description" content="Join video meetings powered by LiveKit" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="container">
        <div className="card">
          <h1>Join Meeting</h1>
          <form onSubmit={handleJoinMeeting}>
            <div className="form-group">
              <label htmlFor="name">Your Name</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                disabled={loading}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="room">Room Name</label>
              <input
                id="room"
                type="text"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                placeholder="Enter room name"
                disabled={loading}
              />
            </div>
            
            <button type="submit" disabled={loading}>
              {loading ? 'Joining...' : 'Join Meeting'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}