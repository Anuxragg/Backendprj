import {v2 as cloudinary} from "cloudinary"
import fs from "fs"
import { resolve } from "path";

 cloudinary.config({ 
        cloud_name: process.env.CLOUDUNARY_CLOUDNAME, 
        api_key: process.env.CLOUDUNARY_API, 
        api_secret:process.env.CLOUDUNARY_API_KEY
 });

const uploadOnCloudinary = async (localFilePath) => {
    try{
       if(!localFilePath) return null
       //uploading
       const response = await cloudinary.uploader.upload(localFilePath, {
        resource_type: "auto"
       })
       //file uploaded
       console.log("file is uploaded on cloud", response.url)
       return response;
    } catch(error){
       fs.unlinkSync(localFilePath) //removes the locally saved
                                    //temporary file as the upload operation got failed
       return null
    }
}