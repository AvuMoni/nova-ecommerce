const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const createToken = (user) => {
return jwt.sign(
{
id: user._id.toString(),
role: user.role,
},
process.env.JWT_SECRET,
{
expiresIn: "7d",
}
);
};

const register = async (req, res) => {
try {
const { name, email, password } = req.body;


if (!name || !email || !password) {
  return res.status(400).json({
    message: "Name, email and password are required.",
  });
}

if (password.length < 8) {
  return res.status(400).json({
    message: "Password must be at least 8 characters.",
  });
}

const cleanName = name.trim();
const cleanEmail = email.trim().toLowerCase();

const existingUser = await User.findOne({
  email: cleanEmail,
});

if (existingUser) {
  return res.status(409).json({
    message: "An account with this email already exists.",
  });
}

const hashedPassword = await bcrypt.hash(password, 12);

const user = await User.create({
  name: cleanName,
  email: cleanEmail,
  password: hashedPassword,
  role: "customer",
});

const token = createToken(user);

return res.status(201).json({
  message: "Account created successfully.",
  token,
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  },
});


} catch (error) {
console.error("Register error:", error);


return res.status(500).json({
  message: "Unable to create account.",
});


}
};

const login = async (req, res) => {
try {
const { email, password } = req.body;


if (!email || !password) {
  return res.status(400).json({
    message: "Email and password are required.",
  });
}

const cleanEmail = email.trim().toLowerCase();

const user = await User.findOne({
  email: cleanEmail,
}).select("+password");

console.log("LOGIN EMAIL:", cleanEmail);
console.log(
  "LOGIN USER FOUND:",
  user
    ? {
        id: user._id.toString(),
        email: user.email,
        hasPassword: Boolean(user.password),
        role: user.role,
      }
    : null
);


if (!user) {
  return res.status(401).json({
    message: "Invalid email or password.",
  });
}

const passwordMatches = await bcrypt.compare(
  password,
  user.password
);

if (!passwordMatches) {
  return res.status(401).json({
    message: "Invalid email or password.",
  });
}

const token = createToken(user);

return res.status(200).json({
  message: "Login successful.",
  token,
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  },
});


} catch (error) {
console.error("Login error:", error);


return res.status(500).json({
  message: "Unable to log in.",
});


}
};

const getMe = async (req, res) => {
try {
const user = await User.findById(req.user.id);


if (!user) {
  return res.status(404).json({
    message: "User not found.",
  });
}

return res.status(200).json({
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  },
});


} catch (error) {
console.error("Get user error:", error);


return res.status(500).json({
  message: "Unable to retrieve user.",
});


}
};

const updateProfile = async (req, res) => {
try {
const { name } = req.body;


if (!name || !name.trim()) {
  return res.status(400).json({
    message: "Name is required.",
  });
}

const user = await User.findById(req.user.id);

if (!user) {
  return res.status(404).json({
    message: "User not found.",
  });
}

user.name = name.trim();

await user.save();

return res.status(200).json({
  message: "Profile updated successfully.",
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  },
});


} catch (error) {
console.error("Update profile error:", error);


return res.status(500).json({
  message: "Unable to update profile.",
});


}
};

module.exports = {
register,
login,
getMe,
updateProfile,
};
