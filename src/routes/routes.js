const express = require('express');
const router = express.Router();


const userController = require("../controller/userController")
const storeController = require("../controller/storeController")
const bookController = require("../controller/bookController");
const auth = require('../auth/auth');


router.post("/createUser", userController.createUser);
router.post("/loginUser", userController.loginUser);

router.post("/storeRegister",auth.authentication, storeController.storeRegister);
router.get("/getStore", storeController.getStore);

router.post("/addingBook", auth.authentication, bookController.addBook);
router.get("/getBookList", bookController.getBooks);
router.put("/books/:bookId",auth.authentication, bookController.updateBook);
router.delete("/books/:bookId", auth.authentication, bookController.removeBook)


module.exports = router;