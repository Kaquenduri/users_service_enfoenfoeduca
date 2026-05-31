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

    const resultado = await Promise.all(
      teachers.map(async (teacher) =>{
        const response = await fetch(
          //Obtiene los datos del usuario desde el Auth Service usando el user_id del profesor
          process.env.AUTH_SERVICE_URL + `/auth/users/${teacher.user_id}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          }
        )

        const dataUser = await response.json();
        return {
          ...teacher,
          user_id: dataUser
        }
      })
    )

    res.json(resultado);

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

    // Hace una solicitud al Auth Service para obtener los datos del usuario usando el user_id del profesoro
    const responseUserAuth = await fetch(
      process.env.AUTH_SERVICE_URL + `/auth/users/${teacher.user_id}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
    // IObtenemos los datos del usuario desde el Auth Service
    const dataUser = await responseUserAuth.json();
    // Creamos un nuevo objeto que combina la información del profesor con la información del usuario
    const response = {
      ...teacher,
      user_id: dataUser
    }

    if (!teacher) {
      return res.status(404).json({
        message: 'Teacher not found'
      });
    }

    res.json(response);

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