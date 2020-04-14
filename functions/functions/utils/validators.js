const isEmail = (email) => {
  const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (email.match(regEx)) return true;
  else return false;
};

const isEmpty = (string) => {
  if (string.trim() === "") return true;
  else return false;
};

exports.validateSignUp = (data) => {
  let errors = {};
  // Validate email
  if (isEmpty(data.email)) {
    errors.email = "Email must not be empty";
  } else if (!isEmail(data.email)) {
    errors.email = "Must be a valid email address";
  }
  // Validate pass
  if (isEmpty(data.passwd)) errors.passwd = "Must not be empty";
  if (data.passwd !== data.confirmPasswd)
    errors.confirmPasswd = "Passwords must match";
  // Validate short name
  if (isEmpty(data.shortName)) errors.shortName = "Must not be empty";

  return {
    errors,
    isValid: Object.keys(errors).length === 0 ? true : false,
  };
};

exports.validateLogin = (data) => {
  let errors = {};

  if (isEmpty(data.email)) errors.email = "Must not be empty";
  if (isEmpty(data.passwd)) errors.passwd = "Must not be empty";

  return {
    errors,
    isValid: Object.keys(errors).length === 0 ? true : false,
  };
};

exports.reduceUserBio = (data) => {
  let userBio = {};

  if (!isEmpty(data.bio.trim())) userBio.bio = data.bio;
  if (!isEmpty(data.website.trim())) {
    if (data.website.trim().substring(0, 4) !== "http") {
      userBio.website = `http://${data.website.trim()}`;
    } else userBio.website = data.website;
  }
  if (!isEmpty(data.location.trim())) userBio.location = data.location;

  return userBio;
};
