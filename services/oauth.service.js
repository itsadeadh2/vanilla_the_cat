const { User } = require('../models/user.model');
const jwt  = require('jsonwebtoken');
const config = require('config');

const oauthService = {
    async generateUserUrl(userId) {
        let user = await User.findById(userId);
        const token = jwt.sign({ _id: user._id, nome: user.nome  }, config.get('jwtPrivateKey'));
        let client_id = 'b902d564260b4c23e661dd5392d555f1118e608fd322e6937541c7fc50b86730';
        let redirectUri = encodeURIComponent('http://51.79.87.65:3000/api/oauth');
        
        let url = `https://gitlab.com/oauth/authorize?client_id=${client_id}&redirect_uri=${redirectUri}response_type=code&state=${token}&scope=api`
        return url;
    },

    async validateToken(token) {
        const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
        let user = await User.findById(decoded._id);
        if (!user) return false;
        return true;
    }
}

module.exports = oauthService;