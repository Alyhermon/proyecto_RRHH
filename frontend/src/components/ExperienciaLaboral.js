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
  Grid,
  IconButton,
  Box,
  FormHelperText
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ExperienciaLaboral = () => {
  const { id } = useParams();
  const [experiencias, setExperiencias] = useState([]);
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    empresa: '',
    puesto_ocupado: '',
    fecha_desde: '',
    fecha_hasta: '',
    salario: ''
  });

  // Estado para errores
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchExperiencias = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/experiencia-laboral/${id}`);
        setExperiencias(response.data);
      } catch (error) {
        console.error('Error al cargar experiencias:', error);
      }
    };

    if (id) {
      fetchExperiencias();
    }
  }, [id]);

  // Funciones de validación
  const validateEmpresa = (empresa) => {
    const empresaRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s&.,\-]{2,}$/;
    if (!empresa) return 'La empresa es requerida';
    if (!empresaRegex.test(empresa)) return 'La empresa solo puede contener letras, espacios y caracteres básicos (mínimo 2 caracteres)';
    return '';
  };

  const validatePuesto = (puesto) => {
    if (!puesto) return 'El puesto ocupado es requerido';
    if (puesto.length < 2) return 'El puesto debe tener al menos 2 caracteres';
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
    if (fechaHasta && fechaDesde) {
      const desde = new Date(fechaDesde);
      const hasta = new Date(fechaHasta);
      if (hasta < desde) return 'La fecha hasta debe ser posterior a la fecha desde';
      if (hasta > new Date()) return 'La fecha hasta no puede ser futura';
    }
    return '';
  };

  const validateSalario = (salario) => {
    if (!salario) return 'El salario es requerido';
    const salarioNum = parseFloat(salario);
    if (isNaN(salarioNum) || salarioNum <= 0) return 'El salario debe ser un número positivo';
    if (salarioNum < 1000) return 'El salario debe ser mayor a 1,000';
    return '';
  };

  const validateField = (name, value, form = formData) => {
    switch (name) {
      case 'empresa':
        return validateEmpresa(value);
      case 'puesto_ocupado':
        return validatePuesto(value);
      case 'fecha_desde':
        return validateFechaDesde(value);
      case 'fecha_hasta':
        return validateFechaHasta(value, form.fecha_desde);
      case 'salario':
        return validateSalario(value);
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Crear formulario actualizado para validaciones que dependen de otros campos
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

  const validateForm = () => {
    const newErrors = {};
    
    // Validar todos los campos requeridos
    ['empresa', 'puesto_ocupado', 'fecha_desde', 'salario'].forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) newErrors[field] = error;
    });

    // Validar fecha_hasta si se proporciona
    if (formData.fecha_hasta) {
      const fechaHastaError = validateField('fecha_hasta', formData.fecha_hasta);
      if (fechaHastaError) newErrors.fecha_hasta = fechaHastaError;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEdit = (experiencia) => {
    setIsEditing(true);
    setFormData({
      id: experiencia.id,
      empresa: experiencia.empresa,
      puesto_ocupado: experiencia.puesto_ocupado,
      fecha_desde: experiencia.fecha_desde.split('T')[0],
      fecha_hasta: experiencia.fecha_hasta ? experiencia.fecha_hasta.split('T')[0] : '',
      salario: experiencia.salario
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
        await axios.put(`http://localhost:3000/api/experiencia-laboral/${formData.id}`, formData);
      } else {
        await axios.post(`http://localhost:3000/api/experiencia-laboral/${id}`, formData);
      }
      setOpen(false);
      setIsEditing(false);
      // Recargar experiencias
      const response = await axios.get(`http://localhost:3000/api/experiencia-laboral/${id}`);
      setExperiencias(response.data);
      // Limpiar formulario
      setFormData({
        empresa: '',
        puesto_ocupado: '',
        fecha_desde: '',
        fecha_hasta: '',
        salario: ''
      });
      setErrors({});
    } catch (error) {
      console.error('Error al guardar experiencia:', error);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setIsEditing(false);
    setFormData({
      empresa: '',
      puesto_ocupado: '',
      fecha_desde: '',
      fecha_hasta: '',
      salario: ''
    });
    setErrors({});
  };

  const handleDelete = async (expId) => {
    if (window.confirm('¿Está seguro de eliminar esta experiencia laboral?')) {
      try {
        await axios.delete(`http://localhost:3000/api/experiencia-laboral/${expId}`);
        // Recargar experiencias
        const response = await axios.get(`http://localhost:3000/api/experiencia-laboral/${id}`);
        setExperiencias(response.data);
      } catch (error) {
        console.error('Error al eliminar experiencia:', error);
      }
    }
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Experiencia Laboral
      </Typography>

      <Button 
        variant="contained" 
        color="primary" 
        onClick={() => setOpen(true)}
        style={{ marginBottom: '1rem' }}
      >
        Agregar Experiencia
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Empresa</TableCell>
              <TableCell>Puesto</TableCell>
              <TableCell>Fecha Desde</TableCell>
              <TableCell>Fecha Hasta</TableCell>
              <TableCell>Salario</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {experiencias.map((exp) => (
              <TableRow key={exp.id}>
                <TableCell>{exp.empresa}</TableCell>
                <TableCell>{exp.puesto_ocupado}</TableCell>
                <TableCell>{new Date(exp.fecha_desde).toLocaleDateString()}</TableCell>
                <TableCell>{exp.fecha_hasta ? new Date(exp.fecha_hasta).toLocaleDateString() : 'Presente'}</TableCell>
                <TableCell>${parseFloat(exp.salario).toLocaleString()}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton
                      color="primary"
                      onClick={() => handleEdit(exp)}
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
                      onClick={() => handleDelete(exp.id)}
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

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>{isEditing ? 'Editar Experiencia Laboral' : 'Nueva Experiencia Laboral'}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2} style={{ marginTop: '0.5rem' }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Empresa"
                  name="empresa"
                  value={formData.empresa}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  error={!!errors.empresa}
                  helperText={errors.empresa}
                  sx={{ 
                    minWidth: 200,
                    '& .MuiOutlinedInput-root': { borderRadius: 2 }
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Puesto Ocupado"
                  name="puesto_ocupado"
                  value={formData.puesto_ocupado}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  error={!!errors.puesto_ocupado}
                  helperText={errors.puesto_ocupado}
                  sx={{ 
                    minWidth: 200,
                    '& .MuiOutlinedInput-root': { borderRadius: 2 }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Fecha Desde"
                  name="fecha_desde"
                  type="date"
                  value={formData.fecha_desde}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  required
                  variant="outlined"
                  error={!!errors.fecha_desde}
                  helperText={errors.fecha_desde}
                  inputProps={{ max: new Date().toISOString().split('T')[0] }}
                  sx={{ 
                    minWidth: 200,
                    '& .MuiOutlinedInput-root': { borderRadius: 2 }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Fecha Hasta (Opcional)"
                  name="fecha_hasta"
                  type="date"
                  value={formData.fecha_hasta}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                  error={!!errors.fecha_hasta}
                  helperText={errors.fecha_hasta || 'Dejar vacío si es el trabajo actual'}
                  inputProps={{ max: new Date().toISOString().split('T')[0] }}
                  sx={{ 
                    minWidth: 200,
                    '& .MuiOutlinedInput-root': { borderRadius: 2 }
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Salario"
                  name="salario"
                  type="number"
                  value={formData.salario}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  error={!!errors.salario}
                  helperText={errors.salario}
                  inputProps={{ min: 1000, step: 1000 }}
                  sx={{ 
                    minWidth: 200,
                    '& .MuiOutlinedInput-root': { borderRadius: 2 }
                  }}
                />
              </Grid>
            </Grid>
          </form>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={handleClose}
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
            color="primary"
            sx={{ 
              borderRadius: 2,
              textTransform: 'none',
              px: 3
            }}
          >
            {isEditing ? 'Actualizar' : 'Guardar'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ExperienciaLaboral; 