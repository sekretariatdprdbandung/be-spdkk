// models
const { workVisit } = require('../../models');

// import cloudinary
const cloudinary = require('../utils/Cloudinary');

// add workVisit
exports.addWorkVisit = async (req, res) => {
  try {
    // get data
    const data1 = req.body;

    const data2 = {
      name: req.body.name,
      date: req.body.date,
      origin: req.body.origin,
      interest: req.body.interest,
      qty: req.body.qty,
    };

    console.log(req.file);

    let dataWorkVisit;
    if (req.file) {
      // upload file to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'SPDKK/File',
        use_filename: true,
        unique_filename: false,
      });

      // update workVisit
      dataWorkVisit = await workVisit.create({ ...data1, filename: req.file.originalname, file: result.public_id });
    } else {
      // update workVisit
      dataWorkVisit = await workVisit.create({ ...data2 });
    }

    // check data exist
    let newData = await workVisit.findOne({
      where: {
        id: dataWorkVisit.id,
      },
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
    });

    newData = JSON.parse(JSON.stringify(newData));

    // response
    res.status(200).send({
      status: 'Success',
      message: 'Work Visit added successfully',
      data: {
        ...newData,
        file: process.env.PATH_FILE + newData.file,
      },
    });
  } catch (error) {
    res.status(500).send({
      status: 'Error',
      message: error,
    });
    console.log(error);
  }
};

// get workVisits
exports.getWorkVisits = async (req, res) => {
  try {
    let dataWorkVisit = await workVisit.findAll({
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
    });

    // check data
    if (!dataWorkVisit) {
      return res.status(200).send({
        status: 'Success',
        message: 'Work Visit data not found',
      });
    }

    dataWorkVisit = JSON.parse(JSON.stringify(dataWorkVisit));

    dataWorkVisit = dataWorkVisit.map((item) => {
      return {
        ...item,
        file: process.env.PATH_FILE + item.file,
      };
    });

    // response
    res.status(200).send({
      status: 'Success',
      message: 'Work Visit data found',
      data: dataWorkVisit,
    });
  } catch (error) {
    res.status(500).send({
      status: 'Error',
      message: error,
    });
    console.log(error);
  }
};

// get workVisit
exports.getWorkVisit = async (req, res) => {
  try {
    // get id
    const { id } = req.params;

    let dataWorkVisit = await workVisit.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
    });

    // check data
    if (!dataWorkVisit) {
      return res.status(200).send({
        status: 'Success',
        message: 'Work Visit data not found',
      });
    }

    dataWorkVisit = JSON.parse(JSON.stringify(dataWorkVisit));

    dataWorkVisit = {
      ...dataWorkVisit,
      file: process.env.PATH_FILE + dataWorkVisit.file,
    };

    // response
    res.status(200).send({
      status: 'Success',
      message: 'Work Visit data found',
      data: dataWorkVisit,
    });
  } catch (error) {
    res.status(500).send({
      status: 'Error',
      message: error,
    });
    console.log(error);
  }
};

// update workVisit
exports.updateWorkVisit = async (req, res) => {
  try {
    // get id
    const { id } = req.params;

    // get data
    const data1 = req.body;

    const data2 = {
      name: req.body.name,
      date: req.body.date,
      origin: req.body.origin,
      interest: req.body.interest,
      qty: req.body.qty,
    };

    if (req.file) {
      // get data before update
      const beforeUpdate = await workVisit.findOne({
        where: {
          id,
        },
      });

      // delete file to cloudinary
      cloudinary.uploader.destroy(beforeUpdate.file);

      // upload file to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'SPDKK/File',
        use_filename: true,
        unique_filename: false,
      });

      // update workVisit
      await workVisit.update(
        { ...data1, filename: req.file.originalname, file: result.public_id },
        {
          where: { id },
        }
      );
    } else {
      // update workVisit
      await workVisit.update(data2, {
        where: { id },
      });
    }

    // check data exist
    let newData = await workVisit.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
    });

    newData = JSON.parse(JSON.stringify(newData));

    // response
    res.status(200).send({
      status: 'Success',
      message: 'Work Visit updated successfully',
      data: {
        ...newData,
        file: process.env.PATH_FILE + newData.file,
      },
    });
  } catch (error) {
    res.status(500).send({
      status: 'Error',
      message: error,
    });
    console.log(error);
  }
};

// delete workVisit
exports.deleteWorkVisit = async (req, res) => {
  try {
    // get id
    const { id } = req.params;

    // check data exist
    const dataWorkVisit = await workVisit.findOne({
      where: {
        id,
      },
    });

    // delete file to cloudinary
    cloudinary.uploader.destroy(dataWorkVisit.file);

    // delete data
    await workVisit.destroy({
      where: {
        id,
      },
    });

    // response
    res.status(200).send({
      status: 'Success',
      message: 'workVisit data deleted successfully',
    });
  } catch (error) {
    res.status(500).send({
      status: 'Error',
      message: error,
    });
    console.log(error);
  }
};
