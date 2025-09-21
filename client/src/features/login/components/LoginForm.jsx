import { useFormContext } from 'react-hook-form';
import { 
  Button, 
  CircularProgress
} from '@mui/material';
import FormInput from '../../../shared/ui/Form/FormInput';

const LoginForm = () => {
  const { formState: { isSubmitting } } = useFormContext();

  return (
    <>
        <FormInput
            required
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            />
        <FormInput
            required
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"/>
        <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isSubmitting}
            sx={{ mt: 3, mb: 2 }}>
              {isSubmitting ? <CircularProgress size={24} /> : 'Sign In'}
        </Button>
    </>
  );
};

export default LoginForm;