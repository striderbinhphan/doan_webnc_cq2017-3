const db = require('../utils/db')
module.exports = {
    all(){
        return db('user');
    },
    addNewUser(user){
        return db('user').insert(user);
    },
    async getSingleUser(username){
        const ret = await db('user').where('user_username',username);
        if(ret === null){
            return null;
        }
        return ret [0];
    },
    addRFTokenToDB(user_id,refreshToken){
        return db('user').where('user_id',user_id).update({
            refresh_token: refreshToken
        })
    }
}