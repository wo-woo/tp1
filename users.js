var express = require('express');
var router = express.Router();

/* GET users listing. */
router.post('/signup', function (req, res) {
  const user = {
    'userID': req.body.user.userID,
    'userPW': req.body.user.userPW
  };
  connection.query('SELECT userID FROM users WHERE userID = "' + user.userID + '"', function (err, row) {
    if (row[0] == undefined){ //  동일한 아이디가 없을경우,
      const salt = bcrypt.genSaltSync();
      const encryptedPassword = bcrypt.hashSync(user.password, salt);
      connection.query('INSERT INTO users (userID,userPW) VALUES ("' + user.userID + '","' + encryptedPassword + '")', user, function (err, row2) {
        if (err) throw err;
      });
      res.json({
        success: true,
        message: 'Sign Up Success!'
      })
    }
    else {
      res.json({
        success: false,
        message: 'Sign Up Failed Please use anoter ID'
      })
    }
  });

  router.post('/login', function (req, res) {
    const user = {
      'userID': req.body.user.userID,
      'userPW': req.body.user.userPW
    };
    connection.query('SELECT userID, userPW FROM users WHERE userID = "' + user.userID + '"', function (err, row) {
      if (err) {
        res.json({ // 매칭되는 아이디 없을 경우
          success: false,
          message: 'Login failed please check your id or password!'
        })
      }
      if (row[0] !== undefined && row[0].userid === user.userID) {
        bcrypt.compare(user.userPW, row[0].userPW, function (err, res2) {
          if (res2) {
            res.json({ // 로그인 성공 
              success: true,
              message: 'Login successful!'
            })
          }
          else {
            res.json({ // 매칭되는 아이디는 있으나, 비밀번호가 틀린 경우            success: false,
              message: 'Login failed please check your id or password!'
            })
          }
        })
      }
    })
  });
  
});

router.get('/', function (req, res) {
  connection.query('SELECT * FROM users', function (err, rows) {
    if (err) throw err;
    res.send(rows);
  });
});

module.exports = router;
