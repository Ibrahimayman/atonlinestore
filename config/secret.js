module.exports = {
    database: 'mongodb://ibrahimayman:Abcd#123321@ds157469.mlab.com:57469/ecommercedofrome',
    port: process.env.port || 3000,
    secretKey: "Arash@$@!#@",
    facebook: {
        clientID: process.env.FACEBOOK_ID || '805870756251090',
        clientSecret: process.env.FACEBOOK_SECRET || '2fa76b134375cebe21fcbef8268bdd5b',
        profileFields: ['emails', 'displayName'],
        callbackURL: 'http://localhost:3000/auth/facebook/callback/'
    },
    twitter: {
        consumerKey: process.env.TWITTER_ID || 'YU9Rioq6BZkS7G7OtspToeOGE',
        consumerSecret: process.env.TWITTER_SECRET || 'ht254juKPXzUtteXFDI849DZQ1GUQwmyeiRmptKT9eC3uV6wnk',
        profileFields: ['emails', 'displayName'],
        callbackURL: 'http://localhost:3000/auth/twitter/callback/'
    }
};
