const isManage = (req, res, next) => {
    if (req.staff.role === 'admin') {
        return next();
    }
    res.status(401).redirect('/');
};

module.exports = isManage;
