import '../styles/globals.css';
import '@livekit/components-react/dist/index.css';

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}