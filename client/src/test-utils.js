import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a custom render function that includes all necessary providers
export const AllTheProviders = ({ children }) => {
  const theme = createTheme();
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // Disable retries for tests
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  );
};

const customRender = (ui, options = {}) =>
    render(ui, { wrapper: options.wrapper || AllTheProviders, ...options })

// Re-export everything
export * from '@testing-library/react';
// Override render method
export { customRender as render };
