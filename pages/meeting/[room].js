import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import LoadingSpinner from '../../components/LoadingSpinner';

const MeetingRoom = dynamic(() => import('../../components/MeetingRoom'), {
  ssr: false,
  loading: () => <LoadingSpinner />
});

export default function MeetingPage() {
  const router = useRouter();
  const { room, name } = router.query;
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (router.isReady) {
      setIsReady(true);
    }
  }, [router.isReady]);

  if (!isReady) {
    return <LoadingSpinner />;
  }

  if (!room || !name) {
    return (
      <div className="container">
        <div className="card">
          <h2>Invalid Meeting Link</h2>
          <p>Room name and participant name are required.</p>
          <button onClick={() => router.push('/')}>
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Meeting: {room} | LiveKit</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <MeetingRoom roomName={room} participantName={name} />
    </>
  );
}
