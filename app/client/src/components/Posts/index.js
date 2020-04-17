import React, { Component } from "react";
import { Link } from "react-router-dom";
import withStyles from "@material-ui/core/styles/withStyles";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

// Card structure
import { Card, CardContent, CardMedia, Typography } from "@material-ui/core";

const styles = {
  card: {
    display: "flex",
    marginBottom: 20,
  },
  image: {
    minWidth: 180,
  },
  content: {
    padding: 25,
    objectFit: "cover",
    backgroundColor: "#FFF",
  },
};

class Posts extends Component {
  render() {
    dayjs.extend(relativeTime);
    const {
      classes,
      data: { bodyMessage, createdAt, userImage, shortName },
    } = this.props;
    return (
      <Card className={classes.card}>
        <CardMedia
          image={userImage}
          title={`${shortName}' profile image`}
          className={classes.image}
        />
        <CardContent className={classes.content}>
          <Typography
            variant="h5"
            component={Link}
            to={`/users/${shortName}`}
            color={"secondary"}
          >
            {shortName}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {dayjs(createdAt).fromNow()}
          </Typography>
          <Typography variant="body1">{bodyMessage}</Typography>
        </CardContent>
      </Card>
    );
  }
}

export default withStyles(styles)(Posts);
