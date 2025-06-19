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

const Competencias = () => {
  const [competencias, setCompetencias] = useState([]);
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    descripcion: '',
    estado: true
  });

  useEffect(() => {
    fetchCompetencias();
  }, []);

  const fetchCompetencias = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/competencias');
      setCompetencias(response.data);
    } catch (error) {
      console.error('Error al cargar competencias:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'estado' ? checked : value
    }));
  };

  const handleEdit = (competencia) => {
    setIsEditing(true);
    setFormData({
      id: competencia.id,
      descripcion: competencia.descripcion,
      estado: competencia.estado
    });
    setOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`http://localhost:3000/api/competencias/${formData.id}`, formData);
      } else {
        await axios.post('http://localhost:3000/api/competencias', formData);
      }
      setOpen(false);
      setIsEditing(false);
      fetchCompetencias();
      setFormData({ id: null, descripcion: '', estado: true });
    } catch (error) {
      console.error('Error al guardar competencia:', error);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setIsEditing(false);
    setFormData({ id: null, descripcion: '', estado: true });
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar esta competencia?')) {
      try {
        await axios.delete(`http://localhost:3000/api/competencias/${id}`);
        fetchCompetencias();
      } catch (error) {
        console.error('Error al eliminar competencia:', error);
      }
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Paper elevation={2} sx={{ p: 3, mb: 3, bgcolor: 'primary.main', color: 'white' }}>
          <Typography variant="h4" component="h1" fontWeight="bold">
            Gestión de Competencias
          </Typography>
          <Typography variant="subtitle1" sx={{ opacity: 0.9, mt: 1 }}>
            Administre las competencias disponibles en el sistema
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
            Nueva Competencia
          </Button>
        </Box>

        <Paper elevation={3} sx={{ overflow: 'hidden' }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'grey.50' }}>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
                    Descripción
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
                {competencias.map((competencia) => (
                  <TableRow 
                    key={competencia.id}
                    hover
                    sx={{ '&:hover': { bgcolor: 'grey.50' } }}
                  >
                    <TableCell sx={{ fontSize: '0.95rem' }}>
                      {competencia.descripcion}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={competencia.estado ? 'Activo' : 'Inactivo'}
                        color={competencia.estado ? 'success' : 'error'}
                        size="small"
                        sx={{ fontWeight: 'bold' }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                        <IconButton
                          color="primary"
                          onClick={() => handleEdit(competencia)}
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
                          onClick={() => handleDelete(competencia.id)}
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
              {isEditing ? 'Editar Competencia' : 'Nueva Competencia'}
            </Typography>
          </DialogTitle>
          <Divider />
          <DialogContent sx={{ p: 3 }}>
            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Descripción de la Competencia"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                margin="normal"
                required
                variant="outlined"
                placeholder="Ej: Programación en JavaScript, Liderazgo, etc."
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
                label="Competencia Activa"
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

export default Competencias; 