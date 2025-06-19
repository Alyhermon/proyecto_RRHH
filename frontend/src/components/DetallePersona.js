import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
  Paper,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Badge
} from '@mui/material';
import {
  Person as PersonIcon,
  Work as WorkIcon,
  School as SchoolIcon,
  Language as LanguageIcon,
  Psychology as PsychologyIcon,
  Business as BusinessIcon,
  CalendarToday as CalendarIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  AttachMoney as MoneyIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
  Download as DownloadIcon,
  Star as StarIcon,
  Verified as VerifiedIcon,
  Timeline as TimelineIcon
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

// Componente para TabPanel
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const DetallePersona = () => {
  const { id, type } = useParams(); // type puede ser 'candidato' o 'empleado'
  const navigate = useNavigate();
  const location = window.location.pathname;
  
  // Detectar el tipo basándose en la URL si no viene en los parámetros
  const personType = type || (location.includes('candidato') ? 'candidato' : 
                              location.includes('empleado') ? 'empleado' : 'candidato');
  
  const [persona, setPersona] = useState(null);
  const [experiencias, setExperiencias] = useState([]);
  const [capacitaciones, setCapacitaciones] = useState([]);
  const [competencias, setCompetencias] = useState([]);
  const [idiomas, setIdiomas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    fetchPersonaData();
  }, [id, personType]);

  const fetchPersonaData = async () => {
    setLoading(true);
    try {
      console.log(`Cargando datos para ${personType} con ID: ${id}`);
      
      // Cargar datos de la persona
      const personaResponse = await axios.get(
        `http://localhost:3000/api/${personType === 'empleado' ? 'empleados' : 'candidatos'}/${id}`
      );
      console.log('Datos de persona cargados:', personaResponse.data);
      setPersona(personaResponse.data);
      setEditData(personaResponse.data);

      // Cargar experiencia laboral
      const experienciaResponse = await axios.get(
        `http://localhost:3000/api/experiencia-laboral/${id}`
      );
      console.log('Experiencias cargadas:', experienciaResponse.data);
      setExperiencias(experienciaResponse.data);

      // Si es candidato, cargar capacitaciones
      if (personType !== 'empleado') {
        try {
          const capacitacionesResponse = await axios.get(
            `http://localhost:3000/api/candidatos/${id}/capacitaciones`
          );
          console.log('Capacitaciones cargadas desde endpoint específico:', capacitacionesResponse.data);
          setCapacitaciones(capacitacionesResponse.data);
          
          if (personaResponse.data.capacitaciones) {
            console.log('Capacitaciones también disponibles en datos del candidato:', personaResponse.data.capacitaciones);
          }
        } catch (err) {
          console.error('Error al cargar capacitaciones desde endpoint específico:', err);
          
          if (personaResponse.data.capacitaciones && personaResponse.data.capacitaciones.length > 0) {
            console.log('Usando capacitaciones del fallback:', personaResponse.data.capacitaciones);
            setCapacitaciones(personaResponse.data.capacitaciones);
          } else {
            console.log('No se encontraron capacitaciones en ningún lugar');
            setCapacitaciones([]);
          }
        }
      } else {
        setCapacitaciones([]);
      }

      setError(null);
    } catch (err) {
      console.error('Error al cargar datos:', err);
      setError('Error al cargar los datos de la persona');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleSave = async () => {
    try {
      await axios.put(
        `http://localhost:3000/api/${personType === 'empleado' ? 'empleados' : 'candidatos'}/${id}`,
        editData
      );
      setPersona(editData);
      setEditMode(false);
    } catch (err) {
      console.error('Error al guardar:', err);
      
      // Manejar diferentes tipos de errores
      if (err.response) {
        const errorMessage = err.response.data?.error || 'Error del servidor';
        
        if (err.response.status === 400) {
          // Errores de validación (como cédula duplicada)
          if (errorMessage.includes('cédula')) {
            alert(`Error: ${errorMessage}`);
          } else {
            alert(`Datos inválidos: ${errorMessage}`);
          }
        } else if (err.response.status === 500) {
          alert(`Error interno del servidor: ${errorMessage}`);
        } else {
          alert(`Error: ${errorMessage}`);
        }
      } else if (err.request) {
        alert('Error de conexión: No se pudo conectar con el servidor.');
      } else {
        alert('Error inesperado: ' + err.message);
      }
    }
  };

  const handleCancel = () => {
    setEditData(persona);
    setEditMode(false);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-DO', {
      style: 'currency',
      currency: 'DOP'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Alert severity="error" sx={{ mt: 4 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  if (!persona) {
    return (
      <Container maxWidth="lg">
        <Alert severity="warning" sx={{ mt: 4 }}>
          No se encontraron datos para esta persona
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1" fontWeight="bold">
            {personType === 'empleado' ? 'Detalles del Empleado' : 'Detalles del Candidato'}
          </Typography>
        </Box>

        <Card elevation={3} sx={{ mb: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={4}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Avatar
                    sx={{ 
                      width: 120, 
                      height: 120, 
                      mb: 2,
                      bgcolor: 'primary.main',
                      fontSize: '3rem'
                    }}
                  >
                    {persona.nombre?.charAt(0).toUpperCase()}
                  </Avatar>
                  <Typography variant="h5" fontWeight="bold" textAlign="center">
                    {persona.nombre}
                  </Typography>
                  <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                    {personType === 'empleado' ? persona.puestos?.nombre : persona.puesto_aspira}
                  </Typography>
                  
                  <Chip 
                  onClick={() => {}}
                    icon={<VerifiedIcon />}
                    label={personType === 'empleado' ? persona.estado : 'Candidato'}
                    color={personType === 'empleado' && persona.estado === 'Activo' ? 'success' : 'primary'}
                    variant="filled"
                    sx={{ mb: 2 }}
                  />

                  <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                    <Button
                      variant="outlined"
                      startIcon={<EditIcon />}
                      onClick={handleEdit}
                      size="small"
                    >
                      Editar
                    </Button>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} md={8}>
                <Typography variant="h6" gutterBottom color="primary.main">
                  Información Personal
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <PersonIcon sx={{ mr: 2, color: 'text.secondary' }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Cédula
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {persona.cedula}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <CalendarIcon sx={{ mr: 2, color: 'text.secondary' }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {personType === 'empleado' ? 'Fecha de Ingreso' : 'Fecha de Registro'}
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {formatDate(personType === 'empleado' ? persona.fecha_ingreso : persona.created_at)}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <BusinessIcon sx={{ mr: 2, color: 'text.secondary' }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Departamento
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {persona.departamento}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <MoneyIcon sx={{ mr: 2, color: 'text.secondary' }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {personType === 'empleado' ? 'Salario Actual' : 'Salario Aspirado'}
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {formatCurrency(personType === 'empleado' ? persona.salario_mensual : persona.salario_aspira)}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  {persona.recomendado_por && (
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <StarIcon sx={{ mr: 2, color: 'text.secondary' }} />
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Recomendado por
                          </Typography>
                          <Typography variant="body1" fontWeight="medium">
                            {persona.recomendado_por}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  )}
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Card elevation={3}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleTabChange} variant="scrollable">
              <Tab 
                icon={<WorkIcon />} 
                label={`Experiencia (${experiencias.length})`}
                iconPosition="start"
              />
              <Tab 
                icon={<SchoolIcon />} 
                label={`Capacitaciones (${capacitaciones.length})`}
                iconPosition="start"
              />
              <Tab 
                icon={<PsychologyIcon />} 
                label="Competencias"
                iconPosition="start"
              />
              <Tab 
                icon={<LanguageIcon />} 
                label="Idiomas"
                iconPosition="start"
              />
              <Tab 
                icon={<TimelineIcon />} 
                label="Cronología"
                iconPosition="start"
              />
            </Tabs>
          </Box>

          <TabPanel value={tabValue} index={0}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" fontWeight="bold">
                Experiencia Laboral
              </Typography>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => navigate(`/experiencia/${id}`)}
                size="small"
              >
                Agregar Experiencia
              </Button>
            </Box>
            
            {experiencias.length === 0 ? (
              <Alert severity="info">
                No hay experiencia laboral registrada
              </Alert>
            ) : (
              <Grid container spacing={3}>
                {experiencias.map((exp, index) => (
                  <Grid item xs={12} key={exp.id}>
                    <Card variant="outlined" sx={{ p: 3 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={8}>
                          <Typography variant="h6" fontWeight="bold" color="primary.main">
                            {exp.puesto_ocupado}
                          </Typography>
                          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                            {exp.empresa}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {formatDate(exp.fecha_desde)} - {exp.fecha_hasta ? formatDate(exp.fecha_hasta) : 'Presente'}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Box sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                            <Typography variant="h6" color="success.main">
                              {formatCurrency(exp.salario)}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Salario
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" fontWeight="bold">
                Capacitaciones y Formación
              </Typography>
              {personType !== 'empleado' && (
                <Typography variant="body2" color="text.secondary">
                  Total: {capacitaciones.length} capacitaciones
                </Typography>
              )}
            </Box>
            
            {personType === 'empleado' ? (
              <Alert severity="info">
                Las capacitaciones solo están disponibles para candidatos
              </Alert>
            ) : capacitaciones.length === 0 ? (
              <Alert severity="info">
                No hay capacitaciones registradas para este candidato
              </Alert>
            ) : (
              <Grid container spacing={3}>
                {capacitaciones.map((cap, index) => (
                  <Grid item xs={12} md={6} key={cap.id || index}>
                    <Card variant="outlined" sx={{ p: 3, height: '100%' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Typography variant="h6" fontWeight="bold" color="primary.main">
                          {cap.descripcion}
                        </Typography>
                        <Chip 
                          label={cap.nivel} 
                          color="secondary" 
                          size="small"
                        />
                      </Box>
                      
                      <Typography variant="body1" fontWeight="medium" gutterBottom>
                        {cap.institucion}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                        <CalendarIcon sx={{ mr: 1, color: 'text.secondary', fontSize: '1rem' }} />
                        <Typography variant="body2" color="text.secondary">
                          {cap.fecha_desde ? formatDate(cap.fecha_desde) : 'Fecha no especificada'} - {cap.fecha_hasta ? formatDate(cap.fecha_hasta) : 'En curso'}
                        </Typography>
                      </Box>
                      
                      {cap.created_at && (
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                          Registrado: {formatDate(cap.created_at)}
                        </Typography>
                      )}
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Competencias y Habilidades
            </Typography>
            
            {persona.competencias ? (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {persona.competencias.split(',').map((competencia, index) => (
                  <Chip
                    key={index}
                    label={competencia.trim()}
                    color="primary"
                    variant="outlined"
                    icon={<PsychologyIcon />}
                  />
                ))}
              </Box>
            ) : (
              <Alert severity="info">
                No hay competencias registradas
              </Alert>
            )}
          </TabPanel>

          <TabPanel value={tabValue} index={3}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Idiomas
            </Typography>
            
            {persona.idiomas ? (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {persona.idiomas.split(',').map((idioma, index) => (
                  <Chip
                    key={index}
                    label={idioma.trim()}
                    color="secondary"
                    variant="outlined"
                    icon={<LanguageIcon />}
                  />
                ))}
              </Box>
            ) : (
              <Alert severity="info">
                No hay idiomas registrados
              </Alert>
            )}
          </TabPanel>
          <TabPanel value={tabValue} index={4}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Cronología de Actividades
            </Typography>
            
            <Box sx={{ position: 'relative', pl: 4 }}>
              <Box
                sx={{
                  position: 'absolute',
                  left: '20px',
                  top: 0,
                  bottom: 0,
                  width: '2px',
                  bgcolor: 'primary.main'
                }}
              />
              
              <Box sx={{ mb: 3 }}>
                <Box
                  sx={{
                    position: 'absolute',
                    left: '14px',
                    width: '12px',
                    height: '12px',
                    bgcolor: 'primary.main',
                    borderRadius: '50%',
                    mt: 1
                  }}
                />
                <Card variant="outlined" sx={{ p: 2, ml: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {personType === 'empleado' ? 'Contratación' : 'Registro como candidato'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formatDate(personType === 'empleado' ? persona.fecha_ingreso : persona.created_at)}
                  </Typography>
                </Card>
              </Box>
              
              {experiencias.map((exp, index) => (
                <Box key={exp.id} sx={{ mb: 3 }}>
                  <Box
                    sx={{
                      position: 'absolute',
                      left: '14px',
                      width: '12px',
                      height: '12px',
                      bgcolor: 'secondary.main',
                      borderRadius: '50%',
                      mt: 1
                    }}
                  />
                  <Card variant="outlined" sx={{ p: 2, ml: 2 }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {exp.puesto_ocupado} en {exp.empresa}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(exp.fecha_desde)} - {exp.fecha_hasta ? formatDate(exp.fecha_hasta) : 'Presente'}
                    </Typography>
                  </Card>
                </Box>
              ))}
            </Box>
          </TabPanel>
        </Card>

        <Dialog open={editMode} onClose={handleCancel} maxWidth="md" fullWidth>
          <DialogTitle>
            Editar {personType === 'empleado' ? 'Empleado' : 'Candidato'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nombre"
                  value={editData.nombre || ''}
                  onChange={(e) => setEditData({...editData, nombre: e.target.value})}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Cédula"
                  value={editData.cedula || ''}
                  onChange={(e) => setEditData({...editData, cedula: e.target.value})}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Departamento"
                  value={editData.departamento || ''}
                  onChange={(e) => setEditData({...editData, departamento: e.target.value})}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={personType === 'empleado' ? 'Salario Actual' : 'Salario Aspirado'}
                  type="number"
                  value={editData.salario_mensual || editData.salario_aspira || ''}
                  onChange={(e) => setEditData({
                    ...editData, 
                    [personType === 'empleado' ? 'salario_mensual' : 'salario_aspira']: e.target.value
                  })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Idiomas"
                  value={editData.idiomas || ''}
                  onChange={(e) => setEditData({...editData, idiomas: e.target.value})}
                  placeholder="Ejemplo: Español, Inglés, Francés"
                  helperText="Separe los idiomas con comas"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancel}>Cancelar</Button>
            <Button onClick={handleSave} variant="contained">Guardar</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default DetallePersona; 