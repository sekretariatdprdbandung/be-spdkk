// models
const { user } = require('../../models');

// package
const bcrypt = require('bcrypt');

// package
const Joi = require('joi');

// add user
exports.AddUser = async (req, res) => {
  try {
    // get input data
    const data = req.body;

    // validate
    const schema = Joi.object({
      name: Joi.string().min(3).required().messages({
        'string.empty': `Nama tidak boleh kosong`,
        'string.min': `"Nama" harus memiliki panjang minimum {#limit}`,
      }),
      email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com'] } })
        .required()
        .messages({
          'string.empty': `Email tidak boleh kosong`,
        }),
      password: Joi.string().min(5).required('Password tidak boleh kosong').messages({
        'string.empty': `Password tidak boleh kosong`,
        'string.min': `"Password" harus memiliki panjang minimum {#limit}`,
      }),
      role: Joi.required().messages({
        'string.empty': `Role tidak boleh kosong`,
      }),
      status: Joi.required().messages({
        'string.empty': `Status tidak boleh kosong`,
      }),
    });

    const { error } = schema.validate(data);

    if (error) {
      console.log(schema);
      return res.status(400).send({
        status: 'Error',
        message: error.details[0].message,
      });
    }

    // check email user exist
    const checkEmailExist = await user.findOne({
      where: { email: data.email },
    });

    if (checkEmailExist) {
      return res.status(400).send({
        status: 'Error',
        message: 'Email has been registered',
      });
    }

    // hashed password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);

    // create new user data
    const newData = await user.create({
      ...data,
      password: hashedPassword,
      status: 0,
    });

    // get new data user from database
    const dataUser = await user.findOne({
      where: {
        id: newData.id,
      },
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'password'],
      },
    });

    // response
    res.status(200).send({
      status: 'Success',
      message: 'User data added successfully',
      data: dataUser,
    });
  } catch (error) {
    res.status(500).send({
      status: 'Error',
      message: error,
    });
    console.log(error);
  }
};

// get users
exports.getUsers = async (req, res) => {
  try {
    // get data users
    let dataUsers = await user.findAll({
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'password'],
      },
    });

    // check data
    if (!dataUsers) {
      return res.status(200).send({
        status: 'Success',
        message: 'User data not found',
      });
    }

    // response
    res.status(200).send({
      status: 'Success',
      message: 'User data found',
      data: dataUsers,
    });
  } catch (error) {
    res.status(500).send({
      error: 'Error',
      message: error,
    });
    console.log(error);
  }
};

// get users role
exports.getUsersRole = async (req, res) => {
  try {
    // get length superAdmin
    let dataSuperAdmin = await user.count({
      where: {
        role: 0,
      },
    });
    // get length admin
    let dataAdmin = await user.count({
      where: {
        role: 1,
      },
    });

    // response
    res.status(200).send({
      status: 'Success',
      message: 'User data found',
      data: {
        superAdmin: dataSuperAdmin,
        admin: dataAdmin,
      },
    });
  } catch (error) {
    res.status(500).send({
      error: 'Error',
      message: error,
    });
    console.log(error);
  }
};

// get user
exports.getUser = async (req, res) => {
  try {
    // get params
    const { id } = req.params;

    // get data users
    let dataUsers = await user.findOne({
      where: { id },
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'password'],
      },
    });

    // check data
    if (!dataUsers) {
      return res.status(200).send({
        status: 'Success',
        message: 'User data not found',
      });
    }

    dataUsers = JSON.parse(JSON.stringify(dataUsers));

    // response
    res.status(200).send({
      status: 'Success',
      message: 'User data found',
      data: dataUsers,
    });
  } catch (error) {
    res.status(500).send({
      error: 'Error',
      message: error,
    });
    console.log(error);
  }
};

// update user
exports.updateUser = async (req, res) => {
  try {
    // get params
    const { id } = req.params;

    // get input data
    const data1 = req.body;
    const data2 = {
      name: req.body.name,
      email: req.body.email,
      role: req.body.role,
      status: req.body.status,
    };

    // check input password
    if (data1.password) {
      // hashed password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(data1.password, salt);

      // update data
      await user.update({ ...data1, password: hashedPassword }, { where: { id } });
    } else {
      // update data
      await user.update(data2, { where: { id } });
    }

    // get user data
    const dataExist = await user.findOne({
      where: { id },
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
    });

    // response
    res.status(200).send({
      status: 'Success',
      message: 'User data updated successfully',
      data: dataExist,
    });
  } catch (error) {
    res.status(500).send({
      status: 'Error',
      message: error,
    });
    console.log(error);
  }
};

// delete user
exports.deleteUser = async (req, res) => {
  try {
    // get params
    const { id } = req.params;

    // delete user
    await user.destroy({
      where: {
        id,
      },
    });

    // response
    res.status(200).send({
      status: 'Success',
      message: 'User data deleted successfully',
    });
  } catch (error) {
    res.status(500).send({
      status: 'Error',
      message: error,
    });
    console.log(error);
  }
};
