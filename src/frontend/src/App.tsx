import HomePage from './pages/HomePage';
import AppErrorBoundary from './components/app/AppErrorBoundary';

export default function App() {
  return (
    <AppErrorBoundary>
      <HomePage />
    </AppErrorBoundary>
  );
}
