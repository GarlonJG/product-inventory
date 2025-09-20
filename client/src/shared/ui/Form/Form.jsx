import React, { memo } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const Form = memo(({ 
  defaultValues, 
  children,
  onSubmit,
  schema,
  id = 'default-form-id',
}) => {

  const methods = useForm({
    defaultValues,
    resolver: schema ? zodResolver(schema) : undefined,
  });

  return (
    <FormProvider {...methods}>
      <form id={id} aria-label={id} onSubmit={methods.handleSubmit(onSubmit)} noValidate>
        {children}
      </form>
    </FormProvider>
  );
});

export default Form;