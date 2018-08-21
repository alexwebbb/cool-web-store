var Session = require("../models/session");

// Display list of all sessions.
exports.session_list = async function(req, res, next) {
  try {
    const session_list = await Session.find({}, "user views")
        .populate("user")
        .populate("views.item")
        .exec(),
      data = session_list.map(({ user, views }) => {
        return {
          name: user.name,
          views: views.map(v => {
            return v.item.name;
          })
        };
      });

    res.send(data);
  } catch (err) {
    return next(err);
  }
};

// Display detail page for a specific session.
exports.session_detail = async function(req, res, next) {
  try {
    const session_list = await Session.find({}, "user views")
      .populate("user")
      .populate("views.item")
      .exec();
    res.send(session_list);
  } catch (err) {
    return next(err);
  }
};

exports.CheckCreds = (req, res, next) => {
	if (!req.user.user_group === "admin") {
	  res.redirect("/login");
	}
	next();
  };
