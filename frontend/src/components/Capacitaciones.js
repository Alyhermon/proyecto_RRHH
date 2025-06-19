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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText
} from '@mui/material';
import { 
  Add as AddIcon, 
  Delete as DeleteIcon,
  Edit as EditIcon 
} from '@mui/icons-material';
import axios from 'axios';

const niveles = [
  'Grado',
  'Post-grado',
  'Maestría',
  'Doctorado',
  'Técnico',
  'Gestión'
];

const Capacitaciones = () => {
  const [capacitaciones, setCapacitaciones] = useState([]);
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    descripcion: '',
    nivel: '',
    fecha_desde: '',
    fecha_hasta: '',
    institucion: ''
  });

  // Estado para errores
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchCapacitaciones();
  }, []);

  const fetchCapacitaciones = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/capacitaciones');
      setCapacitaciones(response.data);
    } catch (error) {
      console.error('Error al cargar capacitaciones:', error);
    }
  };

  // Funciones de validación
  const validateDescripcion = (descripcion) => {
    if (!descripcion) return 'La descripción es requerida';
    if (descripcion.length < 5) return 'La descripción debe tener al menos 5 caracteres';
    if (descripcion.length > 200) return 'La descripción no puede exceder 200 caracteres';
    return '';
  };

  const validateNivel = (nivel) => {
    if (!nivel) return 'El nivel es requerido';
    if (!niveles.includes(nivel)) return 'Debe seleccionar un nivel válido';
    return '';
  };

  const validateFechaDesde = (fecha) => {
    if (!fecha) return 'La fecha desde es requerida';
    const fechaSeleccionada = new Date(fecha);
    const fechaActual = new Date();
    fechaActual.setHours(0, 0, 0, 0);
    if (fechaSeleccionada > fechaActual) return 'La fecha desde no puede ser futura';
    return '';
  };

  const validateFechaHasta = (fechaHasta, fechaDesde) => {
    if (!fechaHasta) return 'La fecha hasta es requerida';
    if (fechaDesde) {
      const desde = new Date(fechaDesde);
      const hasta = new Date(fechaHasta);
      if (hasta < desde) return 'La fecha hasta debe ser posterior a la fecha desde';
    }
    const fechaActual = new Date();
    fechaActual.setHours(0, 0, 0, 0);
    if (new Date(fechaHasta) > fechaActual) return 'La fecha hasta no puede ser futura';
    return '';
  };

  const validateInstitucion = (institucion) => {
    const institucionRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s&.,\-]{2,}$/;
    if (!institucion) return 'La institución es requerida';
    if (!institucionRegex.test(institucion)) return 'La institución solo puede contener letras, espacios y caracteres básicos (mínimo 2 caracteres)';
    if (institucion.length > 100) return 'La institución no puede exceder 100 caracteres';
    return '';
  };

  const validateField = (name, value, form = formData) => {
    switch (name) {
      case 'descripcion':
        return validateDescripcion(value);
      case 'nivel':
        return validateNivel(value);
      case 'fecha_desde':
        return validateFechaDesde(value);
      case 'fecha_hasta':
        return validateFechaHasta(value, form.fecha_desde);
      case 'institucion':
        return validateInstitucion(value);
      default:
        return '';
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validar todos los campos
    Object.keys(formData).forEach(key => {
      if (key !== 'id') { // No validar el ID
        const error = validateField(key, formData[key]);
        if (error) newErrors[key] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    const updatedForm = { ...formData, [name]: value };
    
    // Validar campo actual
    const error = validateField(name, value, updatedForm);
    
    // Si estamos cambiando fecha_desde, también validar fecha_hasta si existe
    let newErrors = { ...errors, [name]: error };
    if (name === 'fecha_desde' && formData.fecha_hasta) {
      const fechaHastaError = validateField('fecha_hasta', formData.fecha_hasta, updatedForm);
      newErrors.fecha_hasta = fechaHastaError;
    }
    
    setErrors(newErrors);
    setFormData(updatedForm);
  };

  const handleEdit = (capacitacion) => {
    setIsEditing(true);
    setFormData({
      id: capacitacion.id,
      descripcion: capacitacion.descripcion,
      nivel: capacitacion.nivel,
      fecha_desde: capacitacion.fecha_desde.split('T')[0], 
      fecha_hasta: capacitacion.fecha_hasta.split('T')[0],
      institucion: capacitacion.institucion
    });
    setErrors({});
    setOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      if (isEditing) {
        await axios.put(`http://localhost:3000/api/capacitaciones/${formData.id}`, formData);
      } else {
        await axios.post('http://localhost:3000/api/capacitaciones', formData);
      }
      setOpen(false);
      setIsEditing(false);
      fetchCapacitaciones();
      setFormData({
        id: null,
        descripcion: '',
        nivel: '',
        fecha_desde: '',
        fecha_hasta: '',
        institucion: ''
      });
      setErrors({}); 
    } catch (error) {
      console.error('Error al guardar capacitación:', error);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setIsEditing(false);
    setFormData({
      id: null,
      descripcion: '',
      nivel: '',
      fecha_desde: '',
      fecha_hasta: '',
      institucion: ''
    });
    setErrors({}); 
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar esta capacitación?')) {
      try {
        await axios.delete(`http://localhost:3000/api/capacitaciones/${id}`);
        fetchCapacitaciones();
      } catch (error) {
        console.error('Error al eliminar capacitación:', error);
      }
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Paper elevation={2} sx={{ p: 3, mb: 3, bgcolor: 'primary.main', color: 'white' }}>
          <Typography variant="h4" component="h1" fontWeight="bold">
            Gestión de Capacitaciones
          </Typography>
          <Typography variant="subtitle1" sx={{ opacity: 0.9, mt: 1 }}>
            Administre las capacitaciones disponibles en el sistema
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
            Nueva Capacitación
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
                    Nivel
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
                    Fecha Desde
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
                    Fecha Hasta
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
                    Institución
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }} align="center">
                    Acciones
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {capacitaciones.map((capacitacion) => (
                  <TableRow 
                    key={capacitacion.id}
                    hover
                    sx={{ '&:hover': { bgcolor: 'grey.50' } }}
                  >
                    <TableCell sx={{ fontSize: '0.95rem' }}>
                      {capacitacion.descripcion}
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.95rem' }}>
                      {capacitacion.nivel}
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.95rem' }}>
                      {new Date(capacitacion.fecha_desde).toLocaleDateString()}
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.95rem' }}>
                      {new Date(capacitacion.fecha_hasta).toLocaleDateString()}
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.95rem' }}>
                      {capacitacion.institucion}
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                        <IconButton
                          color="primary"
                          onClick={() => handleEdit(capacitacion)}
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
                          onClick={() => handleDelete(capacitacion.id)}
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
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: { borderRadius: 2 }
          }}
        >
          <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white' }}>
            <Typography variant="h6" fontWeight="bold">
              {isEditing ? 'Editar Capacitación' : 'Nueva Capacitación'}
            </Typography>
          </DialogTitle>
          <Divider />
          <DialogContent sx={{ p: 3 }}>
            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Descripción"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                margin="normal"
                required
                variant="outlined"
                error={!!errors.descripcion}
                helperText={errors.descripcion}
                multiline
                rows={2}
                sx={{ 
                  '& .MuiOutlinedInput-root': { borderRadius: 2 },
                  mt: 2,
                  minWidth: 200
                }}
              />
              
              <FormControl 
                fullWidth 
                margin="normal" 
                required 
                error={!!errors.nivel}
                sx={{ mt: 2 }}
              >
                <InputLabel>Nivel</InputLabel>
                <Select
                  name="nivel"
                  value={formData.nivel}
                  onChange={handleChange}
                  label="Nivel"
                  sx={{ 
                    '& .MuiOutlinedInput-root': { borderRadius: 2 },
                    minWidth: 200
                  }}
                >
                  {niveles.map((nivel) => (
                    <MenuItem key={nivel} value={nivel}>
                      {nivel}
                    </MenuItem>
                  ))}
                </Select>
                {errors.nivel && (
                  <FormHelperText>{errors.nivel}</FormHelperText>
                )}
              </FormControl>

              <TextField
                fullWidth
                label="Fecha Desde"
                name="fecha_desde"
                type="date"
                value={formData.fecha_desde}
                onChange={handleChange}
                margin="normal"
                required
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                error={!!errors.fecha_desde}
                helperText={errors.fecha_desde}
                inputProps={{ max: new Date().toISOString().split('T')[0] }}
                sx={{ 
                  '& .MuiOutlinedInput-root': { borderRadius: 2 },
                  mt: 2,
                  minWidth: 200
                }}
              />
              
              <TextField
                fullWidth
                label="Fecha Hasta"
                name="fecha_hasta"
                type="date"
                value={formData.fecha_hasta}
                onChange={handleChange}
                margin="normal"
                required
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                error={!!errors.fecha_hasta}
                helperText={errors.fecha_hasta}
                inputProps={{ max: new Date().toISOString().split('T')[0] }}
                sx={{ 
                  '& .MuiOutlinedInput-root': { borderRadius: 2 },
                  mt: 2,
                  minWidth: 200
                }}
              />
              
              <TextField
                fullWidth
                label="Institución"
                name="institucion"
                value={formData.institucion}
                onChange={handleChange}
                margin="normal"
                required
                variant="outlined"
                error={!!errors.institucion}
                helperText={errors.institucion}
                sx={{ 
                  '& .MuiOutlinedInput-root': { borderRadius: 2 },
                  mt: 2,
                  minWidth: 200
                }}
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

export default Capacitaciones; 