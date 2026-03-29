const User = require("../Modal/UserSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { generateToken } = require("../jwt");

// create user or register
exports.userRegister = async (req, res) => {
  try {
    const { name, lname, email, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, lname, email, password: hashed });
    // token
    const token = generateToken(user);
    if (user) {
      return res.status(201).json({
        success: true,
        message: "user Created Successfully",
        user,
        token,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "user not created",
        user,
      });
    }
  } catch (error) {
    console.log(error, "Error creating user");
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// login
exports.login = async (req, res) => {
  console.log("Login page");

  try {
    const { name, lname, email, password } = req.body
    const userFind = await User.find()

  } catch (error) {
    console.log('error: ', error);

  }
  try {
    const { email, password } = req.body;
    console.log("Login request:", req.body);
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });

    }


    return res.status(200).json({
      success: true,
      message: "Login successful",
      userId: user._id,
      name: user.name,
      lname: user.lname,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

//get user
exports.getUser = async (req, res) => {
  try {
    const user = await User.find();
    return res.status(200).json(user);
  } catch (error) {
    console.log(error, "Error getting User");
  }
};

//update user
exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, lname, email, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const updateUser = await User.findByIdAndUpdate(userId, {
      name,
      lname,
      email,
      password: hashed,
    });
    if (updateUser) {
      return res.status(200).json({
        success: true,
        message: "User updated successfully",
        user: updateUser,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "User not updated",
        user: updateUser,
      });
    }
  } catch (error) {
    console.log(error, "Error updating User");
  }
};

//single user
exports.singleUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id).populate({
      path: "blog",
      model: "Blog",
      populate: [
        {
          path: "user",
          model: "User",
        },
      ],
    })
    if (User) {
      res.status(200).json({
        message: "single user get successfully",
        user,
      });
    }
  } catch (error) {
    console.log(error, "Error getting Particular User");
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

