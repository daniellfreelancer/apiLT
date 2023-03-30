
const UsersBlog = require('../models/userApp');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken')
const secret = 'asdnonasdlmaofpasmdplmpkmaousbdpin284613216847'
const userController = {



    createUser : async (req, res) => {
        let {username, password, from, role, email} = req.body

        let newUser = await UsersBlog.findOne({ email })

        try {
            // let newUser = await UsersBlog.findOne({ username})

          

            if (!newUser) {

                let logged = false;
                password = bcryptjs.hashSync(password, 10)

                newUser = await new UsersBlog({
                username,
                email,
                password : [password],
                logged,
                from,
                role
               }).save()
               res.status(201).json({
                response: newUser,
                message: "user signed up",
                success: true
               })
            } else {
                res.status(200).json({
                    message: "user already exist ",
                    success: false
                })
            }
        } catch (error) {
            console.log(error)
            res.status(400).json({
                message: error.message,
                success: false
            })
        }

    },
    login : async(req, res)=>{
        let {email, password} = req.body;


        try {
            const user = await UsersBlog.findOne({ email })

            if (!user){
                res.status(404).json({
                    message: 'Usuario no existente, por favor crea tu cuenta!',
                    success: false
                })
            } else {
                const userPass = user.password.filter(userpassword => bcryptjs.compareSync(password, userpassword))
                if (userPass.length > 0) {
                    const loginUser = {
                        id: user._id,
                        email: user.email,
                        username: user.username,
                        from: user.from,
                        role: user.role,
 
                    }
                    user.logged = true
                    await user.save()

                    res.status(200).json({
                        message: 'Inicio de sesion con exito',
                        success: true,
                        response: {
                            user: loginUser
                        }
                    })

            }
        }
        } catch (error) {
            console.log(error);
            res.status(400).json({
                message: error.message,
                success: false
            })
        }
    },
    loginToken : async(req, res)=>{
        const {email, password} = req.body;

        try {
            const user = await UsersBlog.findOne({ email })

            if (!user){
                res.status(404).json({
                    message: 'Usuario no existente, por favor crea tu cuenta!',
                    success: false
                })
            } else {
                const userPass = user.password.filter(userpassword => bcryptjs.compareSync(password, userpassword))
                if (userPass.length > 0) {
                    jwt.sign({email, id:user._id}, secret, {}, (err, token)=>{
                        if (err) throw err;
                        res.cookie('token', token).json({
                            message:'Inicio de sesión con exito!',
                            success: true,
                            id:user._id,
                            email,
                        })
                    })
            } else {
                res.status(400).json({
                    message:'Error al ingresar tu password',
                    success:false
                })
            }
        }
        } catch (error) {
            console.log(error);
            res.status(400).json({
                message: error.message,
                success: false
            })
        }

    },

    getProfile: async (req, res) => {

        // const {token} = req.cookies

        // jwt.verify(token, secret, {}, (err, info)=>{
        //     if (err) throw err;
        //     res.json(info)
        // })

        //res.json(req.cookies)
        const {token} = req.cookies;
        jwt.verify(token, secret, {}, (err,info) => {
          if (err) throw err;
          res.json(info);
        });

    },
    logoutToken : async (req, res)=>{
        res.cookie('token', '').json('Cierre de sesion con exito')
    }
}


module.exports = userController ;