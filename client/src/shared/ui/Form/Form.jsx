import { memo, forwardRef, useImperativeHandle } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const Form = memo(forwardRef(({ 
  defaultValues, 
  externalOnSubmit, 
  children,
  mode = 'onChange',
  transformValues,
  schema,
}, ref) => {
  const { 
    control, 
    handleSubmit: formHandleSubmit, 
    formState: { errors },
    setError: setFormError,
    ...formMethods
  } = useForm({
    defaultValues,
    mode,
    resolver: schema ? zodResolver(schema) : undefined,
  });

  const onSubmitHandler = (data) => {
    const transformedData = transformValues ? transformValues(data) : data;
    externalOnSubmit(transformedData);
  };

  // Expose form methods to parent via ref
  useImperativeHandle(ref, () => ({
    ...formMethods,
    submit: () => {
      formHandleSubmit(onSubmitHandler)();
    },
    setError: (field, error) => {
      setFormError(field, error);
    },
    setErrors: (errors) => {
      Object.entries(errors).forEach(([field, error]) => {
        setFormError(field, error);
      });
    }
  }));

  return (
    <form onSubmit={formHandleSubmit(onSubmitHandler)} noValidate>
      {children({ control, errors })}
    </form>
  );
}));

export default Form;