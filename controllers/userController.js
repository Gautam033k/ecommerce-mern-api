const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User.js');

//REGISTER
const register = async (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  try {
    //if the user already exist
    const oldUser = await User.findOne({ email });
    if (oldUser) {
      return res.status(400).json({ message: 'user Already Exist' });
    }

    //hashing the password
    const hashedPassword = await bcrypt.hash(password, 12);

    //creating user
    const result = await User.create({
      email,
      password: hashedPassword,
      username: `${firstName} ${lastName}`,
    });

    //creating token using jwt
    const token = jwt.sign(
      {
        email: result.email,
        id: result._id,
      },
      process.env.JWT_SEC,
      { expiresIn: '3d' }
    );
    res.status(201).json({ result, token });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
    console.log(error);
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    //check if user exists in db or not
    const oldUser = await User.findOne({ email });
    if (!oldUser) return res.status(401).json({ message: 'User not found' });

    //if exists decrypt the hashed password
    const originalPassword = await bcrypt.compare(password, oldUser.password);

    //check the password
    if (!originalPassword)
      return res.status(401).json({ message: 'Wrong Credentials' });

    //now allow user to login with the token
    const token = jwt.sign(
      {
        email: oldUser.email,
        id: oldUser._id,
      },
      process.env.JWT_SEC,
      { expiresIn: '3d' }
    );
    res.status(201).json({ oldUser, token });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
    console.log(error);
  }
};

module.exports = { register, login };
