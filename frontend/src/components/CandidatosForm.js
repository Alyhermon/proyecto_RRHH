import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Grid, 
  TextField, 
  MenuItem, 
  Select, 
  OutlinedInput, 
  FormControl, 
  InputLabel, 
  Chip, 
  Button,
  Typography,
  Paper,
  IconButton
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import axios from 'axios';

const CandidatosForm = ({ candidato, onSubmit }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    cedula: '',
    puesto_aspira: '',
    departamento: '',
    salario_aspira: '',
    competencias: [],
    capacitaciones: [],
    recomendado_por: ''
  });

  const [capacitacionForm, setCapacitacionForm] = useState({
    descripcion: '',
    nivel: '',
    fecha_desde: '',
    fecha_hasta: '',
    institucion: ''
  });

  const [competencias, setCompetencias] = useState([]);
  const [capacitaciones, setCapacitaciones] = useState([]);
  const [puestos, setPuestos] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [openCompetencias, setOpenCompetencias] = useState(false);
  const [openCapacitaciones, setOpenCapacitaciones] = useState(false);

  useEffect(() => {
    if (candidato) {
      setFormData(candidato);
    }
    fetchCompetencias();
    fetchCapacitaciones();
    fetchPuestos();
    fetchDepartamentos();
  }, [candidato]);

  const fetchCompetencias = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/competencias');
      setCompetencias(response.data);
    } catch (error) {
      console.error('Error al cargar competencias:', error);
    }
  };

  const fetchCapacitaciones = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/capacitaciones');
      setCapacitaciones(response.data);
    } catch (error) {
      console.error('Error al cargar capacitaciones:', error);
    }
  };

  const fetchPuestos = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/puestos');
      setPuestos(response.data);
    } catch (error) {
      console.error('Error al cargar puestos:', error);
    }
  };

  const fetchDepartamentos = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/departamentos');
      setDepartamentos(response.data);
    } catch (error) {
      console.error('Error al cargar departamentos:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCapacitacionChange = (e) => {
    const { name, value } = e.target;
    setCapacitacionForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCompetenciasChange = (event) => {
    const {
      target: { value },
    } = event;
    setFormData(prev => ({
      ...prev,
      competencias: typeof value === 'string' ? value.split(',') : value,
    }));
  };

  const handleAddCapacitacion = () => {
    if (capacitacionForm.descripcion && capacitacionForm.nivel && capacitacionForm.fecha_desde && capacitacionForm.institucion) {
      setFormData(prev => ({
        ...prev,
        capacitaciones: [...prev.capacitaciones, { ...capacitacionForm }]
      }));
      setCapacitacionForm({
        descripcion: '',
        nivel: '',
        fecha_desde: '',
        fecha_hasta: '',
        institucion: ''
      });
    }
  };

  const handleRemoveCapacitacion = (index) => {
    setFormData(prev => ({
      ...prev,
      capacitaciones: prev.capacitaciones.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
            variant="outlined"
            sx={{ mb: 2 }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Cédula"
            name="cedula"
            value={formData.cedula}
            onChange={handleChange}
            required
            variant="outlined"
            sx={{ mb: 2 }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            select
            label="Puesto al que Aspira"
            name="puesto_aspira"
            value={formData.puesto_aspira}
            onChange={handleChange}
            required
            variant="outlined"
            sx={{ mb: 2 }}
          >
            {puestos.map((puesto) => (
              <MenuItem key={puesto.id} value={puesto.id}>
                {puesto.nombre}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            select
            label="Departamento"
            name="departamento"
            value={formData.departamento}
            onChange={handleChange}
            required
            variant="outlined"
            sx={{ mb: 2 }}
          >
            {departamentos.map((departamento) => (
              <MenuItem key={departamento.id} value={departamento.id}>
                {departamento.nombre}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Salario al que Aspira"
            name="salario_aspira"
            type="number"
            value={formData.salario_aspira}
            onChange={handleChange}
            required
            variant="outlined"
            sx={{ mb: 2 }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Recomendado por"
            name="recomendado_por"
            value={formData.recomendado_por}
            onChange={handleChange}
            variant="outlined"
            sx={{ mb: 2 }}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Competencias</InputLabel>
            <Select
              multiple
              value={formData.competencias}
              onChange={handleCompetenciasChange}
              input={<OutlinedInput label="Competencias" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => {
                    const competencia = competencias.find(c => c.id === value);
                    return (
                      <Chip 
                        key={value} 
                        label={competencia ? competencia.nombre : value}
                        color="primary"
                        variant="outlined"
                      />
                    );
                  })}
                </Box>
              )}
            >
              {competencias.map((competencia) => (
                <MenuItem key={competencia.id} value={competencia.id}>
                  {competencia.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Sección de Capacitaciones */}
        <Grid item xs={12}>
          <Typography variant="h6" sx={{ mb: 2 }}>Capacitaciones</Typography>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Descripción"
                  name="descripcion"
                  value={capacitacionForm.descripcion}
                  onChange={handleCapacitacionChange}
                  required
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nivel"
                  name="nivel"
                  value={capacitacionForm.nivel}
                  onChange={handleCapacitacionChange}
                  required
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Fecha Desde"
                  name="fecha_desde"
                  type="date"
                  value={capacitacionForm.fecha_desde}
                  onChange={handleCapacitacionChange}
                  required
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Fecha Hasta"
                  name="fecha_hasta"
                  type="date"
                  value={capacitacionForm.fecha_hasta}
                  onChange={handleCapacitacionChange}
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Institución"
                  name="institucion"
                  value={capacitacionForm.institucion}
                  onChange={handleCapacitacionChange}
                  required
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  onClick={handleAddCapacitacion}
                  sx={{ mt: 1 }}
                >
                  Agregar Capacitación
                </Button>
              </Grid>
            </Grid>
          </Paper>

          {/* Lista de Capacitaciones Agregadas */}
          {formData.capacitaciones.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>Capacitaciones Agregadas:</Typography>
              {formData.capacitaciones.map((capacitacion, index) => (
                <Paper key={index} sx={{ p: 2, mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="subtitle2">{capacitacion.descripcion}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Nivel: {capacitacion.nivel} | 
                      Desde: {new Date(capacitacion.fecha_desde).toLocaleDateString()} | 
                      Hasta: {capacitacion.fecha_hasta ? new Date(capacitacion.fecha_hasta).toLocaleDateString() : 'Presente'} | 
                      Institución: {capacitacion.institucion}
                    </Typography>
                  </Box>
                  <IconButton 
                    color="error" 
                    onClick={() => handleRemoveCapacitacion(index)}
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Paper>
              ))}
            </Box>
          )}
        </Grid>

        <Grid item xs={12}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            {candidato ? 'Actualizar Candidato' : 'Crear Candidato'}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CandidatosForm; 