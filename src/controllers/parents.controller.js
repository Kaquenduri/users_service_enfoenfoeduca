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

    const resultado = await Promise.all(
      parents.map(async (parent) =>{
        const response = await fetch(
          //Obtiene los datos del usuario desde el Auth Service usando el user_id del estudiante
          process.env.AUTH_SERVICE_URL + `/auth/users/${parent.user_id}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          }
        )

        const dataUser = await response.json();
        return {
          ...parent,
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
    // Hace una solicitud al Auth Service para obtener los datos del usuario usando el user_id del padre
    const responseUserAuth = await fetch(
      process.env.AUTH_SERVICE_URL + `/auth/users/${parent.user_id}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
    // IObtenemos los datos del usuario desde el Auth Service
    const dataUser = await responseUserAuth.json();
    // Creamos un nuevo objeto que combina la información del padre con la información del usuario
    const response = {
      ...parent,
      user_id: dataUser
    }

    if (!parent) {
      return res.status(404).json({
        message: 'Parent not found'
      });
    }

    res.json(response);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }
};

export const getParentByIdUser = async (req, res) => {
  try{
    const { id } = req.params;

    const parent = await prisma.parent.findUnique({
      where: {
        user_id : id
      },
      include: {
        students: true
      }
    });

    res.json(parent);
  }catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
}

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