import React from 'react';
import { render, screen, fireEvent, waitFor } from '../../../../../test-utils';
import ItemForm from '../ItemForm';
import { axe } from 'jest-axe';
import userEvent from '@testing-library/user-event';

// Mock the required props
const mockProps = {
  form: { id: null, name: '', sku: '', description: '', stock: 0, price: 0 },
  handleSubmit: jest.fn(),
  error: null,
  isSubmitting: false,
  resetError: jest.fn(),
  isEditing: false
};

describe('ItemForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all form fields', async () => {
    render(<ItemForm {...mockProps} />);
    
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/sku/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/stock/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/price/i)).toBeInTheDocument();

  });

  it('basic accessibility check', async () => {
    const { container } = render(<ItemForm {...mockProps} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('validates required fields', async () => {
    const handleSubmit = jest.fn();
    render(<ItemForm {...mockProps} handleSubmit={handleSubmit} />);
    
    // Find the form and submit it directly
    const form = screen.getByRole('form', { name: /item-form/i });
    fireEvent.submit(form);
    
    await waitFor(() => {
      // Check for validation errors
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/sku must be exactly 6 digits/i)).toBeInTheDocument();
      expect(handleSubmit).not.toHaveBeenCalled();
    });
  });

  it('submits with valid data', async () => {
    const handleSubmit = jest.fn();
    render(<ItemForm {...mockProps} handleSubmit={handleSubmit} />);
    
    // Fill in the form
    await userEvent.type(screen.getByLabelText(/name/i), 'Test Item');
    await userEvent.type(screen.getByLabelText(/sku/i), '098765');
    await userEvent.type(screen.getByLabelText(/description/i), 'Test Description');
    await userEvent.type(screen.getByLabelText(/stock/i), '10');
    await userEvent.type(screen.getByLabelText(/price/i), '19.99');
    
    // Submit the form directly
    const form = screen.getByRole('form', { name: /item-form/i });
    fireEvent.submit(form);
    
    console.log('Form submitted:', form.checkValidity());
    console.log('Form errors:', document.querySelectorAll('[aria-invalid="true"]').length);

    const formData = new FormData(form);
    console.log('Form values:', Object.fromEntries(formData));

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalled();
    });
    
    // Now check the call arguments
    expect(handleSubmit.mock.calls[0][0]).toMatchObject({
        name: 'Test Item',
        sku: '098765',
        description: 'Test Description',
        stock: 10,  // Might be a string
        price: 19.99 // Might be a string
    });
  
  });


});