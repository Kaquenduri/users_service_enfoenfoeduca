import prisma from '../config/supabase.js';


export const createTeacher = async (req, res) => {
  try {

    const {
      speciality,
      name,
      last_name,
      email,
      password
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
          role: ['TEACHER'] 
        })
      }
    );

    //Respuesta del Auth Service
    const data = await response.json();

    // Si la respuesta no es ok, retornamos el error del Auth Service
    if (!response.ok) {
      return res.status(400).json(data);
    }

    const teacher = await prisma.teacher.create({
      data: {
        user_id: data.user.user_id,
        speciality
      }
    });

    res.status(201).json(teacher);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }
};

export const getTeachers = async (req, res) => {
  try {

    const teachers = await prisma.teacher.findMany();

    res.json(teachers);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }
};

export const getTeacherById = async (req, res) => {
  try {

    const { id } = req.params;

    const teacher = await prisma.teacher.findUnique({
      where: {
        teacher_id: id
      }
    });

    if (!teacher) {
      return res.status(404).json({
        message: 'Teacher not found'
      });
    }

    res.json(teacher);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }
};

export const updateTeacher = async (req, res) => {
  try {

    const { id } = req.params;

    const teacher = await prisma.teacher.update({
      where: {
        teacher_id: id
      },
      data: req.body
    });

    res.json(teacher);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }
};

export const deleteTeacher = async (req, res) => {
  try {

    const { id } = req.params;

    await prisma.teacher.delete({
      where: {
        teacher_id: id
      }
    });

    res.json({
      message: 'Teacher deleted'
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }
};