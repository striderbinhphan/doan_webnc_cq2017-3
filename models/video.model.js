const db = require('../utils/db');

module.exports = {
    async getSingleVideoBySectionId(section_id){
        const videoList = await db('videos').where('section_id',section_id);
        if(videoList.length === null){
            return null;
        }
        return videoList[0];
    },
}