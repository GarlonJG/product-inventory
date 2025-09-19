import React from 'react';
import { Card, CardContent, Typography, Box, Button, Divider, useTheme } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { useInventoryActions } from '../../hooks/useInventoryActions';

const InventoryList = ({ items }) => {
  const theme = useTheme();
  const { handleEdit, handleDelete } = useInventoryActions();

  return (
    <Box sx={{ width: '100%', p: 1, backgroundColor: 'white', borderStyle: 'solid', borderColor: '#d9d9d9', borderWidth: '0 1px 1px 1px', borderRadius: '0 0 5px 5px' }}>
      {items.map((item) => (
        <React.Fragment key={item.id}>
          <Card 
            elevation={1} 
            sx={{ 
              mb: 2,
              '&:hover': {
                boxShadow: theme.shadows[4]
              }
            }}
          >
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="h6" component="div" noWrap>
                  {item.name}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  ${parseFloat(item.price).toFixed(2)}
                </Typography>
              </Box>
              
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body2" color="text.secondary">
                  Stock: {item.stock}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  SKU: {item.sku}
                </Typography>
              </Box>
              
              {item.description && (
                <Typography variant="body2" sx={{ 
                  mb: 1,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {item.description}
                </Typography>
              )}
              
              <Box display="flex" justifyContent="flex-end" gap={1} mt={1}>
                <Button
                  size="small"
                  startIcon={<EditIcon />}
                  onClick={(e) => handleEdit(item.id)}
                  aria-label="Edit item"
                />
                <Button
                  size="small"
                  color="error"
                  startIcon={<DeleteOutlinedIcon />}
                  onClick={(e) => handleDelete(e, item.id)}
                  aria-label="Delete item"
                />
              </Box>
            </CardContent>
          </Card>
          
        </React.Fragment>
      ))}
      <Divider sx={{ my: 1 }} />
    </Box>
  );
};

export default InventoryList;