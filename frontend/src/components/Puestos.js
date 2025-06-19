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
  Box,
  Container,
  IconButton,
  Divider,
  FormControlLabel,
  Switch,
  MenuItem,
  FormHelperText
} from '@mui/material';
import { 
  Add as AddIcon, 
  Delete as DeleteIcon,
  Edit as EditIcon 
} from '@mui/icons-material';
import axios from 'axios';

const nivelesRiesgo = ['Alto', 'Medio', 'Bajo'];

const Puestos = () => {
  const [puestos, setPuestos] = useState([]);
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    nombre: '',
    nivel_riesgo: '',
    salario_minimo: '',
    salario_maximo: '',
    estado: true
  });

  // Estado para errores
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchPuestos();
  }, []);

  const fetchPuestos = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/puestos');
      setPuestos(response.data);
    } catch (error) {
      console.error('Error al cargar puestos:', error);
    }
  };

  // Funciones de validación
  const validateNombre = (nombre) => {
    const nombreRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,}$/;
    if (!nombre) return 'El nombre del puesto es requerido';
    if (!nombreRegex.test(nombre)) return 'El nombre solo puede contener letras y espacios (mínimo 2 caracteres)';
    if (nombre.length > 100) return 'El nombre no puede exceder 100 caracteres';
    return '';
  };

  const validateNivelRiesgo = (nivel) => {
    if (!nivel) return 'El nivel de riesgo es requerido';
    if (!nivelesRiesgo.includes(nivel)) return 'Debe seleccionar un nivel de riesgo válido';
    return '';
  };

  const validateSalarioMinimo = (salario) => {
    if (!salario) return 'El salario mínimo es requerido';
    const salarioNum = parseFloat(salario);
    if (isNaN(salarioNum) || salarioNum <= 0) return 'El salario mínimo debe ser un número positivo';
    if (salarioNum < 1000) return 'El salario mínimo debe ser mayor a 1,000';
    return '';
  };

  const validateSalarioMaximo = (salarioMax, salarioMin) => {
    if (!salarioMax) return 'El salario máximo es requerido';
    const salarioMaxNum = parseFloat(salarioMax);
    if (isNaN(salarioMaxNum) || salarioMaxNum <= 0) return 'El salario máximo debe ser un número positivo';
    if (salarioMaxNum < 1000) return 'El salario máximo debe ser mayor a 1,000';
    
    if (salarioMin) {
      const salarioMinNum = parseFloat(salarioMin);
      if (!isNaN(salarioMinNum) && salarioMaxNum <= salarioMinNum) {
        return 'El salario máximo debe ser mayor al salario mínimo';
      }
    }
    return '';
  };

  const validateField = (name, value, form = formData) => {
    switch (name) {
      case 'nombre':
        return validateNombre(value);
      case 'nivel_riesgo':
        return validateNivelRiesgo(value);
      case 'salario_minimo':
        return validateSalarioMinimo(value);
      case 'salario_maximo':
        return validateSalarioMaximo(value, form.salario_minimo);
      default:
        return '';
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validar todos los campos excepto id y estado
    ['nombre', 'nivel_riesgo', 'salario_minimo', 'salario_maximo'].forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) newErrors[field] = error;
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    const newValue = name === 'estado' ? checked : value;
    
    // Crear formulario actualizado para validaciones que dependen de otros campos
    const updatedForm = { ...formData, [name]: newValue };
    
    // Validar campo actual si no es el estado
    if (name !== 'estado') {
      const error = validateField(name, newValue, updatedForm);
      
      // Si estamos cambiando salario_minimo, también validar salario_maximo si existe
      let newErrors = { ...errors, [name]: error };
      if (name === 'salario_minimo' && formData.salario_maximo) {
        const salarioMaxError = validateField('salario_maximo', formData.salario_maximo, updatedForm);
        newErrors.salario_maximo = salarioMaxError;
      }
      
      setErrors(newErrors);
    }
    
    setFormData(updatedForm);
  };

  const handleEdit = (puesto) => {
    setIsEditing(true);
    setFormData({
      id: puesto.id,
      nombre: puesto.nombre,
      nivel_riesgo: puesto.nivel_riesgo,
      salario_minimo: puesto.salario_minimo,
      salario_maximo: puesto.salario_maximo,
      estado: puesto.estado
    });
    setErrors({}); // Limpiar errores al editar
    setOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      if (isEditing) {
        await axios.put(`http://localhost:3000/api/puestos/${formData.id}`, formData);
      } else {
        await axios.post('http://localhost:3000/api/puestos', formData);
      }
      setOpen(false);
      setIsEditing(false);
      fetchPuestos();
      setFormData({
        id: null,
        nombre: '',
        nivel_riesgo: '',
        salario_minimo: '',
        salario_maximo: '',
        estado: true
      });
      setErrors({});
    } catch (error) {
      console.error('Error al guardar puesto:', error);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setIsEditing(false);
    setFormData({
      id: null,
      nombre: '',
      nivel_riesgo: '',
      salario_minimo: '',
      salario_maximo: '',
      estado: true
    });
    setErrors({});
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este puesto?')) {
      try {
        await axios.delete(`http://localhost:3000/api/puestos/${id}`);
        fetchPuestos();
      } catch (error) {
        console.error('Error al eliminar puesto:', error);
      }
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        {/* Header */}
        <Paper elevation={2} sx={{ p: 3, mb: 3, bgcolor: 'primary.main', color: 'white' }}>
          <Typography variant="h4" component="h1" fontWeight="bold">
            Gestión de Puestos
          </Typography>
          <Typography variant="subtitle1" sx={{ opacity: 0.9, mt: 1 }}>
            Administre los puestos disponibles en el sistema
          </Typography>
        </Paper>

        {/* Botón Agregar */}
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
            Nuevo Puesto
          </Button>
        </Box>

        {/* Tabla */}
        <Paper elevation={3} sx={{ overflow: 'hidden' }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'grey.50' }}>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
                    Nombre
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
                    Riesgo
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
                    Salario Mínimo
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
                    Salario Máximo
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
                {puestos.map((puesto) => (
                  <TableRow 
                    key={puesto.id}
                    hover
                    sx={{ '&:hover': { bgcolor: 'grey.50' } }}
                  >
                    <TableCell sx={{ fontSize: '0.95rem' }}>
                      {puesto.nombre}
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.95rem' }}>
                      {puesto.nivel_riesgo}
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.95rem' }}>
                      ${parseFloat(puesto.salario_minimo).toLocaleString()}
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.95rem' }}>
                      ${parseFloat(puesto.salario_maximo).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={puesto.estado}
                        onChange={(e) => handleEdit({ ...puesto, estado: e.target.checked })}
                        name="estado"
                        color="primary"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                        <IconButton
                          color="primary"
                          onClick={() => handleEdit(puesto)}
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
                          onClick={() => handleDelete(puesto.id)}
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

        {/* Dialog */}
        <Dialog 
          open={open} 
          onClose={handleClose}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: { borderRadius: 2 }
          }}
        >
          <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white' }}>
            <Typography variant="h6" fontWeight="bold">
              {isEditing ? 'Editar Puesto' : 'Nuevo Puesto'}
            </Typography>
          </DialogTitle>
          <Divider />
          <DialogContent sx={{ p: 3 }}>
            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Nombre del Puesto"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                margin="normal"
                required
                variant="outlined"
                error={!!errors.nombre}
                helperText={errors.nombre}
                sx={{ 
                  '& .MuiOutlinedInput-root': { borderRadius: 2 },
                  mt: 2,
                  minWidth: 200
                }}
              />
              <TextField
                fullWidth
                select
                label="Nivel de Riesgo"
                name="nivel_riesgo"
                value={formData.nivel_riesgo}
                onChange={handleChange}
                margin="normal"
                required
                variant="outlined"
                error={!!errors.nivel_riesgo}
                helperText={errors.nivel_riesgo}
                sx={{ 
                  '& .MuiOutlinedInput-root': { borderRadius: 2 },
                  mt: 2,
                  minWidth: 200
                }}
              >
                {nivelesRiesgo.map((nivel) => (
                  <MenuItem key={nivel} value={nivel}>
                    {nivel}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                fullWidth
                label="Salario Mínimo"
                name="salario_minimo"
                type="number"
                value={formData.salario_minimo}
                onChange={handleChange}
                margin="normal"
                required
                variant="outlined"
                error={!!errors.salario_minimo}
                helperText={errors.salario_minimo}
                inputProps={{ min: 1000, step: 1000 }}
                sx={{ 
                  '& .MuiOutlinedInput-root': { borderRadius: 2 },
                  mt: 2,
                  minWidth: 200
                }}
              />
              <TextField
                fullWidth
                label="Salario Máximo"
                name="salario_maximo"
                type="number"
                value={formData.salario_maximo}
                onChange={handleChange}
                margin="normal"
                required
                variant="outlined"
                error={!!errors.salario_maximo}
                helperText={errors.salario_maximo}
                inputProps={{ min: 1000, step: 1000 }}
                sx={{ 
                  '& .MuiOutlinedInput-root': { borderRadius: 2 },
                  mt: 2,
                  minWidth: 200
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
                label="Puesto Activo"
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

export default Puestos; 