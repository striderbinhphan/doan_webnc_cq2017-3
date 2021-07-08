const express = require('express');
const router = express.Router();
const sectionModel = require('../models/section.model');
const videoModel = require('../models/video.model');
const multer = require('multer');
const {DeleteVideoFile} = require('../services/file.services')
const uploadFile = require('../services/fileupload.services')
const {userGuard, lecturerGuard} = require('../middlewares/auth.mdw')
/*

------------
course video api
------------

*/


//create video first, return video id
router.post('/',lecturerGuard,async (req,res)=>{
    const {sectionId,videoTitle, videoPreviewStatus} = req.body;
    
    if(sectionId === null || videoTitle === null){
        return res.status(204).json({message:"Video title must be not empty"});
    }
    const newVideo = {
        video_title: videoTitle,
        preview_status: videoPreviewStatus,
        section_id: sectionId
    }
    try{
        const ret = await videoModel.addNewVideo(newVideo);
        res.status(201).json({
            message:"Upload video title successfully",
            video_id: ret[0]
        });
    }catch(err){
        return res.status(400).json({message:err});
    }
})

//create video first, return video id
router.patch('/:videoId',lecturerGuard,async (req,res)=>{
    const videoId = req.params.videoId;
    const {videoTitle,videoPreviewStatus} = req.body;
    
    if( videoTitle === null){
        return res.status(204).json({message:"Video title must be not empty"});
    }
    const updateVideoTitle = {
        video_title: videoTitle,
        preview_status: videoPreviewStatus
    }
    try{
        const ret = await videoModel.updateVideoTitle(videoId,updateVideoTitle);
        res.status(201).json({
            message:"Update video title successfully"
        });
    }catch(err){
        return res.status(400).json({message:err});
    }
})
//edittttttttting
const uploadVideo = multer({storage:uploadFile("video")}).single("video");
router.patch('/:videoId/upload',lecturerGuard,uploadVideo,async (req,res)=>{
    const videoId = +req.params.videoId;
    const videoFromDB = await videoModel.getVideoByVideoId(videoId);
    if(videoFromDB.video_path !== null){
        DeleteVideoFile([videoFromDB.video_path]);
    }
    await videoModel.updateVideo(videoId,req.file.filename);
    return res.status(200).json({message:"upload video successfully!"});
})


router.delete('/:videoId',lecturerGuard,async (req,res)=>{
    const videoId = req.params.videoId;
    const videoFromDB = await videoModel.getVideoByVideoId(videoId);
    if(videoFromDB.video_path !== null){
        DeleteVideoFile([videoFromDB.video_path]);
    }
    await videoModel.delete(videoId);
    return res.status(200).json({message:"Delete video successfully!"});
})

module.exports = router;