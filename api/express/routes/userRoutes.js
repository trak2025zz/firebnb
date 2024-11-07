const express = require("express");
const {validationResult} = require("express-validator");
const router = express.Router();
const {userCreateValidation} = require("../middleware/validator/userCreateValidator");
const User = require("../models/user");
const hashing = require("../utils/hashing");
const authenticateToken = require("../middleware/jwtMiddleware");
const {userUpdateValidation} = require("../middleware/validator/userUpdateValidator");
const {UserApiEntity} = require("../api-entity/UserApiEntity");
const jwt = require("jsonwebtoken");

router.post(
    '/create',
    [userCreateValidation],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({errors: errors.array()});
        }

        const {full_name, email, password} = req.body;

        let user = await User.create({
            fullName: full_name,
            password: await hashing.hash(password),
            email: email,
            createdAt: Date.now(),
            updatedAt: Date.now()
        });

        user = new UserApiEntity(user);
        return res.status(200).json({message: "User created successfully", user});
    }
);
router.put("/update", [authenticateToken, userUpdateValidation], async (req, res) => {
    let user = await User.findOne({ where: { email: req.user.email } });

    if (!user) {
        return res.status(401).json({ message: 'User is not logged in' });
    }

    const { email, full_name, password } = req.body;
    
    let exisitingUser = await User.findOne({ where: { email: email } });
    
    if (exisitingUser) {
        return res.status(409).json({ message: 'User with email: ' + email + ' already exists' });
    }

    if (email !== undefined) {
        user.email = email;
    }

    if (full_name !== undefined) {
        user.fullName = full_name;
    }

    if (password !== undefined) {
        user.password = await hashing.hash(password);
    }
    await user.save();

    const token = jwt.sign({ email: user.email }, process.env.TOKEN_SECRET, {
        expiresIn: 3600,
    });

    user = new UserApiEntity(user);
    return res.status(200).json({message: 'User updated successfully', user, token});
})

router.delete("/delete", [authenticateToken], async (req, res) => {
    let user = await User.findOne({ where: { email: req.body.email } });
    if (user) {
        await user.destroy();
        return res.status(200).json({message: 'User deleted successfully', user});
    }
    else return res.status(404).json({message: 'User with email: ' + req.body.email + ' not found'});
});

module.exports = router;