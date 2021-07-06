const db = require('../utils/db');

module.exports = {
    addNewVideo(newVideo){
        return db('videos').insert(newVideo);
    },
    async getVideoByVideoId(video_id){
        const ret = await db('videos').where('video_id',video_id);
        if(ret.length === 0){
            return null;
        }
        return ret[0];
    },
    updateVideo(videoId,videoPath){
        return db('videos').where('video_id',videoId).update({
            video_path: videoPath,
        })
    }
}