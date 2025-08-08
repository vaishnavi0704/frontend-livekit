// pages/_app.js
import "@livekit/components-styles";        // ✅ correct style import
import "../styles/globals.css";             // your own global css if any

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
