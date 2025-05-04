import mongoose from "mongoose";

mongoose
    .connect("mongodb+srv://codewithrahulnikam:rahulnikam2002@cluster0.iz5qb.mongodb.net/amanca")
    .then((conn) => console.log("DB connected"))
    .catch((err) => console.log(err));