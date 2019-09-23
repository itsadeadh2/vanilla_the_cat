const { User } = require('../models/user.model');
const jwt  = require('jsonwebtoken');
const config = require('config');
const axios = require('axios');
const qs = require('qs');

const oauthService = {
    client_secret: process.env.CLIENT_SECRET,
    client_id: process.env.CLIENT_ID,
    redirectUri: 'http://45.79.228.17:3000/api/oauth',
    baseUrl: 'https://gitlab.com/oauth',
    
    generateStateHash(user) {
        return jwt.sign({ _id: user._id, nome: user.nome  }, config.get('jwtPrivateKey'));
    },
    
    async generateUserUrl(userId) {        
        let user = await User.findById(userId);
        let token = this.generateStateHash(user);
        let url = `${this.baseUrl}/authorize?client_id=${this.client_id}&redirect_uri=${encodeURIComponent(this.redirectUri)}&response_type=code&state=${token}&scope=api+read_repository+read_user+write_repository+read_registry+sudo`
        return url;
    },

    async validateToken(token) {
        const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
        let user = await User.findById(decoded._id);
        if (!user) return false;
        return user._id;
    },    

    async getUserToken(code) {
        try {
            let url = `https://gitlab.com/oauth/token`;
            let res = await axios.post(url, null, { params: {
                client_id: this.client_id,
                client_secret: this.client_secret,
                code,
                grant_type: 'authorization_code',
                redirect_uri: this.redirectUri
            }});
            return res.data;
        } catch (err) {
            console.log(err);
        }
    },

    async process(token, code) {
        let userId = await this.validateToken(token);
        if(!userId) return false;
        let { access_token } = await this.getUserToken(code);
        let user = await User.findById(userId);
        user.token = access_token;
        await user.save();
        return user;
    }
}

module.exports = oauthService;