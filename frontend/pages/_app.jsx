import '../styles/globals.css';
import { BotProvider } from '../contexts/BotContext';

/**
 * Custom App component to initialize pages
 * Wraps the entire app with BotProvider for state management
 * and imports global Tailwind CSS styles.
 */
function MyApp({ Component, pageProps }) {
  return (
    <BotProvider>
      <Component {...pageProps} />
    </BotProvider>
  );
}

export default MyApp;
