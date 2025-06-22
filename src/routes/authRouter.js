const {Router} = require("express")
const { signup, login, logout, update, checkAuth } = require("../controllers/auth.controller")
const { authMiddleware } = require("../middlewares/authMiddleware")

const router = Router() 


router.post('/signup', signup)


router.post('/login', login)
router.post('/logout',logout)


router.put('/update',authMiddleware , update)

router.get("/check", authMiddleware, checkAuth);

module.exports = router