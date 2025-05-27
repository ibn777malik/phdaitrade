import '../styles/globals.css';
import { AuthProvider } from '../contexts/AuthContext';
import { BotProvider } from '../contexts/BotContext';
import ProtectedRoute from '../components/ProtectedRoute';
import { useRouter } from 'next/router';

const publicRoutes = ['/login'];

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const isPublicRoute = publicRoutes.includes(router.pathname);

  return (
    <AuthProvider>
      {isPublicRoute ? (
        <Component {...pageProps} />
      ) : (
        <ProtectedRoute>
          <BotProvider>
            <Component {...pageProps} />
          </BotProvider>
        </ProtectedRoute>
      )}
    </AuthProvider>
  );
}

export default MyApp;