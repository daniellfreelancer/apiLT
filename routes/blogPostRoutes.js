var express = require('express');
var router = express.Router();


const { createPost, getPostByID, getPost, deletePost, updatePost } = require('../controllers/blogPostController')

router.post('/create', createPost)
router.get('/posts/:id', getPostByID)
router.get('/posts', getPost)
router.put('/post/update/:id', updatePost)
router.delete('/post/delete', deletePost)


module.exports = router;