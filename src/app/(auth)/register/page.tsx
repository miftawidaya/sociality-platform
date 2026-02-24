import { RegisterForm } from '@/features/auth/components/RegisterForm';

/**
 * Register Page
 * Thin route handler that delegates to the RegisterForm feature component.
 */
export default function RegisterPage() {
  return <RegisterForm />;
}
