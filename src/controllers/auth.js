// models
const { user } = require('../../models');

// package
const Joi = require('joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// login
exports.login = async (req, res) => {
  try {
    // get input data
    const data = req.body;

    // validate
    const schema = Joi.object({
      email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com'] } })
        .required(),
      password: Joi.string().min(5).required(),
    });

    const { error } = schema.validate(data);

    if (error) {
      return res.status(400).send({
        status: 'Error',
        message: error.details[0].message,
      });
    }

    console.log(data.email);
    // check user email and password is correct
    const checkUser = await user.findOne({
      where: { email: data.email },
    });

    if (!checkUser) {
      return res.send({
        status: 'Error',
        message: 'Email atau Password yang anda masukkan salah',
      });
    }

    if (checkUser.status !== 0) {
      return res.send({
        status: 'Error',
        message: 'Akun yang anda masukkan tidak aktif',
      });
    }

    const passwordValid = await bcrypt.compare(data.password, checkUser.password);

    if (!passwordValid) {
      return res.send({
        status: 'Error',
        message: 'Email atau Password yang anda masukkan salah',
      });
    }

    // generate token
    const token = jwt.sign({ id: checkUser.email, role: checkUser.role }, process.env.TOKEN_KEY);

    // data user
    const dataUser = {
      id: checkUser.id,
      name: checkUser.name,
      email: checkUser.email,
      role: checkUser.role,
      token,
    };

    // response
    res.status(200).send({
      status: 'Success',
      message: 'Login successful',
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

// check auth
exports.checkAuth = async (req, res) => {
  try {
    // get data
    const id = req.user.id;

    // check user exist
    const userExist = await user.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'password'],
      },
    });

    if (!userExist) {
      return res.status(404).send({
        status: 'failed',
        message: 'User not found',
      });
    }

    // response
    res.status(200).send({
      status: 'Success',
      message: 'User found',
      data: userExist,
    });
  } catch (error) {
    res.status(500).send({
      status: 'Error',
      message: 'Server error',
    });
    console.log(error);
  }
};
