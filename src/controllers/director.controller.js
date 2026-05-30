import prisma from '../config/supabase.js';

export const createDirector = async (req, res) => {
  try {
    const {
      speciality,
      name,
      last_name,
      email,
      password,
    } = req.body;

    // Llamada a Auth Service para crear el usuario con el rol DIRECTOR
    const response = await fetch(
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
          role: ['DIRECTOR'] // Cambiado a DIRECTOR
        })
      }
    );

    // Respuesta del Auth Service
    const data = await response.json();

    // Si la respuesta no es ok, retornamos el error del Auth Service
    if (!response.ok) {
      return res.status(400).json(data);
    }

    console.log('Auth Service response:', data.user);
    
    // Crear el registro en el modelo director
    const director = await prisma.director.create({
      data: {
        user_id: data.user.user_id,
        speciality
      }
    });

    res.status(201).json(director);

  } catch (error) {
    console.error('Error creating director:', error);
    res.status(500).json({
      error: error.message
    });
  }
};

export const getDirectors = async (req, res) => {
  try {
    // Obtenemos todos los directores
    const directors = await prisma.director.findMany();

    res.json(directors);

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

export const getDirectorById = async (req, res) => {
  try {
    const { id } = req.params;

    const director = await prisma.director.findUnique({
      where: {
        director_id: id // Cambiado a tu llave primaria director_id
      }
    });

    if (!director) {
      return res.status(404).json({
        message: 'Director not found'
      });
    }

    res.json(director);

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

export const updateDirector = async (req, res) => {
  try {
    const { id } = req.params;

    const director = await prisma.director.update({
      where: {
        director_id: id
      },
      data: req.body
    });

    res.json(director);

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

export const deleteDirector = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.director.delete({
      where: {
        director_id: id
      }
    });

    res.json({
      message: 'Director deleted'
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};