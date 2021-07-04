const db = require('../utils/db')
module.exports = {
    all(){
        return db('user');
    },
    addNewUser(user){
        return db('user').insert(user);
    },
    async isExistByUsername(username){
        const ret = await db('user').where('user_username',username);

        if(ret.length === 0){
            

            return null;
        }
        return ret[0];
    },
    async isExistByEmail(email){
        const ret = await db('user').where('user_email',email);

        if(ret.length === 0){

            return null;
        }
        return ret[0];
    },
    addRFTokenToDB(user_id,refreshToken){
        return db('user').where('user_id',user_id).update({
            refresh_token: refreshToken
        })
    },
    addOTPTokenToDB(user_email,otpToken){
        return db('user').where('user_email',user_email).update({
            user_accessotp: otpToken
        })
    },
    updateUserStatus(user_email,user_status){
        return db('user').where('user_email',user_email).update({
            user_status: user_status
        })
    }
}