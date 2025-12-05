import { response } from "express"
import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { useReducer } from "react"
import { ApiResonse } from "../utils/ApiResponse.js"



const registerUser = asyncHandler( async(req, res) => {
    // get user details from frontend
    // validation - not empty
    // check if user already exists: username,email
    // checking for images, check for avatar
    // upload them to cloudinary and that url of it
    // creating user object - create entry in db
    // remove password and refrsh token field from response
    // check for user creation
    // return res
    const {fullName, email, username, password} = req.body
    console.log("email:", email);

    if(
        [fullName, email, username, password].some((field) =>
             field?.trim()==="")
    ){
       throw new ApiError(400,"All fields are required")
    }
    User.findOne({ //for cheking already existing email
        $or: [{username}, {email}]
    })
    if(existedUser) {
        throw new ApiError(409, "Username already exists")
    }

  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;
  if(!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required")
  }

const avatar =  await uploadOnCloudinary(avatarLocalPath)
const coverImage = await uploadOnCloudinary(coverImageLocalPath)

if(!avatar){
    throw new ApiError(400, "Avatar file is required")
}

const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase() 
})

const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
)

if(!createdUser){
    throw new ApiError(500,"Something went wrong while registering the user")
}

return res.status(201).json(
    new ApiResponse(200, createUser, "User registered Successfully")
)
     

})


export {
    registerUser,
};