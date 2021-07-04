const jwt = require('jsonwebtoken');
const randomstring = require('randomstring');
require('dotenv').config({path:"../.env"});
const AUTH_OTP_VERIFY = process.env.AUTH_OTP_VERIFY||"verify";
module.exports = {
    generateOTPCode(){
        return randomstring.generate({
            length: 6,
            charset: 'numeric'    
        });
    },
    generateOTPToken(otpCode){
        return jwt.sign({
            otp: otpCode
        },AUTH_OTP_VERIFY,{
            expiresIn:"10m"
        });
    },
    checkOTPValid(otpCode, token) { 
        const decoded = jwt.decode(token,{
            ignoreExpiration:true
        })
        if(decoded.otp != otpCode){
            return false;
        }
        return true;
    },
    async sendMail(toEmail, otpCode){
        try{
            const accessToken = await oauth2Client.getAccessToken();
            const transport = nodemailer.createTransport({
                service:'gmail',
                auth: {
                    type: 'Oauth2',
                    user: 'pipporkk@gmail.com',
                    clientId: CLIENT_ID,
                    clientSecret: CLIENT_SECRET,
                    refreshToken: REFRESH_TOKEN,
                    accessToken: accessToken
                }
            });
            const mailOptions = {
                from: "Activation Online Course Account<activated_hcmusstudent@gmail.com>",
                to: `${toEmail}`,
                subject: "Activate your account",
                html: `
                    <h1>Please use the following OTP to activate your account</h1>
                    <h3>${otpCode}</h3>
                    <hr />
                    <p>This email may containe sensetive information, please don't reply!</p>
                    <p>Best regard.</p>
                `
            }
            const result = await  transport.sendMail(mailOptions);
            return result;
        }catch(err){
            console.log(err);
        }
    }
}