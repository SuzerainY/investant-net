import { InvestantUserAuthProvider } from '@/context/GlobalContext';
import '@/styles/main.scss';

export default function App({ Component, pageProps }) {
  return (
    <InvestantUserAuthProvider>
      <Component {...pageProps} />
    </InvestantUserAuthProvider>
  );
}