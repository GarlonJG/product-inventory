import { useNavigate } from 'react-router-dom';
import { useLoginMutation } from '../auth/api/authApi';
import { 
  Container, 
  Box, 
  Avatar, 
  Typography
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Form from '../../shared/ui/Form/Form';
import LoginForm from './components/LoginForm';
import { useToast } from '../../app/providers/ToastProvider';
import { loginFormSchema } from './schema/loginForm.schema';


const LoginPage = () => {
  const [login, { isLoading }] = useLoginMutation();
  const navigate = useNavigate();
  const { notify } = useToast();

  const handleSubmit = async (formData) => {
    try {
        await login(formData).unwrap();
        // Redirect to the previous location or home
        navigate("/", { replace: true });
    } catch (err) {
        notify({ message: err?.data?.message || 'Login failed. Please check your credentials.', severity: 'error' });
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: 'white',
          borderRadius: '5px',
          padding: '20px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Form
          onSubmit={handleSubmit}
          schema={loginFormSchema}
          id="login-form">
          <LoginForm/>
        </Form>
      </Box>
    </Container>
  );
};

export default LoginPage;