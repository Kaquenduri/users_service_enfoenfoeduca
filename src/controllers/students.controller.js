import prisma from '../config/supabase.js';


export const createStudent = async (req, res) => {
  try {

    const {
      name,
      last_name,
      email,
      password,
      parent_id,
      id_section
    } = req.body;
    
    // Llamada a Auth Service para crear el usuario
    const response = await fetch (
      process.env.AUTH_SERVICE_URL + '/auth/register',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name, 
          last_name,
          email,
          password,
          role: ['STUDENT'] 
        })
      }
    );

    //Respuesta del Auth Service
    const data = await response.json();

    // Si la respuesta no es ok, retornamos el error del Auth Service
    if (!response.ok) {
      return res.status(400).json(data);
    }

    //Creamos perfil estudiante 
    const student = await prisma.student.create({
      data: {
        user_id: data.user.user_id,
        parent_id,
        id_section
      }
    });

    res.status(201).json(student);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }
};

export const getStudents = async (req, res) => {
  try {

    const students = await prisma.student.findMany({
      include: {
        parent: true
      }
    });

    res.json(students);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }
};

export const getStudentById = async (req, res) => {
  try {

    const { id } = req.params;

    const student = await prisma.student.findUnique({
      where: {
        student_id: id
      },
      include: {
        parent: true
      }
    });

    if (!student) {
      return res.status(404).json({
        message: 'Student not found'
      });
    }

    res.json(student);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }
};

export const updateStudent = async (req, res) => {
  try {

    const { id } = req.params;

    const student = await prisma.student.update({
      where: {
        student_id: id
      },
      data: req.body
    });

    res.json(student);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }
};

export const deleteStudent = async (req, res) => {
  try {

    const { id } = req.params;

    await prisma.student.delete({
      where: {
        student_id: id
      }
    });

    res.json({
      message: 'Student deleted'
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }
};