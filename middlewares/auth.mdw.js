const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY || "HCMUSWEBNC";
module.exports = function (req,res,next) { 
    const accessToken = req.headers['x-access-token'];
    if(accessToken){
        try{
            const decodedData  = jwt.verify(accessToken,SECRET_KEY);
            //console.log(decodedData);
            req.accessTokenPayload  = decodedData;
            next();
        }
        catch (err){
            console.log(err);
            return res.status(401).json({
              message: 'Invalid access token!'
            });
        }
    }
    else{
        return res.status(400).json({
            message: 'Access token not found!'
        });
    }
}