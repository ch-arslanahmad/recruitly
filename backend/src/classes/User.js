const db = require('../db/database');

class User {
  constructor(id, name, username, password, role, company = null) {
    this.id = id;
    this.name = name;
    this.username = username;
    this.password = password;
    this.role = role;
    this.company = company;
  }
}

module.exports = User;
