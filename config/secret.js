module.exports = {
    database: 'mongodb://ibrahimayman:Abcd#123321@ds157469.mlab.com:57469/ecommercedofrome',
    port: process.env.port || 3000,
    secretKey: "Arash@$@!#@",
    facebook: {
        clientID: process.env.FACEBOOK_ID || '805870756251090',
        clientSecret: process.env.FACEBOOK_SECRET || '2fa76b134375cebe21fcbef8268bdd5b',
        profileFields: ['emails', 'displayName'],
        callbackURL: 'https://agile-dawn-93506.herokuapp.com/auth/facebook/callback/'

        // callbackURL: 'http://localhost:3000/auth/facebook/callback/'
    },
    twitter: {
        consumerKey: process.env.TWITTER_ID || 'YU9Rioq6BZkS7G7OtspToeOGE',
        consumerSecret: process.env.TWITTER_SECRET || 'ht254juKPXzUtteXFDI849DZQ1GUQwmyeiRmptKT9eC3uV6wnk',
        profileFields: ['emails', 'displayName'],
        callbackURL: 'https://agile-dawn-93506.herokuapp.com/auth/twitter/callback/'
    },
    companyName: 'أتميدة أون لاين ستور',
    projectName: 'أتميدة أون لاين ستور',
    systemEmail: 'atonlinestore079@gmail.com',
    smtp: {
        from: {
            name: process.env.SMTP_FROM_NAME || exports.projectName + ' أتميدة أون لاين ستور',
            address: process.env.SMTP_FROM_ADDRESS || 'atonlinestore079@gmail.com'
        },
        credentials: {
            user: process.env.SMTP_USERNAME || 'atonlinestore079@gmail.com',
            password: process.env.SMTP_PASSWORD || 'Abcd@123321',
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            ssl: true
        }
    }
};
