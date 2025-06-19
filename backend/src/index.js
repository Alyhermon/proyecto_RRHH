const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = "https://zbxvjajrpkkrkznsiifj.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpieHZqYWpycGtrcmt6bnNpaWZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk0MTgxODQsImV4cCI6MjA2NDk5NDE4NH0.RyqkHL1izvSEgulVaz6iZiD_ufQ7H0Vs-1qnamb-o0k"

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Faltan las variables de entorno de Supabase');
}

const supabase = createClient(supabaseUrl, supabaseKey);
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ============ ENDPOINTS PARA COMPETENCIAS ============
app.get('/api/competencias', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('competencias')
      .select('id, descripcion, estado')
      .order('descripcion');
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/competencias', async (req, res) => {
  try {
    const { descripcion, estado } = req.body;
    
    const { data, error } = await supabase
      .from('competencias')
      .insert([{ descripcion, estado }])
      .select('id, descripcion, estado');
    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/competencias/:id', async (req, res) => {
  try {
    const { descripcion, estado } = req.body;
    const { data, error } = await supabase
      .from('competencias')
      .update({ descripcion, estado })
      .eq('id', req.params.id)
      .select('id, descripcion, estado');
    if (error) throw error;
    res.json(data[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/competencias/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('competencias')
      .delete()
      .eq('id', req.params.id);
    if (error) throw error;
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ ENDPOINTS PARA IDIOMAS ============
app.get('/api/idiomas', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('idiomas')
      .select('id, nombre, estado')
      .order('nombre');
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/idiomas', async (req, res) => {
  try {
    const { nombre, estado } = req.body;
    const { data, error } = await supabase
      .from('idiomas')
      .insert([{ nombre, estado }])
      .select('id, nombre, estado');
    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/idiomas/:id', async (req, res) => {
  try {
    const { nombre, estado } = req.body;
    const { data, error } = await supabase
      .from('idiomas')
      .update({ nombre, estado })
      .eq('id', req.params.id)
      .select();
    if (error) throw error;
    res.json(data[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/idiomas/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('idiomas')
      .delete()
      .eq('id', req.params.id);
    if (error) throw error;
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ ENDPOINTS PARA CAPACITACIONES ============
app.get('/api/capacitaciones', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('capacitaciones')
      .select('*')
      .order('descripcion');
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/capacitaciones', async (req, res) => {
  try {
    const { descripcion, nivel, fecha_desde, fecha_hasta, institucion } = req.body;
    const { data, error } = await supabase
      .from('capacitaciones')
      .insert([{ descripcion, nivel, fecha_desde, fecha_hasta, institucion }])
      .select();
    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/capacitaciones/:id', async (req, res) => {
  try {
    const { descripcion, nivel, fecha_desde, fecha_hasta, institucion } = req.body;
    const { data, error } = await supabase
      .from('capacitaciones')
      .update({ descripcion, nivel, fecha_desde, fecha_hasta, institucion })
      .eq('id', req.params.id)
      .select();
    if (error) throw error;
    res.json(data[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/capacitaciones/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('capacitaciones')
      .delete()
      .eq('id', req.params.id);
    if (error) throw error;
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ ENDPOINTS PARA PUESTOS ============
app.get('/api/puestos', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('puestos')
      .select('*')
      .order('nombre');
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/puestos', async (req, res) => {
  try {
    const { nombre, nivel_riesgo, salario_minimo, salario_maximo, estado } = req.body;
    const { data, error } = await supabase
      .from('puestos')
      .insert([{ nombre, nivel_riesgo, salario_minimo, salario_maximo, estado }])
      .select();
    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/puestos/:id', async (req, res) => {
  try {
    const { nombre, nivel_riesgo, salario_minimo, salario_maximo, estado } = req.body;
    const { data, error } = await supabase
      .from('puestos')
      .update({ nombre, nivel_riesgo, salario_minimo, salario_maximo, estado })
      .eq('id', req.params.id)
      .select();
    if (error) throw error;
    res.json(data[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/puestos/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('puestos')
      .delete()
      .eq('id', req.params.id);
    if (error) throw error;
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ ENDPOINTS PARA CANDIDATOS ============
app.get('/api/candidatos', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('candidatos')
      .select('*, puestos(nombre)')
      .order('nombre');
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/candidatos', async (req, res) => {
  try {
    const { 
      nombre, 
      cedula, 
      puesto_aspira, 
      departamento, 
      salario_aspira, 
      competencias,
      idiomas,
      capacitaciones,
      recomendado_por 
    } = req.body;

    // Verificar si ya existe un candidato con esa cédula
    const { data: existingCandidate, error: checkCandidateError } = await supabase
      .from('candidatos')
      .select('*')
      .eq('cedula', cedula)
      .single();

    if (checkCandidateError && checkCandidateError.code !== 'PGRST116') {
      throw checkCandidateError;
    }

    if (existingCandidate) {
      return res.status(400).json({ error: 'Ya existe un candidato con esta cédula' });
    }

    // Verificar si ya existe un empleado con esa cédula
    const { data: existingEmployee, error: checkEmployeeError } = await supabase
      .from('empleados')
      .select('*')
      .eq('cedula', cedula)
      .single();

    if (checkEmployeeError && checkEmployeeError.code !== 'PGRST116') {
      throw checkEmployeeError;
    }

    if (existingEmployee) {
      return res.status(400).json({ error: 'Ya existe un empleado con esta cédula' });
    }

    // Primero creamos el candidato
    const { data: candidato, error: candidatoError } = await supabase
      .from('candidatos')
      .insert([{
        nombre,
        cedula,
        puesto_aspira,
        departamento,
        salario_aspira,
        competencias,
        idiomas,
        recomendado_por
      }])
      .select()
      .single();

    if (candidatoError) throw candidatoError;

    // Luego insertamos las capacitaciones
    if (capacitaciones && capacitaciones.length > 0) {
      const capacitacionesData = capacitaciones.map(cap => ({
        candidato_id: candidato.id,
        descripcion: cap.descripcion,
        nivel: cap.nivel,
        fecha_desde: cap.fecha_desde,
        fecha_hasta: cap.fecha_hasta,
        institucion: cap.institucion
      }));

      const { error: capacitacionesError } = await supabase
        .from('capacitaciones_candidatos')
        .insert(capacitacionesData);

      if (capacitacionesError) throw capacitacionesError;
    }

    // Obtenemos el candidato con sus capacitaciones
    const { data: candidatoCompleto, error: errorCompleto } = await supabase
      .from('candidatos')
      .select(`
        *,
        capacitaciones:capacitaciones_candidatos(*)
      `)
      .eq('id', candidato.id)
      .single();

    if (errorCompleto) throw errorCompleto;

    res.json(candidatoCompleto);
  } catch (error) {
    console.error('Error al crear candidato:', error);
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/candidatos/:id', async (req, res) => {
  try {
    const { 
      nombre, 
      cedula, 
      puesto_aspira, 
      departamento, 
      salario_aspira, 
      competencias,
      idiomas,
      capacitaciones,
      recomendado_por 
    } = req.body;

    // Verificar si ya existe otro candidato con esa cédula (excluyendo el actual)
    const { data: existingCandidate, error: checkCandidateError } = await supabase
      .from('candidatos')
      .select('*')
      .eq('cedula', cedula)
      .neq('id', req.params.id)
      .single();

    if (checkCandidateError && checkCandidateError.code !== 'PGRST116') {
      throw checkCandidateError;
    }

    if (existingCandidate) {
      return res.status(400).json({ error: 'Ya existe otro candidato con esta cédula' });
    }

    // Verificar si ya existe un empleado con esa cédula
    const { data: existingEmployee, error: checkEmployeeError } = await supabase
      .from('empleados')
      .select('*')
      .eq('cedula', cedula)
      .single();

    if (checkEmployeeError && checkEmployeeError.code !== 'PGRST116') {
      throw checkEmployeeError;
    }

    if (existingEmployee) {
      return res.status(400).json({ error: 'Ya existe un empleado con esta cédula' });
    }

    // Actualizamos el candidato
    const { data: candidato, error: candidatoError } = await supabase
      .from('candidatos')
      .update({
        nombre,
        cedula,
        puesto_aspira,
        departamento,
        salario_aspira,
        competencias,
        idiomas,
        recomendado_por
      })
      .eq('id', req.params.id)
      .select()
      .single();

    if (candidatoError) throw candidatoError;

    // Eliminamos las capacitaciones existentes
    const { error: deleteError } = await supabase
      .from('capacitaciones_candidatos')
      .delete()
      .eq('candidato_id', req.params.id);

    if (deleteError) throw deleteError;

    // Insertamos las nuevas capacitaciones
    if (capacitaciones && capacitaciones.length > 0) {
      const capacitacionesData = capacitaciones.map(cap => ({
        candidato_id: req.params.id,
        descripcion: cap.descripcion,
        nivel: cap.nivel,
        fecha_desde: cap.fecha_desde,
        fecha_hasta: cap.fecha_hasta,
        institucion: cap.institucion
      }));

      const { error: capacitacionesError } = await supabase
        .from('capacitaciones_candidatos')
        .insert(capacitacionesData);

      if (capacitacionesError) throw capacitacionesError;
    }

    // Obtenemos el candidato actualizado con sus capacitaciones
    const { data: candidatoCompleto, error: errorCompleto } = await supabase
      .from('candidatos')
      .select(`
        *,
        capacitaciones:capacitaciones_candidatos(*)
      `)
      .eq('id', req.params.id)
      .single();

    if (errorCompleto) throw errorCompleto;

    res.json(candidatoCompleto);
  } catch (error) {
    console.error('Error al actualizar candidato:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/candidatos/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('candidatos')
      .select(`
        *,
        capacitaciones:capacitaciones_candidatos(*)
      `)
      .eq('id', req.params.id)
      .single();

    if (error) throw error;
    
    console.log(`Candidato ${req.params.id} cargado con ${data.capacitaciones?.length || 0} capacitaciones`);
    res.json(data);
  } catch (error) {
    console.error('Error al obtener candidato:', error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/candidatos/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('candidatos')
      .delete()
      .eq('id', req.params.id);
    if (error) throw error;
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ ENDPOINTS PARA EXPERIENCIA LABORAL ============
app.get('/api/experiencia-laboral/:candidato_id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('experiencia_laboral')
      .select('*')
      .eq('candidato_id', req.params.candidato_id)
      .order('fecha_desde', { ascending: false });
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/experiencia-laboral/:candidato_id', async (req, res) => {
  try {
    let { empresa, puesto_ocupado, fecha_desde, fecha_hasta, salario } = req.body;
    if (!fecha_hasta) {
      fecha_hasta = undefined;
    }
    const { data, error } = await supabase
      .from('experiencia_laboral')
      .insert([{
        candidato_id: req.params.candidato_id,
        empresa,
        puesto_ocupado,
        fecha_desde,
        fecha_hasta,
        salario
      }])
      .select();
    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/experiencia-laboral/:id', async (req, res) => {
  try {
    const { empresa, puesto_ocupado, fecha_desde, fecha_hasta, salario } = req.body;
    const { data, error } = await supabase
      .from('experiencia_laboral')
      .update({
        empresa,
        puesto_ocupado,
        fecha_desde,
        fecha_hasta,
        salario
      })
      .eq('id', req.params.id)
      .select();
    if (error) throw error;
    res.json(data[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/experiencia-laboral/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('experiencia_laboral')
      .delete()
      .eq('id', req.params.id);
    if (error) throw error;
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ ENDPOINTS PARA EMPLEADOS ============
app.get('/api/empleados', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('empleados')
      .select('*, puestos(nombre)')
      .order('nombre');
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ REPORTE DE EMPLEADOS POR FECHA ============
app.get('/api/empleados/reporte', async (req, res) => {
  try {
    const { fecha_inicio, fecha_fin } = req.query;
    let query = supabase
      .from('empleados')
      .select('*, puestos(nombre)')
      .order('fecha_ingreso', { ascending: false });

    if (fecha_inicio && fecha_fin) {
      query = query
        .gte('fecha_ingreso', fecha_inicio)
        .lte('fecha_ingreso', fecha_fin);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/empleados/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('empleados')
      .select('*, puestos(nombre)')
      .eq('id', req.params.id)
      .single();
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/empleados/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('empleados')
      .delete()
      .eq('id', req.params.id);
    if (error) throw error;
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ CAMBIAR ESTADO DE EMPLEADO ============
app.put('/api/empleados/:id/estado', async (req, res) => {
  try {
    const { estado } = req.body;
    
    // Validar que el estado sea válido
    if (!estado || !['Activo', 'Inactivo'].includes(estado)) {
      return res.status(400).json({ error: 'Estado inválido. Debe ser "Activo" o "Inactivo"' });
    }

    const { data, error } = await supabase
      .from('empleados')
      .update({ estado })
      .eq('id', req.params.id)
      .select('*, puestos(nombre)')
      .single();

    if (error) throw error;
    
    if (!data) {
      return res.status(404).json({ error: 'Empleado no encontrado' });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ PROCESO DE SELECCIÓN - CONTRATAR CANDIDATO ============
app.post('/api/candidatos/:id/contratar', async (req, res) => {
  try {
    const { data: candidato, error: errorCandidato } = await supabase
      .from('candidatos')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (errorCandidato) throw errorCandidato;

    const { data: empleado, error: errorEmpleado } = await supabase
      .from('empleados')
      .insert([{
        cedula: candidato.cedula,
        nombre: candidato.nombre,
        fecha_ingreso: new Date().toISOString().split('T')[0],
        departamento: candidato.departamento,
        puesto_id: candidato.puesto_id,
        salario_mensual: candidato.salario_aspira,
        estado: 'Activo'
      }])
      .select();

    if (errorEmpleado) throw errorEmpleado;

    // Eliminar el candidato después de contratarlo
    await supabase.from('candidatos').delete().eq('id', req.params.id);

    res.status(201).json(empleado[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ CONSULTA POR CRITERIOS ============
app.get('/api/candidatos/buscar', async (req, res) => {
  try {
    const { puesto, competencia, capacitacion } = req.query;
    let query = supabase
      .from('candidatos')
      .select('*, puestos(nombre)');

    if (puesto) {
      query = query.eq('puesto_id', puesto);
    }

    if (competencia) {
      query = query.ilike('competencias', `%${competencia}%`);
    }

    if (capacitacion) {
      query = query.ilike('capacitaciones', `%${capacitacion}%`);
    }

    const { data, error } = await query;
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint para obtener las capacitaciones de un candidato
app.get('/api/candidatos/:id/capacitaciones', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('capacitaciones_candidatos')
      .select('*')
      .eq('candidato_id', req.params.id)
      .order('fecha_desde', { ascending: false });
    
    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error al obtener capacitaciones del candidato:', error);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint para agregar una capacitación a un candidato
app.post('/api/candidatos/:id/capacitaciones', async (req, res) => {
  try {
    const { capacitacion_id } = req.body;
    const { data, error } = await supabase
      .from('candidatos_capacitaciones')
      .insert([
        { candidato_id: req.params.id, capacitacion_id }
      ])
      .select();
    
    if (error) throw error;
    res.json(data[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint para eliminar una capacitación de un candidato
app.delete('/api/candidatos/:id/capacitaciones/:capacitacion_id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('candidatos_capacitaciones')
      .delete()
      .eq('candidato_id', req.params.id)
      .eq('capacitacion_id', req.params.capacitacion_id);
    
    if (error) throw error;
    res.json({ message: 'Capacitación eliminada del candidato' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint para contratar empleado
app.post('/api/empleados', async (req, res) => {
  try {
    const { nombre, cedula, puesto_id, departamento, salario_mensual, fecha_ingreso, idiomas } = req.body;
    
    // Primero verificamos si ya existe un empleado con esa cédula
    const { data: existingEmployee, error: checkError } = await supabase
      .from('empleados')
      .select('*')
      .eq('cedula', cedula)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      throw checkError;
    }

    if (existingEmployee) {
      return res.status(400).json({ error: 'Ya existe un empleado con esta cédula' });
    }

    // Insertamos el nuevo empleado
    const { data, error } = await supabase
      .from('empleados')
      .insert([{
        nombre,
        cedula,
        puesto_id,
        departamento,
        salario_mensual,
        fecha_ingreso,
        idiomas: idiomas || null,
        estado: 'Activo'
      }])
      .select();

    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
}); 