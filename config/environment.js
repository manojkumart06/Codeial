const development = {
    name : 'development',
    asset_path : '/assets',
    session_cookie_key : 'something',
    db : 'codeial_development',
    smtp : {
        service : 'gmail',
        host : 'smtp.gmail.com',
        port : 587,
        secure : false,
        auth : {
            user : 'rao942023@gmail.com',
            pass : 'vvhi swtj wyod bqjw'
        }
    },
    google_clientID : "358921193071-p0jt5e5btdfc0pgonfgucm8v2udc52qt.apps.googleusercontent.com",
    google_clientSecret : "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",
    go0gle_callbackURL : "http://localhost:8000/users/auth/google/callback",
    jwt_secret : 'codial'

}

const production = {
    name : 'production',
    asset_path : process.env.CODEIAL_ASSET_PATH,
    session_cookie_key : process.env.CODEIAL_SESSION_COOKIE_KEY,
    db : process.env.CODEIAL_DB,
    smtp : {
        service : 'gmail',
        host : 'smtp.gmail.com',
        port : 587,
        secure : false,
        auth : {
            user : process.env.CODEIAL_GMAIL_UNAME,
            pass : process.env.CODEIAL_GMAIL_PWD
        }
    },
    google_clientID : process.env.CODEIAL_GOOGLE_CLIENTID,
    google_clientSecret : process.env.CODEIAL_GOOGLE_CLIENTSECRET,
    go0gle_callbackURL : process.env.CODEIAL_GOOGLE_CALLBACKURL,
    jwt_secret : process.env.CODEIAL_JWT_SECRET
}

module.exports = eval(process.env.CODEIAL_ENVIRONMENT) == undefined ? development : eval(process.env.CODEIAL_ENVIRONMENT);
