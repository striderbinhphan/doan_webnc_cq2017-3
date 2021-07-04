const db = require('../utils/db')
module.exports = {
    all(){
        return db('user');
    },
    addNewUser(user){
        return db('user').insert(user);
    },
    //kiem tra co ton tai user bang user name, tra ve user
    async isExistByUsername(username){
        const ret = await db('user').where('user_username',username);

        if(ret.length === 0){
            

            return null;
        }
        return ret[0];
    },
    //kiem tra co ton tai user bang email, tra ve user
    async isExistByEmail(email){
        const ret = await db('user').where('user_email',email);

        if(ret.length === 0){

            return null;
        }
        return ret[0];
    },
    //them refresh token vao database
    addRFTokenToDB(user_id,refreshToken){
        return db('user').where('user_id',user_id).update({
            refresh_token: refreshToken
        })
    },
     //kiem tra refresh token
    async isValidRFToken(user_id, refreshToken){
        const user = await db('user').where('user_id',user_id);
        if(user.length === 0){
            return false;
        }
        return user[0].refresh_token === refreshToken;
    },
    ////them otp token vao database
    addOTPTokenToDB(user_email,otpToken){
        return db('user').where('user_email',user_email).update({
            user_accessotp: otpToken
        })
    },
    //update user status(verify, active, update)
    updateUserStatus(user_email,user_status){
        return db('user').where('user_email',user_email).update({
            user_status: user_status
        })
    },
    //update user info(fullname,firstname, lastname,dob)
    updateUserInfo(user_username,user){
        return db('user').where('user_username',user_username).update(user)
    },
    //update user email
    updateEmail(user_username,user){
        return db('user').where('user_username',user_username).update(user)
    },
    //update password
    updatePassword(user_username, newPassword){
        return db('user').where('user_username',user_username).update({
            user_password: newPassword
        })
    }
}