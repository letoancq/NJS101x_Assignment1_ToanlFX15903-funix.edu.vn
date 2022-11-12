getIndex = (req, res) => {
  res.render("home", {
    path: "/home",
    pageTitle: "home",
    isStarted: null,
    isLoggedIn: req.session.isLoggedIn,
    role: req.session.staff.role,
  });
};

module.exports = { getIndex };
