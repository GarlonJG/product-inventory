import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDeleteItemMutation, useAddItemMutation, useUpdateItemMutation } from '../items/api';
import { useToast } from '../../../app/providers/ToastProvider';

export function useInventoryActions(originalItem) {
  const navigate = useNavigate();
  const [deleteItem] = useDeleteItemMutation();
  const [addItem] = useAddItemMutation();
  const [updateItem] = useUpdateItemMutation();
  const { notify } = useToast();

  const handleEdit = useCallback((itemId) => {
    navigate(`/${itemId}/edit`);
  }, [navigate]);

  const handleAdd = useCallback(() => {
    navigate('/new');
  }, [navigate]);

  const handleSave = useCallback(async (formData) => {
    try {      
      if (formData?.id && originalItem?.id) {
        // Compare each field and only include changed ones
        const updatedFields = {};
        Object.keys(formData).forEach(key => {
          if (formData[key] !== originalItem[key]) {
            updatedFields[key] = formData[key];
          }
        });
  
        if (Object.keys(updatedFields).length > 0) {
          await updateItem({ id: formData.id, ...updatedFields }).unwrap();
          notify({ message: 'Item updated', severity: 'success' });
          navigate('..', { relative: 'route' })
        } else {
          notify({ message: 'No fields were changed', severity: 'info' });
        }
      } else {
        // For new items, send all fields
        await addItem(formData).unwrap();
        notify({ message: 'Item created', severity: 'success' });
        navigate('..', { relative: 'route' })
      }
    } catch (error) {
      console.error('Error saving item:', error);
      notify({ message: 'Error saving item', severity: 'error' });
    }
  }, [addItem, updateItem, notify, originalItem]);

  const handleDelete = useCallback(async (e, id) => {
    e.preventDefault();
    try {
      await deleteItem(id).unwrap();
      notify({ message: 'Item deleted', severity: 'success' });
    } catch (error) {
      console.error('Error deleting item:', error);
      notify({ message: 'Error deleting item', severity: 'error' });
    }
  }, [deleteItem, notify]);

  return {
    handleEdit,
    handleAdd,
    handleDelete,
    handleSave
  };
}