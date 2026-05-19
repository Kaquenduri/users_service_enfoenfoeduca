import prisma from '../config/supabase.js';


export const createParent = async (req, res) => {
  try {

    const {
      phone,
      occupation,
      name,
      last_name,
      email,
      password,
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
          role: ['PARENT'] 
        })
      }
    );

    //Respuesta del Auth Service
    const data = await response.json();

    // Si la respuesta no es ok, retornamos el error del Auth Service
    if (!response.ok) {
      return res.status(400).json(data);
    }

    console.log('Auth Service response:', data.user);
    const parent = await prisma.parent.create({
      data: {
        user_id: data.user.user_id,
        phone,
        occupation
      }
    });

    res.status(201).json(parent);

  } catch (error) {
    console.error('Error creating parent:', error);
    res.status(500).json({
      error: error.message
    });

  }
};

export const getParents = async (req, res) => {
  try {

    const parents = await prisma.parent.findMany({
      include: {
        students: true
      }
    });

    res.json(parents);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }
};

export const getParentById = async (req, res) => {
  try {

    const { id } = req.params;

    const parent = await prisma.parent.findUnique({
      where: {
        parent_id: id
      },
      include: {
        students: true
      }
    });

    if (!parent) {
      return res.status(404).json({
        message: 'Parent not found'
      });
    }

    res.json(parent);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }
};

export const updateParent = async (req, res) => {
  try {

    const { id } = req.params;

    const parent = await prisma.parent.update({
      where: {
        parent_id: id
      },
      data: req.body
    });

    res.json(parent);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }
};

export const deleteParent = async (req, res) => {
  try {

    const { id } = req.params;

    await prisma.parent.delete({
      where: {
        parent_id: id
      }
    });

    res.json({
      message: 'Parent deleted'
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }
};