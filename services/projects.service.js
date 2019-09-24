const winston = require('winston');
const axios = require('axios');
const { User } = require('../models/user.model');

exports.projectsService = {
  client_secret: process.env.CLIENT_SECRET,
  client_id: process.env.CLIENT_ID,
  redirectUri: 'http://45.79.228.17:3000/api/oauth',
  baseUrl: 'https://gitlab.com/api/v4',

  async getProjectsByUserId(userId) {
    try {
      const { token } = await User.findById(userId);
      const projects = await axios.get(`${this.baseUrl}/projects`, { headers: { Authorization: `Bearer ${token}` }, params: { membership: true, simple: true } });
      return projects.data;
    } catch (error) {
      return winston.error(error);
    }
  },

  async getProjectById(userId, projectId) {
    try {
      const { token } = await User.findById(userId);
      const project = await axios.get(`${this.baseUrl}/projects/${projectId}`, { headers: { Authorization: `Bearer ${token}` } });
      return project.data;
    } catch (error) {
      return winston.error(error);
    }
  }
};
