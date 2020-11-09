const { User } = require("../models");

module.exports = (req, res) => {
  const { password, username } = req.body;

  User.findOrCreate({
    where: {
      username,
    },
    defaults: {
      password,
    },
  }).then(async ([user, created]) => {
    if (!created) {
      return res.status(409).send("email exists");
    }
    const data = await user.get({ plain: true });
    res.status(201).json(data);
  });
};
