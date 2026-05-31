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
    //Obtiene el token para autenticar la solicitud al Auth Service y Academic Service
    const tokenJWT = req.headers.authorization;

    // Trae todos los estudiantes con su información de padre de SUPABASE
    const students = await prisma.student.findMany({
      include: {
        parent: true
      }
    });

    const resultado = await Promise.all(
      students.map(async (student) =>{

        const responseUser = await fetch(
          //Obtiene los datos del usuario desde el Auth Service usando el user_id del estudiante
          process.env.AUTH_SERVICE_URL + `/auth/users/${student.user_id}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          }
        )
        const dataUser = await responseUser.json();

        const responseSection = await fetch(
          process.env.ACADEMIC_SERVICE_URL + `/sections/${student.id_section}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': tokenJWT
            }
          }
        )
        const dataSection = await responseSection.json();

        return {
          ...student,
          user_id: dataUser,
          id_section: dataSection
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

export const getStudentById = async (req, res) => {
  try {
    //Obtiene el token para autenticar la solicitud al Auth Service y Academic Service
    const tokenJWT = req.headers.authorization;

    const { id } = req.params;

    const student = await prisma.student.findUnique({
      where: {
        student_id: id
      },
      include: {
        parent: true
      }
    });

    // Hace una solicitud al Auth Service para obtener los datos del usuario usando el user_id del estudiante
    const responseUserAuth = await fetch(
      process.env.AUTH_SERVICE_URL + `/auth/users/${student.user_id}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
    // IObtenemos los datos del usuario desde el Auth Service
    const dataUser = await responseUserAuth.json();

    const responseSection = await fetch(
      process.env.ACADEMIC_SERVICE_URL + `/sections/${student.id_section}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': tokenJWT
        }
      }
    )
    const dataSection = await responseSection.json();
    
    
    // Creamos un nuevo objeto que combina la información del estudiante con la información del usuario
    const response = {
      ...student,
      user_id: dataUser,
      id_section: dataSection
    }

    if (!student) {
      return res.status(404).json({
        message: 'Student not found'
      });
    }

    res.json(response);

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