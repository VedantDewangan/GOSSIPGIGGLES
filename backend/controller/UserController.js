const { User } = require("../Models/UserModel")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config();

const generateToken = (id) => {
    const token = jwt.sign({ id }, process.env.JWT_SCERET, {
        expiresIn: '30d',
    });
    return token;
};

const register = async (req, res) => {
    const { email, username, password, confirm_password } = req.body;
    if (!email || !username || !password || !confirm_password) {
        res.status(404).send({
            msg: "Enter every fields",
            register: false,
            input: req.body
        })
    }
    else {
        const userByEmail = await User.find({
            email: email
        })
        if (userByEmail.length === 0) {
            const userByUsername = await User.find({
                name: username
            });
            if (userByUsername.length === 0) {
                if (password !== confirm_password) {
                    res.status(400).send({
                        msg: "password and confirm password should be same",
                        register: false
                    })
                }
                else if (password.length < 7) {
                    res.status(400).send({
                        msg: "password should consist atleast 8 character",
                        register: false
                    })
                }
                else {
                    const hashedPassword = await bcrypt.hash(password, 12)
                    const user = await User.insertMany({
                        email: email,
                        password: hashedPassword,
                        name: username,
                    })
                    const token = generateToken(user[0]._id);
                    res.status(201).send({
                        msg: "Signup successfull",
                        register: true,
                        userDetails: {
                            name: user[0].name,
                            _id: user[0]._id,
                            email: user[0].email,
                            pic: user[0].pic,
                            token: token
                        }
                    })
                }
            }
            else {
                res.status(400).send({
                    msg: "username is not avaliable",
                    register: false
                })
            }
        }
        else {
            res.status(400).send({
                msg: "Email is already registred",
                register: false
            })
        }
    }
}

const login = async (req, res) => {
    const { username, password, } = req.body;

    if (!username || !password) {
        res.status(404).send({
            login: false,
            msg: "Enter all fields"
        })
    }
    else {
        const user = await User.find({
            name: username
        })
        if (user.length === 0) {
            res.status(404).send({
                login: false,
                msg: "User not found"
            })
        }
        else {
            if (await bcrypt.compare(password, user[0].password)) {
                const token = generateToken(user[0]._id);
                res.status(201).send({
                    msg: "Login successfull",
                    login: true,
                    userDetails: {
                        name: user[0].name,
                        _id: user[0]._id,
                        email: user[0].email,
                        pic: user[0].pic,
                        token: token
                    }
                })
            }
            else {
                res.status(400).send({
                    login: false,
                    msg: "Incorrect Password"
                })
            }
        }
    }
}

const searchUser = async (req, res) => {
    const { search, userID } = req.query;
    const users = await User.find({
        name: { $regex: search, $options: "i" }
    });
    const filteredUsers = users.filter(user => user._id.toString() !== userID);
    res.send(filteredUsers);    
}

module.exports = {
    register,
    login,
    searchUser
}