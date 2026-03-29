// const router = express.Router();
// const express = require("express");
const router = require("express").Router();
const { blogCreate, getBlogs, getSingleBlog, updateBlog, deleteBlog } = require("../Controller/BlogController");
const { userRegister, login, getUser, updateUser, singleUser } = require("../Controller/UserController");
const { jwtAuthMiddleWare } = require("../jwt");

router.post("/userRegister", userRegister);
router.post("/login", login);
router.get("/getUser", jwtAuthMiddleWare, getUser);
router.put("/updateUser/:id", updateUser);
router.get("/singleUser/:id", singleUser);

router.post("/blogCreate", blogCreate);
router.get("/getBlogs", getBlogs);
router.get("/getSingleBlog/:id", getSingleBlog);
router.put("/updateBlog/:id", updateBlog);
router.delete("/deleteBlog/:id", deleteBlog);

module.exports = router;
