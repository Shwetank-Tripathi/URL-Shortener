const User = require("../models/user");
const {setUser,getUser} = require("../services/auth");

async function handleUserSignup(req, res) {
    const { name, email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user) {
            return res.render("signup", {
                error: "User already exists"
            });
        }
        await User.create({ name, email, password });
        return res.redirect("/login");
    } catch (error) {
        console.error("Signup error:", error);
        return res.render("signup", {
            error: "Signup failed. Please try again."
        });
    }
}

async function handleUserLogin(req, res) {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email, password });
        
        if (!user) {
            return res.render("login", {
                error: "Invalid email or password"
            });
        }

        const token = setUser(user.toObject());
        res.cookie("uid", token);
        res.send(`
            <script>
                window.location.href = "/";
            </script>
        `);
    } catch (error) {
        console.error("Login error:", error);
        return res.render("login", {
            error: "Login failed. Please try again."
        });
    }
}

async function handleUserLogout(req, res) {
    res.clearCookie("uid");
    return res.redirect("/");
}

module.exports = {
    handleUserSignup,
    handleUserLogin,
    handleUserLogout,
};