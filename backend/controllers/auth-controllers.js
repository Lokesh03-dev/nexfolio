const User = require('../utils/login-schema')
const { verifyFirebaseIdToken } = require('../utils/firebase-verify')

// Helper function to set the JWT token cookie
const setTokenCookie = (res, token) => {
  res.cookie('nexfolio_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });
};

// Register a new user
const register = async (req, res) => {
  try {
    const { name, email, password, domain } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill in all required fields." })
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return res.status(400).json({ message: "An account with this email already exists." })
    }

    const newUser = await User.create({
      name,
      email: email.toLowerCase(),
      password, // Note: In a production environment, you should hash this password
      domain: domain || 'other',
      isPremium: false
    })

    const token = await newUser.generateToken()
    setTokenCookie(res, token);

    res.status(201).json({
      message: "Account created successfully 🎉",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        domain: newUser.domain,
        isPremium: newUser.isPremium
      }
    })
  } catch (error) {
    console.error("Register Error:", error)
    res.status(500).json({ message: "Something went wrong. Please try again later." })
  }
}

// Log in an existing user
const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." })
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." })
    }

    // Check password using bcrypt compare
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." })
    }

    const token = await user.generateToken()
    setTokenCookie(res, token);

    res.status(200).json({
      message: "Welcome back! 👋",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        domain: user.domain,
        isPremium: user.isPremium
      }
    })
  } catch (error) {
    console.error("Login Error:", error)
    res.status(500).json({ message: "Something went wrong. Please try again later." })
  }
}

// Google Login via Firebase ID token verification
const googleLogin = async (req, res) => {
  try {
    const { idToken, domain } = req.body;

    if (!idToken) {
      return res.status(400).json({ message: "Firebase ID token is required." });
    }

    // Verify token
    const decodedToken = await verifyFirebaseIdToken(idToken);
    const { email, name } = decodedToken;

    if (!email) {
      return res.status(400).json({ message: "Invalid token payload: email is missing." });
    }

    // Find or create user
    let user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      // Create a new user with google details and a random password
      const randomPassword = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      user = await User.create({
        name: name || email.split('@')[0],
        email: email.toLowerCase(),
        password: randomPassword,
        domain: domain || 'other',
        isPremium: false
      });
    }

    const token = await user.generateToken();
    setTokenCookie(res, token);

    res.status(200).json({
      message: "Successfully signed in with Google! 🚀",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        domain: user.domain,
        isPremium: user.isPremium
      }
    });

  } catch (error) {
    console.error("Google Login Error:", error);
    res.status(401).json({ message: "Google authentication failed.", error: error.message });
  }
};

// Upgrade user to Premium
const upgrade = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { isPremium: true },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({
      message: "Successfully upgraded to Premium! 💎",
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        domain: updatedUser.domain,
        isPremium: updatedUser.isPremium
      }
    });
  } catch (error) {
    console.error("Upgrade Error:", error);
    res.status(500).json({ message: "Failed to upgrade subscription status." });
  }
};

module.exports = { register, login, googleLogin, upgrade }
