import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core";

export const HomeButton = withStyles({
  root: {
    borderColor: "#03CEA4",
    color: "#03CEA4",
    borderRadius: "16px",
    "&:hover": {
      color: "#03CEA4",
    },
  },
})(Button);

export const LoginButton = withStyles({
  root: {
    backgroundColor: "#03CEA4",
    color: "#FFF",
    borderRadius: "16px",
    marginLeft: "8px",
    paddingLeft: "25px",
    paddingRight: "25px",
    "&:hover": {
      backgroundColor: "#03A38D",
      borderColor: "#03CEA4",
      boxShadow: "none",
      color: "#FFF",
    },
  },
})(Button);
