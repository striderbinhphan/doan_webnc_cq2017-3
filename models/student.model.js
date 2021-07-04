const db = require('../utils/db');

module.exports = {
    addNewWatchList(user_id,course_id){
        return db('watch_list').insert({
            user_id,
            course_id
        });
    }
}