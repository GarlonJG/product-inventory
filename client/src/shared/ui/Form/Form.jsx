import { memo } from 'react';
import { useForm } from 'react-hook-form';

const Form = memo(({ 
  defaultValues, 
  externalOnSubmit, 
  formRef,
  children,
  mode = 'onChange',
  transformValues,
}) => {
  const { 
    control, 
    handleSubmit, 
    formState: { errors }
  } = useForm({
    defaultValues,
    mode
  });

  const onSubmitHandler = (data) => {
    const transformedData = transformValues ? transformValues(data) : data;
    externalOnSubmit(transformedData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)} noValidate ref={formRef}>
      {children({ control, errors })}
    </form>
  );
});

export default Form;