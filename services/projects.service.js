const winston = require('winston');
const config = require('config');
const axios = require('axios');
const { User } = require('../models/user.model');

exports.projectsService = {
  client_secret: process.env.CLIENT_SECRET,
  client_id: process.env.CLIENT_ID,
  redirectUri: `${config.get('apiUrl')}/oauth`,
  baseUrl: 'https://gitlab.com/api/v4',

  async getProjectsByUserId(userId) {
    try {
      const { token } = await User.findById(userId);
      const projects = await axios.get(`${this.baseUrl}/projects`, { headers: { Authorization: `Bearer ${token}` }, params: { min_access_level: 40, simple: true } });
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
  },
};
