import { AppProps } from 'next/app';
import '../styles/globals.css';
import '../lib/i18n';

function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default App;


