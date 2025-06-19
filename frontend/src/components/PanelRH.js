import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Divider,
  InputAdornment,
  FormHelperText
} from '@mui/material';
import {
  People as PeopleIcon,
  Work as WorkIcon,
  School as SchoolIcon,
  Language as LanguageIcon,
  Psychology as PsychologyIcon,
  Assessment as AssessmentIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  FilterList as FilterListIcon,
  PictureAsPdf as PdfIcon,
  Visibility as VisibilityIcon,
  SwapHoriz as SwapHorizIcon
} from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const PanelRH = () => {
  const [candidatos, setCandidatos] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [filtros, setFiltros] = useState({
    puesto: '',
    competencia: '',
    fechaInicio: '',
    fechaFin: ''
  });
  const [puestos, setPuestos] = useState([]);
  const [competencias, setCompetencias] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCandidatos, setFilteredCandidatos] = useState([]);
  
  // Estado para errores de validación
  const [errors, setErrors] = useState({});
  
  // Estado para el diálogo de cambio de estado
  const [dialogoEstado, setDialogoEstado] = useState({
    abierto: false,
    empleado: null,
    nuevoEstado: ''
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!candidatos) return;
    
    if (!searchTerm.trim()) {
      setFilteredCandidatos(candidatos);
    } else {
      const searchTermLower = searchTerm.toLowerCase();
      const filtered = candidatos.filter(candidato => {
        const nombre = candidato.nombre?.toLowerCase() || '';
        const cedula = candidato.cedula?.toLowerCase() || '';
        const puesto = candidato.puesto_aspira?.toLowerCase() || '';
        const departamento = candidato.departamento?.toLowerCase() || '';

        return nombre.includes(searchTermLower) ||
               cedula.includes(searchTermLower) ||
               puesto.includes(searchTermLower) ||
               departamento.includes(searchTermLower);
      });
      setFilteredCandidatos(filtered);
    }
  }, [searchTerm, candidatos]);

  const fetchData = async () => {
    try {
      const [candidatosRes, empleadosRes, puestosRes, competenciasRes] = await Promise.all([
        axios.get('http://localhost:3000/api/candidatos'),
        axios.get('http://localhost:3000/api/empleados'),
        axios.get('http://localhost:3000/api/puestos'),
        axios.get('http://localhost:3000/api/competencias')
      ]);

      setCandidatos(candidatosRes.data);
      setEmpleados(empleadosRes.data);
      setPuestos(puestosRes.data);
      setCompetencias(competenciasRes.data);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    }
  };

  // Funciones de validación para fechas
  const validateFechaInicio = (fechaInicio, fechaFin) => {
    if (!fechaInicio) return ''; // No es requerida
    
    const fechaInicioDate = new Date(fechaInicio);
    const fechaActual = new Date();
    fechaActual.setHours(0, 0, 0, 0);
    
    if (fechaInicioDate > fechaActual) {
      return 'La fecha de inicio no puede ser futura';
    }
    
    if (fechaFin) {
      const fechaFinDate = new Date(fechaFin);
      if (fechaInicioDate > fechaFinDate) {
        return 'La fecha de inicio debe ser anterior a la fecha fin';
      }
    }
    
    return '';
  };

  const validateFechaFin = (fechaFin, fechaInicio) => {
    if (!fechaFin) return ''; // No es requerida
    
    const fechaFinDate = new Date(fechaFin);
    const fechaActual = new Date();
    fechaActual.setHours(0, 0, 0, 0);
    
    if (fechaFinDate > fechaActual) {
      return 'La fecha fin no puede ser futura';
    }
    
    if (fechaInicio) {
      const fechaInicioDate = new Date(fechaInicio);
      if (fechaFinDate < fechaInicioDate) {
        return 'La fecha fin debe ser posterior a la fecha de inicio';
      }
    }
    
    return '';
  };

  const validateFiltros = () => {
    const newErrors = {};
    
    const errorFechaInicio = validateFechaInicio(filtros.fechaInicio, filtros.fechaFin);
    if (errorFechaInicio) newErrors.fechaInicio = errorFechaInicio;
    
    const errorFechaFin = validateFechaFin(filtros.fechaFin, filtros.fechaInicio);
    if (errorFechaFin) newErrors.fechaFin = errorFechaFin;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    const updatedFiltros = {
      ...filtros,
      [name]: value
    };
    
    setFiltros(updatedFiltros);
    
    // Validar en tiempo real solo para fechas
    if (name === 'fechaInicio' || name === 'fechaFin') {
      const newErrors = { ...errors };
      
      if (name === 'fechaInicio') {
        const errorFechaInicio = validateFechaInicio(value, updatedFiltros.fechaFin);
        if (errorFechaInicio) {
          newErrors.fechaInicio = errorFechaInicio;
        } else {
          delete newErrors.fechaInicio;
        }
        
        // También revalidar fechaFin si existe
        if (updatedFiltros.fechaFin) {
          const errorFechaFin = validateFechaFin(updatedFiltros.fechaFin, value);
          if (errorFechaFin) {
            newErrors.fechaFin = errorFechaFin;
          } else {
            delete newErrors.fechaFin;
          }
        }
      }
      
      if (name === 'fechaFin') {
        const errorFechaFin = validateFechaFin(value, updatedFiltros.fechaInicio);
        if (errorFechaFin) {
          newErrors.fechaFin = errorFechaFin;
        } else {
          delete newErrors.fechaFin;
        }
        
        // También revalidar fechaInicio si existe
        if (updatedFiltros.fechaInicio) {
          const errorFechaInicio = validateFechaInicio(updatedFiltros.fechaInicio, value);
          if (errorFechaInicio) {
            newErrors.fechaInicio = errorFechaInicio;
          } else {
            delete newErrors.fechaInicio;
          }
        }
      }
      
      setErrors(newErrors);
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleReporte = async () => {
    // Validar antes de generar el reporte
    if (!validateFiltros()) {
      return;
    }

    try {
      // Obtener los datos de empleados filtrados
      const response = await axios.get('http://localhost:3000/api/empleados/reporte', {
        params: {
          fecha_inicio: filtros.fechaInicio,
          fecha_fin: filtros.fechaFin
        }
      });
      
      const empleadosReporte = response.data;
      
      // Generar PDF
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;
      
      // Configurar fuentes y colores
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(20);
      doc.setTextColor(25, 118, 210); // Color azul
      
      // Título del reporte
      const titulo = 'REPORTE DE EMPLEADOS';
      const tituloWidth = doc.getTextWidth(titulo);
      const tituloX = (pageWidth - tituloWidth) / 2;
      doc.text(titulo, tituloX, 30);
      
      // Información de la empresa
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text('Sistema de Recursos Humanos', pageWidth / 2, 40, { align: 'center' });
      
      // Fecha del reporte
      const fechaReporte = new Date().toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      doc.text(`Generado: ${fechaReporte}`, pageWidth / 2, 50, { align: 'center' });
      
      // Período del reporte si hay filtros de fecha
      let yPosition = 65;
      if (filtros.fechaInicio || filtros.fechaFin) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.text('PERÍODO DEL REPORTE:', 20, yPosition);
        doc.setFont('helvetica', 'normal');
        
        let periodo = '';
        if (filtros.fechaInicio && filtros.fechaFin) {
          periodo = `Desde: ${new Date(filtros.fechaInicio).toLocaleDateString()} hasta: ${new Date(filtros.fechaFin).toLocaleDateString()}`;
        } else if (filtros.fechaInicio) {
          periodo = `Desde: ${new Date(filtros.fechaInicio).toLocaleDateString()}`;
        } else if (filtros.fechaFin) {
          periodo = `Hasta: ${new Date(filtros.fechaFin).toLocaleDateString()}`;
        }
        
        doc.text(periodo, 20, yPosition + 8);
        yPosition += 20;
      }
      
      // Resumen estadístico
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text('RESUMEN:', 20, yPosition);
      doc.setFont('helvetica', 'normal');
      doc.text(`Total de empleados: ${empleadosReporte.length}`, 20, yPosition + 8);
      
      const empleadosActivos = empleadosReporte.filter(emp => emp.estado === 'Activo').length;
      const empleadosInactivos = empleadosReporte.filter(emp => emp.estado === 'Inactivo').length;
      
      doc.text(`Empleados activos: ${empleadosActivos}`, 20, yPosition + 16);
      doc.text(`Empleados inactivos: ${empleadosInactivos}`, 20, yPosition + 24);
      
      yPosition += 40;
      
      // Crear tabla con puesto más ancho
      const tableHeaders = ['Nombre', 'Cédula', 'Departamento', 'Puesto', 'Fecha Ingreso', 'Estado'];
      const colWidths = [35, 25, 30, 45, 25, 25];
      const rowHeight = 10;
      const margin = 15;
      
      // Encabezados de tabla
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      
      // Dibujar fondo azul completo para toda la fila de encabezados
      doc.setFillColor(25, 118, 210); // Azul
      const totalWidth = colWidths.reduce((sum, width) => sum + width, 0);
      doc.rect(margin, yPosition, totalWidth, rowHeight, 'F');
      
      // Configurar texto blanco para encabezados
      doc.setTextColor(255, 255, 255); // Blanco
      
      let xPos = margin;
      for (let i = 0; i < tableHeaders.length; i++) {
        doc.text(tableHeaders[i], xPos + 2, yPosition + 7);
        xPos += colWidths[i];
      }
      
      yPosition += rowHeight;
      
      // Datos de la tabla
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(0, 0, 0);
      
      empleadosReporte.forEach((empleado, index) => {
        // Alternar colores de fila
        if (index % 2 === 0) {
          doc.setFillColor(245, 245, 245);
          let xPosRow = margin;
          for (let i = 0; i < colWidths.length; i++) {
            doc.rect(xPosRow, yPosition, colWidths[i], rowHeight, 'F');
            xPosRow += colWidths[i];
          }
        }
        
        const rowData = [
          empleado.nombre || 'N/A',
          empleado.cedula || 'N/A',
          empleado.departamento || 'N/A',
          empleado.puestos?.nombre || 'N/A',
          empleado.fecha_ingreso ? new Date(empleado.fecha_ingreso).toLocaleDateString() : 'N/A',
          empleado.estado || 'N/A'
        ];
        
        xPos = margin;
        for (let i = 0; i < rowData.length; i++) {
          let text = rowData[i].toString();
          
          // Para el puesto (columna 3), permitir texto más largo
          if (i === 3) {
            // Truncar solo si es extremadamente largo
            if (text.length > 20) {
              text = text.substring(0, 20) + '...';
            }
          } else {
            // Para otras columnas, truncar en 15 caracteres
            if (text.length > 15) {
              text = text.substring(0, 15) + '...';
            }
          }
          
          doc.text(text, xPos + 2, yPosition + 7);
          xPos += colWidths[i];
        }
        
        yPosition += rowHeight;
        
        // Nueva página si es necesario
        if (yPosition > pageHeight - 40) {
          doc.addPage();
          yPosition = 30;
        }
      });
      
      // Pie de página
      if (yPosition < pageHeight - 40) {
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text('Reporte generado automáticamente por el Sistema de RH', pageWidth / 2, pageHeight - 20, { align: 'center' });
        
        // Línea separadora
        doc.setDrawColor(200, 200, 200);
        doc.line(20, pageHeight - 30, pageWidth - 20, pageHeight - 30);
      }
      
      // Generar nombre del archivo
      const fechaArchivo = new Date().toISOString().split('T')[0];
      let nombreArchivo = `reporte_empleados_${fechaArchivo}`;
      
      if (filtros.fechaInicio || filtros.fechaFin) {
        nombreArchivo += '_filtrado';
      }
      
      // Descargar el PDF
      doc.save(`${nombreArchivo}.pdf`);
      
      // Actualizar la tabla en pantalla con los datos del reporte
      setEmpleados(empleadosReporte);
      
    } catch (error) {
      console.error('Error al generar reporte:', error);
      alert('Error al generar el reporte PDF. Por favor, intente nuevamente.');
    }
  };

  const handleContratar = async (id) => {
    const candidato = candidatos.find(c => c.id === id);
    if (!candidato) return;

    // Buscar el puesto por nombre para obtener su ID
    const puesto = puestos.find(p => p.nombre === candidato.puesto_aspira);
    if (!puesto) {
      alert('Error: No se encontró el puesto especificado');
      return;
    }

    if (window.confirm(`¿Está seguro de contratar a ${candidato.nombre} como ${candidato.puesto_aspira}?`)) {
      try {
        const empleadoData = {
          nombre: candidato.nombre,
          cedula: candidato.cedula,
          puesto_id: puesto.id, 
          departamento: candidato.departamento,
          salario_mensual: candidato.salario_aspira,
          fecha_ingreso: new Date().toISOString().split('T')[0],
          idiomas: candidato.idiomas
        };

        const response = await axios.post('http://localhost:3000/api/empleados', empleadoData);
        
        if (response.status === 201) {
          await axios.delete(`http://localhost:3000/api/candidatos/${id}`);
          fetchData();
          alert('Empleado contratado exitosamente');
        }
      } catch (error) {
        console.error('Error al contratar empleado:', error);
        if (error.response?.status === 400) {
          alert(error.response.data.error || 'Error al contratar empleado');
        } else {
          alert('Error al contratar empleado');
        }
      }
    }
  };

  const handleEliminarEmpleado = async (empleadoId) => {
    if (window.confirm('¿Está seguro de eliminar este empleado? Esta acción no se puede deshacer.')) {
      try {
        await axios.delete(`http://localhost:3000/api/empleados/${empleadoId}`);
        fetchData();
      } catch (error) {
        console.error('Error al eliminar empleado:', error);
      }
    }
  };

  const handleAbrirDialogoEstado = (empleado) => {
    setDialogoEstado({
      abierto: true,
      empleado: empleado,
      nuevoEstado: empleado.estado
    });
  };

  const handleCerrarDialogoEstado = () => {
    setDialogoEstado({
      abierto: false,
      empleado: null,
      nuevoEstado: ''
    });
  };

  const handleCambiarEstado = async () => {
    try {
      const { empleado, nuevoEstado } = dialogoEstado;
      
      if (!empleado || !nuevoEstado) {
        alert('Error: Datos incompletos');
        return;
      }

      const response = await axios.put(`http://localhost:3000/api/empleados/${empleado.id}/estado`, {
        estado: nuevoEstado
      });

      if (response.status === 200) {
        await fetchData();
        handleCerrarDialogoEstado();
        alert(`Estado del empleado ${empleado.nombre} cambiado a ${nuevoEstado} exitosamente`);
      }
    } catch (error) {
      console.error('Error al cambiar estado del empleado:', error);
      if (error.response?.data?.error) {
        alert(`Error: ${error.response.data.error}`);
      } else {
        alert('Error al cambiar el estado del empleado. Por favor, intente nuevamente.');
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este candidato?')) {
      try {
        await axios.delete(`http://localhost:3000/api/candidatos/${id}`);
        fetchData(); 
      } catch (error) {
        console.error('Error al eliminar candidato:', error);
      }
    }
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <Paper elevation={2} sx={{ p: 3, mb: 4, bgcolor: 'primary.main', color: 'white' }}>
          <Typography variant="h4" component="h1" fontWeight="bold">
            Panel de Recursos Humanos
          </Typography>
          <Typography variant="subtitle1" sx={{ opacity: 0.9, mt: 1 }}>
            Centro de control para la gestión de candidatos y empleados
          </Typography>
        </Paper>

        <Grid container spacing={4}>

          <TextField
            fullWidth
            variant="outlined"
            placeholder="Filtrar candidatos por nombre, cédula, puesto o departamento..."
            value={searchTerm}
            onChange={handleSearchChange}
            sx={{ mb: 3 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FilterListIcon />
                </InputAdornment>
              ),
            }}
          />

          <Grid item xs={12}>
            <Card elevation={3}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <WorkIcon sx={{ color: 'secondary.main', mr: 1 }} />
                  <Typography variant="h6" fontWeight="bold" color="secondary.main">
                    Reporte de Empleados
                  </Typography>
                </Box>
                <Divider sx={{ mb: 3 }} />
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={3}>
                    <TextField
                      fullWidth
                      label="Fecha Inicio"
                      type="date"
                      name="fechaInicio"
                      value={filtros.fechaInicio}
                      onChange={handleFiltroChange}
                      InputLabelProps={{ shrink: true }}
                      error={!!errors.fechaInicio}
                      helperText={errors.fechaInicio}
                      inputProps={{ max: new Date().toISOString().split('T')[0] }}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 }, minWidth: 200 }}
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField
                      fullWidth
                      label="Fecha Fin"
                      type="date"
                      name="fechaFin"
                      value={filtros.fechaFin}
                      onChange={handleFiltroChange}
                      InputLabelProps={{ shrink: true }}
                      error={!!errors.fechaFin}
                      helperText={errors.fechaFin}
                      inputProps={{ max: new Date().toISOString().split('T')[0] }}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 }, minWidth: 200 }}
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Button
                      fullWidth
                      variant="contained"
                      color="secondary"
                      startIcon={<PdfIcon />}
                      onClick={handleReporte}
                      disabled={Object.keys(errors).length > 0}
                      sx={{ 
                        borderRadius: 2,
                        py: 1.5,
                        textTransform: 'none',
                        fontSize: '1rem',
                        boxShadow: 2
                      }}
                    >
                      Generar PDF
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card elevation={3}>
              <CardContent sx={{ p: 0 }}>
                <Box sx={{ p: 3, pb: 0 }}>
                  <Typography variant="h6" fontWeight="bold" color="primary.main">
                    Lista de Candidatos ({filteredCandidatos.length})
                  </Typography>
                </Box>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Nombre</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Cédula</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Puesto Aspirado</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Departamento</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }} align="center">Acciones</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredCandidatos.map((candidato) => (
                        <TableRow key={candidato.id}>
                          <TableCell>{candidato.nombre}</TableCell>
                          <TableCell>{candidato.cedula}</TableCell>
                          <TableCell>
                            <Chip 
                              label={candidato.puesto_aspira || 'No especificado'}
                              color="primary"
                              variant="outlined"
                              size="small"
                            />
                          </TableCell>
                          <TableCell>{candidato.departamento}</TableCell>
                          <TableCell align="center">
                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                              <Button
                                variant="contained"
                                color="info"
                                size="small"
                                startIcon={<VisibilityIcon />}
                                onClick={() => navigate(`/detalle/candidato/${candidato.id}`)}
                                sx={{ 
                                  borderRadius: 2,
                                  textTransform: 'none',
                                  fontWeight: 'bold'
                                }}
                              >
                                Ver Detalles
                              </Button>
                              <Button
                                variant="contained"
                                color="success"
                                size="small"
                                startIcon={<AddIcon />}
                                onClick={() => handleContratar(candidato.id)}
                                sx={{ 
                                  borderRadius: 2,
                                  textTransform: 'none',
                                  fontWeight: 'bold'
                                }}
                              >
                                Contratar
                              </Button>
                              <Button
                                variant="contained"
                                color="primary"
                                size="small"
                                onClick={() => navigate(`/experiencia/${candidato.id}`)}
                                sx={{ 
                                  borderRadius: 2,
                                  textTransform: 'none',
                                  px: 2
                                }}
                              >
                                Experiencia
                              </Button>
                              <IconButton
                                color="error"
                                onClick={() => handleDelete(candidato.id)}
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
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card elevation={3}>
              <CardContent sx={{ p: 0 }}>
                <Box sx={{ p: 3, pb: 0 }}>
                  <Typography variant="h6" fontWeight="bold" color="secondary.main">
                    Lista de Empleados ({empleados.length})
                  </Typography>
                </Box>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ bgcolor: 'grey.50' }}>
                        <TableCell sx={{ fontWeight: 'bold' }}>Nombre</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Cédula</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Fecha Ingreso</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Departamento</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Puesto</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Estado</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }} align="center">Acciones</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {empleados.map((empleado) => (
                        <TableRow key={empleado.id} hover>
                          <TableCell>{empleado.nombre}</TableCell>
                          <TableCell>{empleado.cedula}</TableCell>
                          <TableCell>
                            {new Date(empleado.fecha_ingreso).toLocaleDateString()}
                          </TableCell>
                          <TableCell>{empleado.departamento}</TableCell>
                          <TableCell>{empleado.puestos?.nombre}</TableCell>
                          <TableCell>
                            <Chip 
                              label={empleado.estado}
                              color={empleado.estado === 'Activo' ? 'success' : 'error'}
                              size="small"
                              sx={{ fontWeight: 'bold' }}
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                              <Button
                                variant="contained"
                                color="info"
                                size="small"
                                startIcon={<VisibilityIcon />}
                                onClick={() => navigate(`/detalle/empleado/${empleado.id}`)}
                                sx={{ 
                                  borderRadius: 2,
                                  textTransform: 'none',
                                  fontWeight: 'bold'
                                }}
                              >
                                Ver Detalles
                              </Button>
                              <Button
                                variant="contained"
                                color="warning"
                                size="small"
                                startIcon={<SwapHorizIcon />}
                                onClick={() => handleAbrirDialogoEstado(empleado)}
                                sx={{ 
                                  borderRadius: 2,
                                  textTransform: 'none',
                                  fontWeight: 'bold'
                                }}
                              >
                                Cambiar Estado
                              </Button>
                              <IconButton
                                color="error"
                                onClick={() => handleEliminarEmpleado(empleado.id)}
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
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Dialog 
          open={dialogoEstado.abierto} 
          onClose={handleCerrarDialogoEstado}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ 
            bgcolor: 'warning.main', 
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            <SwapHorizIcon />
            Cambiar Estado del Empleado
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            {dialogoEstado.empleado && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  {dialogoEstado.empleado.nombre}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Cédula: {dialogoEstado.empleado.cedula}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Puesto: {dialogoEstado.empleado.puestos?.nombre}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Estado actual: <Chip 
                    label={dialogoEstado.empleado.estado}
                    color={dialogoEstado.empleado.estado === 'Activo' ? 'success' : 'error'}
                    size="small"
                  />
                </Typography>
                
                <FormControl fullWidth>
                  <InputLabel>Nuevo Estado</InputLabel>
                  <Select
                    value={dialogoEstado.nuevoEstado}
                    label="Nuevo Estado"
                    onChange={(e) => setDialogoEstado(prev => ({
                      ...prev,
                      nuevoEstado: e.target.value
                    }))}
                  >
                    <MenuItem value="Activo">Activo</MenuItem>
                    <MenuItem value="Inactivo">Inactivo</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button 
              onClick={handleCerrarDialogoEstado}
              sx={{ textTransform: 'none' }}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleCambiarEstado}
              variant="contained"
              color="warning"
              disabled={!dialogoEstado.nuevoEstado || dialogoEstado.nuevoEstado === dialogoEstado.empleado?.estado}
              sx={{ 
                textTransform: 'none',
                fontWeight: 'bold'
              }}
            >
              Confirmar Cambio
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default PanelRH; 