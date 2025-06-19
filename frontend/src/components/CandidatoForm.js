import React, { useState, useEffect } from 'react';
import {
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Box,
  Paper,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Chip,
  IconButton,
  FormHelperText
} from '@mui/material';
import { 
  Save as SaveIcon, 
  Cancel as CancelIcon,
  Add as AddIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const niveles = [
  'Grado',
  'Post-grado',
  'Maestría',
  'Doctorado',
  'Técnico',
  'Gestión'
];

const CandidatoForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    cedula: '',
    nombre: '',
    puesto_aspira: '',
    departamento: '',
    salario_aspira: '',
    competencias: [],
    idiomas: [],
    recomendado_por: ''
  });

  const [capacitacionForm, setCapacitacionForm] = useState({
    descripcion: '',
    nivel: '',
    fecha_desde: '',
    fecha_hasta: '',
    institucion: ''
  });

  // Estado para errores
  const [errors, setErrors] = useState({});
  const [capacitacionErrors, setCapacitacionErrors] = useState({});

  const [capacitaciones, setCapacitaciones] = useState([]);
  const [puestos, setPuestos] = useState([]);
  const [competenciasDisponibles, setCompetenciasDisponibles] = useState([]);
  const [idiomasDisponibles, setIdiomasDisponibles] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [puestosRes, competenciasRes, idiomasRes] = await Promise.all([
        axios.get('http://localhost:3000/api/puestos'),
        axios.get('http://localhost:3000/api/competencias'),
        axios.get('http://localhost:3000/api/idiomas')
      ]);
      setPuestos(puestosRes.data);
      setCompetenciasDisponibles(competenciasRes.data);
      setIdiomasDisponibles(idiomasRes.data);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    }
  };

  // Funciones de validación
  const validateCedula = (cedula) => {
    const cedulaRegex = /^\d{11}$/;
    if (!cedula) return 'La cédula es requerida';
    if (!cedulaRegex.test(cedula)) return 'cedula invalida';
    return '';
  };

  const validateNombre = (nombre) => {
    const nombreRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,}$/;
    if (!nombre) return 'El nombre es requerido';
    if (!nombreRegex.test(nombre)) return 'El nombre solo puede contener letras y espacios (mínimo 2 caracteres)';
    return '';
  };

  const validateSalario = (salario) => {
    if (!salario) return 'El salario aspirado es requerido';
    const salarioNum = parseFloat(salario);
    if (isNaN(salarioNum) || salarioNum <= 0) return 'El salario debe ser un número positivo';
    if (salarioNum < 1000) return 'El salario debe ser mayor a 1,000';
    return '';
  };

  const validateDepartamento = (departamento) => {
    const deptoRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,}$/;
    if (!departamento) return 'El departamento es requerido';
    if (!deptoRegex.test(departamento)) return 'El departamento solo puede contener letras y espacios';
    return '';
  };

  const validateRecomendadoPor = (recomendado) => {
    if (recomendado && recomendado.length < 2) return 'Mínimo 2 caracteres';
    const nombreRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/;
    if (recomendado && !nombreRegex.test(recomendado)) return 'Solo puede contener letras y espacios';
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
    }
    return '';
  };

  const validateDescripcion = (descripcion) => {
    if (!descripcion) return 'La descripción es requerida';
    if (descripcion.length < 5) return 'La descripción debe tener al menos 5 caracteres';
    return '';
  };

  const validateInstitucion = (institucion) => {
    if (!institucion) return 'La institución es requerida';
    if (institucion.length < 2) return 'La institución debe tener al menos 2 caracteres';
    return '';
  };

  const validateField = (name, value) => {
    switch (name) {
      case 'cedula':
        return validateCedula(value);
      case 'nombre':
        return validateNombre(value);
      case 'salario_aspira':
        return validateSalario(value);
      case 'departamento':
        return validateDepartamento(value);
      case 'recomendado_por':
        return validateRecomendadoPor(value);
      case 'puesto_aspira':
        return !value ? 'El puesto aspirado es requerido' : '';
      default:
        return '';
    }
  };

  const validateCapacitacionField = (name, value, form) => {
    switch (name) {
      case 'descripcion':
        return validateDescripcion(value);
      case 'nivel':
        return !value ? 'El nivel es requerido' : '';
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCapacitacionChange = (e) => {
    const { name, value } = e.target;
    
    const updatedForm = { ...capacitacionForm, [name]: value };
    const error = validateCapacitacionField(name, value, updatedForm);
    setCapacitacionErrors(prev => ({
      ...prev,
      [name]: error
    }));

    setCapacitacionForm(updatedForm);
  };

  const handleAddCapacitacion = () => {
    // Validar todos los campos de capacitación
    const newErrors = {};
    Object.keys(capacitacionForm).forEach(key => {
      if (key !== 'fecha_hasta') {
        const error = validateCapacitacionField(key, capacitacionForm[key], capacitacionForm);
        if (error) newErrors[key] = error;
      }
    });

    setCapacitacionErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setCapacitaciones(prev => [...prev, { ...capacitacionForm, id: Date.now() }]);
      setCapacitacionForm({
        descripcion: '',
        nivel: '',
        fecha_desde: '',
        fecha_hasta: '',
        institucion: ''
      });
      setCapacitacionErrors({});
    }
  };

  const handleRemoveCapacitacion = (id) => {
    setCapacitaciones(prev => prev.filter(cap => cap.id !== id));
  };

  const handleMultiSelectChange = (name) => (event) => {
    const { value } = event.target;
    const error = name === 'competencias' && value.length === 0 ? 'Debe seleccionar al menos una competencia' : '';
    
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));

    setFormData(prev => ({
      ...prev,
      [name]: typeof value === 'string' ? value.split(',') : value
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validar todos los campos del formulario principal
    Object.keys(formData).forEach(key => {
      if (key !== 'competencias' && key !== 'idiomas') {
        const error = validateField(key, formData[key]);
        if (error) newErrors[key] = error;
      }
    });

    // Validar competencias
    if (formData.competencias.length === 0) {
      newErrors.competencias = 'Debe seleccionar al menos una competencia';
    }

    // Validar idiomas (opcional, así que no es obligatorio)
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const dataToSend = {
        ...formData,
        competencias: formData.competencias.join(', '),
        idiomas: formData.idiomas.join(', '),
        capacitaciones: capacitaciones
      };
      
      await axios.post('http://localhost:3000/api/candidatos', dataToSend);
      navigate('/');
    } catch (error) {
      console.error('Error al guardar candidato:', error);
      
      // Manejar diferets tipos de errores
      if (error.response) {
        const errorMessage = error.response.data?.error || 'Error del servidor';
        
        if (error.response.status === 400) {
          // Errores de validación (como cédula duplicada)
          if (errorMessage.includes('cédula')) {
            alert(`Error: ${errorMessage}`);
            // Resaltar el campo de cédula
            setErrors(prev => ({
              ...prev,
              cedula: errorMessage
            }));
          } else {
            alert(`Datos inválidos: ${errorMessage}`);
          }
        } else if (error.response.status === 500) {
          alert(`Error interno del servidor: ${errorMessage}`);
        } else {
          alert(`Error: ${errorMessage}`);
        }
      } else if (error.request) {
        // No se recibió respuesta del servidor
        alert('Error de conexión: No se pudo conectar con el servidor. Verifique su conexión a internet.');
      } else {
        // Error en la configuración de la petición
        alert('Error inesperado: ' + error.message);
      }
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ overflow: 'hidden' }}>
          <Box sx={{ bgcolor: 'primary.main', color: 'white', p: 3 }}>
            <Typography variant="h4" component="h1" fontWeight="bold">
              Registro de Candidato
            </Typography>
            <Typography variant="subtitle1" sx={{ opacity: 0.9, mt: 1 }}>
              Complete la información del nuevo candidato
            </Typography>
          </Box>

          <CardContent>
            <form onSubmit={handleSubmit}>
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                  Información Personal
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Cédula"
                      name="cedula"
                      value={formData.cedula}
                      onChange={handleChange}
                      required
                      variant="outlined"
                      error={!!errors.cedula}
                      helperText={errors.cedula}
                      inputProps={{ maxLength: 11 }}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Nombre Completo"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      required
                      variant="outlined"
                      error={!!errors.nombre}
                      helperText={errors.nombre}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                </Grid>
              </Box>

              <Divider sx={{ my: 3 }} />

              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                  Información Laboral
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth error={!!errors.puesto_aspira}>
                      <InputLabel>Puesto Aspirado</InputLabel>
                      <Select
                        name="puesto_aspira"
                        value={formData.puesto_aspira}
                        onChange={handleChange}
                        label="Puesto Aspirado"
                        required
                        sx={{ 
                          '& .MuiOutlinedInput-root': { borderRadius: 2 },
                          minWidth: 200
                        }}
                      >
                        {puestos
                          .filter(puesto => puesto.estado)
                          .map((puesto) => (
                            <MenuItem key={puesto.id} value={puesto.nombre}>
                              {puesto.nombre}
                            </MenuItem>
                          ))}
                      </Select>
                      {errors.puesto_aspira && (
                        <FormHelperText>{errors.puesto_aspira}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Departamento"
                      name="departamento"
                      value={formData.departamento}
                      onChange={handleChange}
                      required
                      variant="outlined"
                      error={!!errors.departamento}
                      helperText={errors.departamento}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Salario Aspirado"
                      name="salario_aspira"
                      type="number"
                      value={formData.salario_aspira}
                      onChange={handleChange}
                      required
                      variant="outlined"
                      error={!!errors.salario_aspira}
                      helperText={errors.salario_aspira}
                      inputProps={{ min: 1000, step: 1000 }}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Recomendado Por"
                      name="recomendado_por"
                      value={formData.recomendado_por}
                      onChange={handleChange}
                      variant="outlined"
                      error={!!errors.recomendado_por}
                      helperText={errors.recomendado_por}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                </Grid>
              </Box>

              <Divider sx={{ my: 3 }} />

              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                  Competencias
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <FormControl fullWidth error={!!errors.competencias}>
                      <InputLabel>Competencias</InputLabel>
                      <Select
                        multiple
                        name="competencias"
                        value={formData.competencias}
                        onChange={handleMultiSelectChange('competencias')}
                        input={<OutlinedInput label="Competencias" />}
                        renderValue={(selected) => (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected.map((value) => (
                              <Chip 
                                key={value} 
                                label={value}
                                size="small"
                                color="primary"
                                variant="outlined"
                              />
                            ))}
                          </Box>
                        )}
                        sx={{ 
                          '& .MuiOutlinedInput-root': { borderRadius: 2 },
                          minWidth: 200
                        }}
                      >
                        {competenciasDisponibles
                          .filter(comp => comp.estado)
                          .map((competencia) => (
                          <MenuItem key={competencia.id} value={competencia.descripcion}>
                            {competencia.descripcion}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.competencias && (
                        <FormHelperText>{errors.competencias}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                </Grid>
              </Box>

              <Divider sx={{ my: 3 }} />

              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                  Idiomas
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Idiomas</InputLabel>
                      <Select
                        multiple
                        name="idiomas"
                        value={formData.idiomas}
                        onChange={handleMultiSelectChange('idiomas')}
                        input={<OutlinedInput label="Idiomas" />}
                        renderValue={(selected) => (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected.map((value) => (
                              <Chip 
                                key={value} 
                                label={value}
                                size="small"
                                color="secondary"
                                variant="outlined"
                              />
                            ))}
                          </Box>
                        )}
                        sx={{ 
                          '& .MuiOutlinedInput-root': { borderRadius: 2 },
                          minWidth: 200
                        }}
                      >
                        {idiomasDisponibles
                          .filter(idioma => idioma.estado)
                          .map((idioma) => (
                          <MenuItem key={idioma.id} value={idioma.nombre}>
                            {idioma.nombre}
                          </MenuItem>
                        ))}
                      </Select>
                      <FormHelperText>Opcional - Seleccione los idiomas que domina</FormHelperText>
                    </FormControl>
                  </Grid>
                </Grid>
              </Box>

              <Divider sx={{ my: 3 }} />

              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                  Capacitaciones
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Descripción"
                      name="descripcion"
                      value={capacitacionForm.descripcion}
                      onChange={handleCapacitacionChange}
                      variant="outlined"
                      error={!!capacitacionErrors.descripcion}
                      helperText={capacitacionErrors.descripcion}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth error={!!capacitacionErrors.nivel}>
                      <InputLabel>Nivel</InputLabel>
                      <Select
                        name="nivel"
                        value={capacitacionForm.nivel}
                        onChange={handleCapacitacionChange}
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
                      {capacitacionErrors.nivel && (
                        <FormHelperText>{capacitacionErrors.nivel}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Fecha Desde"
                      name="fecha_desde"
                      type="date"
                      value={capacitacionForm.fecha_desde}
                      onChange={handleCapacitacionChange}
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                      error={!!capacitacionErrors.fecha_desde}
                      helperText={capacitacionErrors.fecha_desde}
                      inputProps={{ max: new Date().toISOString().split('T')[0] }}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Fecha Hasta"
                      name="fecha_hasta"
                      type="date"
                      value={capacitacionForm.fecha_hasta}
                      onChange={handleCapacitacionChange}
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                      error={!!capacitacionErrors.fecha_hasta}
                      helperText={capacitacionErrors.fecha_hasta}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Institución"
                      name="institucion"
                      value={capacitacionForm.institucion}
                      onChange={handleCapacitacionChange}
                      variant="outlined"
                      error={!!capacitacionErrors.institucion}
                      helperText={capacitacionErrors.institucion}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      variant="outlined"
                      startIcon={<AddIcon />}
                      onClick={handleAddCapacitacion}
                      sx={{ 
                        borderRadius: 2,
                        textTransform: 'none',
                        mt: 1
                      }}
                    >
                      Agregar Capacitación
                    </Button>
                  </Grid>
                </Grid>

                {/* Lista de Capacitaciones */}
                {capacitaciones.length > 0 && (
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="subtitle1" sx={{ mb: 2 }}>
                      Capacitaciones Agregadas
                    </Typography>
                    <Grid container spacing={2}>
                      {capacitaciones.map((capacitacion) => (
                        <Grid item xs={12} key={capacitacion.id}>
                          <Paper 
                            elevation={1} 
                            sx={{ 
                              p: 2, 
                              display: 'flex', 
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              borderRadius: 2
                            }}
                          >
                            <Box>
                              <Typography variant="subtitle1" fontWeight="bold">
                                {capacitacion.descripcion}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {capacitacion.nivel} - {capacitacion.institucion}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {new Date(capacitacion.fecha_desde).toLocaleDateString()} - 
                                {capacitacion.fecha_hasta ? new Date(capacitacion.fecha_hasta).toLocaleDateString() : 'Presente'}
                              </Typography>
                            </Box>
                            <IconButton
                              color="error"
                              onClick={() => handleRemoveCapacitacion(capacitacion.id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}
              </Box>

              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 4 }}>
                <Button
                  variant="outlined"
                  startIcon={<CancelIcon />}
                  onClick={() => navigate('/')}
                  sx={{ 
                    borderRadius: 2,
                    px: 3,
                    py: 1.5,
                    textTransform: 'none',
                    fontSize: '1rem'
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<SaveIcon />}
                  sx={{ 
                    borderRadius: 2,
                    px: 3,
                    py: 1.5,
                    textTransform: 'none',
                    fontSize: '1rem',
                    boxShadow: 2
                  }}
                >
                  Guardar Candidato
                </Button>
              </Box>
            </form>
          </CardContent>
        </Paper>
      </Box>
    </Container>
  );
};

export default CandidatoForm; 