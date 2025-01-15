const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createUser, findUserByUsername } = require('../models/userModel');

exports.register = async (req, res) => {
    try{
        const {username, password } = req.body;

        const existing = await findUserByUsername(username);
        if(existing){
            return res.status(400).json({ error: 'User already exists'});
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const userId = await createUser({ username, hashedPassword });
        return res.status(201).json({ message: 'User created', userId});
    }catch(error){
        console.error('Error while creating the user', error);
        res.status(500).json({error: 'Internal Server Error'});
    }
}

exports.login = async (req, res) =>{
    try{
        const {username, password } = req.body;

        const user = await findUserByUsername(username);
        if(!user){
            return res.status(404).json({ error: 'Uset not exists'})
        }

        const match = await bcrypt.compare(password, user.password);
        if(!match){
            return res.status(401).json({ error: 'Invalid credentials'});
        }

        const token = jwt.sign({ userId: user._id}, process.env.JWT_SECRET, {
            expiresIn: '2h'
        });

        return res.status(200).json({ token });
    }catch(error){
        console.error('Login error', error);
        res.status(500).json({ error: 'Internal Server Error'});
    }
}