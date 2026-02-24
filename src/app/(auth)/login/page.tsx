import { LoginForm } from '@/features/auth/components/LoginForm';

/**
 * Login Page
 * Thin route handler that delegates to the LoginForm feature component.
 */
export default function LoginPage() {
  return <LoginForm />;
}
