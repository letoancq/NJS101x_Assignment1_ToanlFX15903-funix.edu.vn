const Staff = require("../models/staff");

class AuthController {
  //GET auth/login
  getLogin(req, res, next) {
    res.render("auth/login", {
      path: "/login",
      pageTitle: "Login",
      isStarted: null,
      errorMessage: null,
    });
  }

  // POST auth/login
  postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    Staff.findOne({ email: email })
      .then((staff) => {
        if (!staff) {
          return res.status(422).render("auth/login", {
            path: "/login",
            pageTitle: "Login",
            errorMessage: "Invalid email or password.",
            oldInput: {
              email: email,
              password: password,
            },
            validationErrors: [],
          });
        }
        req.session.isLoggedIn = true;
        req.session.email = email;
        req.session.staff = staff;
        return req.session.save((err) => {
          console.log(err);
          res.redirect("/");
        });
      })
      .catch((err) => {
        console.log(err);
        res.redirect("/login");
      });
  };

  postLogout = (req, res, next) => {
    req.session.destroy((err) => {
      console.log(err);
      res.redirect("/");
    });
  };
}

module.exports = new AuthController();
