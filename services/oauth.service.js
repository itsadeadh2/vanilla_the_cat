const { User } = require('../models/user.model');
const jwt  = require('jsonwebtoken');
const config = require('config');
const axios = require('axios');

const oauthService = {
    client_secret: 'meusecret',
    client_id: 'minhaid',
    redirectUri: encodeURIComponent('http://45.79.228.17:3000/api/oauth'),
    baseUrl: 'https://gitlab.com/oauth',
    
    generateStateHash(user) {
        return jwt.sign({ _id: user._id, nome: user.nome  }, config.get('jwtPrivateKey'));
    },
    
    async generateUserUrl(userId) {        
        let user = await User.findById(userId);
        let token = this.generateStateHash(user);
        let url = `${this.baseUrl}/authorize?client_id=${this.client_id}&redirect_uri=${this.redirectUri}&response_type=code&state=${token}&scope=api`
        return url;
    },

    async validateToken(token) {
        const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
        let user = await User.findById(decoded._id);
        if (!user) return false;
        return user;
    },    

    async getUserToken(code) {
        let url = `https://gitlab.com/oauth/token/`;
        let res = await axios.post(url, {params: {
            client_id: this.client_id,
            client_secret: this.client_secret,
            code: code,
            grant_type: 'authorization_code',
            redirect_uri: this.redirectUri
        }});
    }
}

module.exports = oauthService;