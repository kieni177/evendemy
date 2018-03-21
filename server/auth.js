var basicAuth = require('basic-auth');

module.exports = function (config) {
  var auth = {
    authenticate: function (name, password, callback) {
      //TODO add your auth implementation here
      //to test the application you can use the following code

      if (name === 'admin') {
        callback(undefined, {
          uid: 'admin',
          mail: 'your.email@evendemy.com',
          givenName: 'Max',
          sn: 'Mustermann'
        });
      }

      if (name === 'john') {
        callback(undefined, {
          uid: 'john',
          mail: 'john@evendemy.com',
          givenName: 'John',
          sn: 'Doe'
        });
      }
    }
  };

  //TODO replace this mapper for your needs
  var map = function (user) {
    return {
      uid: user.uid,
      mail: user.mail,
      firstname: user.givenName,
      lastname: user.sn
    };
  };

  var rejectBasicAuth = function (res) {
    res.statusCode = 401;
    res.setHeader('WWW-Authenticate', 'Basic realm="Error"');
    res.end('Access denied');
  };

  var basicAuthFunction = function (req, res, next) {
    var credentials = basicAuth(req);
    if (!credentials) {
      return rejectBasicAuth(res);
    }

    auth.authenticate(credentials.name, credentials.pass, function (err, user) {
      if (err) {
        return rejectBasicAuth(res);
      }

      req.user = map(user);
      next();
    });
  };

  return basicAuthFunction;
};
