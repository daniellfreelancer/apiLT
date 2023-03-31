const PostBlog = require('../models/PostBlog');


const blogPostController = {

    createPost: async (req, res) =>{

        try {
            await new PostBlog(req.body).save()
            res.status(201).json({
                message: 'Post creado con exito',
                success:true
            })
        } catch (error) {
            res.status(400).json({
                message: 'Post no pudo ser creado',
                success: false
            })
        }
       


    },

    getPostByID: async ( req, res) =>{
        const {id} = req.params;
        const postById = await PostBlog.findById(id).populate('author', {name: 1})
        if (postById){
          res.status(200).json(postById)
        }
    },

    getPost: async (req, res) =>{
        res.json(await PostBlog.find().populate('author', {name: 1}).sort({createdAt: -1}))
    },
    updatePost: async(req, res)=>{

        const { id } = req.params

        try {
            
            const postUpdated = req.body
            let postForUpdate = await PostBlog.findById(id)

            if (!postForUpdate) {
                res.status(400).json({
                    message: 'No se puede actualizar un post que no existe',
                    succes: false
                })
            } else {
               const postBlogUpdated =  await PostBlog.findByIdAndUpdate(id, postUpdated)
                res.status(200).json({
                    message: 'Post Actualizado con exito',
                    success: true,
                    response:postBlogUpdated
                })
            }

        } catch (error) {
            
        }

    },
    deletePost: async (req, res) =>{
        const {id} = req.body

        try {
            let post = await PostBlog.findOne({_id: id})

            if(!post) {
                res.status(404).json({
                    message: 'Post no encontrado, no se puede borrar',
                    success: false
                })
            } else {

                await PostBlog.findByIdAndDelete(id)
                res.status(200).json({
                    message: 'Post borrado con exito',
                    success: true
                })


            }

        } catch (error) {
                        console.log(error)
            res.status(400).json({
                message: error.message,
                succes: false
            })
        }
    }

    


}

module.exports = blogPostController;