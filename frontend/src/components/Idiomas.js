import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Switch,
  FormControlLabel,
  Box,
  Container,
  Chip,
  IconButton,
  Divider
} from '@mui/material';
import { 
  Add as AddIcon, 
  Delete as DeleteIcon,
  Edit as EditIcon 
} from '@mui/icons-material';
import axios from 'axios';

const Idiomas = () => {
  const [idiomas, setIdiomas] = useState([]);
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    nombre: '',
    estado: true
  });

  useEffect(() => {
    fetchIdiomas();
  }, []);

  const fetchIdiomas = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/idiomas');
      setIdiomas(response.data);
    } catch (error) {
      console.error('Error al cargar idiomas:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'estado' ? checked : value
    }));
  };

  const handleEdit = (idioma) => {
    setIsEditing(true);
    setFormData({
      id: idioma.id,
      nombre: idioma.nombre,
      estado: idioma.estado
    });
    setOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`http://localhost:3000/api/idiomas/${formData.id}`, formData);
      } else {
        await axios.post('http://localhost:3000/api/idiomas', formData);
      }
      setOpen(false);
      setIsEditing(false);
      fetchIdiomas();
      setFormData({ id: null, nombre: '', estado: true });
    } catch (error) {
      console.error('Error al guardar idioma:', error);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setIsEditing(false);
    setFormData({ id: null, nombre: '', estado: true });
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este idioma?')) {
      try {
        await axios.delete(`http://localhost:3000/api/idiomas/${id}`);
        fetchIdiomas();
      } catch (error) {
        console.error('Error al eliminar idioma:', error);
      }
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Paper elevation={2} sx={{ p: 3, mb: 3, bgcolor: 'primary.main', color: 'white' }}>
          <Typography variant="h4" component="h1" fontWeight="bold">
            Gestión de Idiomas
          </Typography>
          <Typography variant="subtitle1" sx={{ opacity: 0.9, mt: 1 }}>
            Administre los idiomas disponibles en el sistema
          </Typography>
        </Paper>

        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpen(true)}
            sx={{ 
              borderRadius: 2, 
              px: 3, 
              py: 1.5,
              textTransform: 'none',
              fontSize: '1rem',
              boxShadow: 2
            }}
          >
            Nuevo Idioma
          </Button>
        </Box>

        <Paper elevation={3} sx={{ overflow: 'hidden' }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'grey.50' }}>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
                    Nombre
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
                    Estado
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }} align="center">
                    Acciones
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {idiomas.map((idioma) => (
                  <TableRow 
                    key={idioma.id}
                    hover
                    sx={{ '&:hover': { bgcolor: 'grey.50' } }}
                  >
                    <TableCell sx={{ fontSize: '0.95rem' }}>
                      {idioma.nombre}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={idioma.estado ? 'Activo' : 'Inactivo'}
                        color={idioma.estado ? 'success' : 'error'}
                        size="small"
                        sx={{ fontWeight: 'bold' }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                        <IconButton
                          color="primary"
                          onClick={() => handleEdit(idioma)}
                          sx={{ 
                            '&:hover': { 
                              bgcolor: 'primary.light',
                              color: 'white'
                            }
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(idioma.id)}
                          sx={{ 
                            '&:hover': { 
                              bgcolor: 'error.light',
                              color: 'white'
                            }
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        <Dialog 
          open={open} 
          onClose={handleClose}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: { borderRadius: 2 }
          }}
        >
          <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white' }}>
            <Typography variant="h6" fontWeight="bold">
              {isEditing ? 'Editar Idioma' : 'Nuevo Idioma'}
            </Typography>
          </DialogTitle>
          <Divider />
          <DialogContent sx={{ p: 3 }}>
            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Nombre del Idioma"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                margin="normal"
                required
                variant="outlined"
                placeholder="Ej: Inglés, Español, Francés, etc."
                sx={{ 
                  '& .MuiOutlinedInput-root': { borderRadius: 2 },
                  mt: 2,
                  minWidth: 100
                }}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.estado}
                    onChange={handleChange}
                    name="estado"
                    color="primary"
                  />
                }
                label="Idioma Activo"
                sx={{ mt: 2 }}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3, gap: 1 }}>
            <Button 
              onClick={handleClose}
              variant="outlined"
              sx={{ 
                borderRadius: 2,
                textTransform: 'none'
              }}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleSubmit} 
              variant="contained"
              sx={{ 
                borderRadius: 2,
                textTransform: 'none',
                boxShadow: 2
              }}
            >
              {isEditing ? 'Actualizar' : 'Guardar'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default Idiomas; 