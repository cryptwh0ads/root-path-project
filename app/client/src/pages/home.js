import React, { Component } from "react";
import axios from "axios";
import Grid from "@material-ui/core/Grid";

import Posts from "../components/Posts";
class Home extends Component {
  state = {
    posts: null,
  };

  componentDidMount() {
    axios
      .get("/posts")
      .then((res) => {
        console.log(res.data);
        this.setState({
          posts: res.data,
        });
      })
      .catch((err) => console.log(err));
  }

  render() {
    let recentPosts = this.state.posts ? (
      this.state.posts.map((post) => <Posts data={post} />)
    ) : (
      <p>Loading ...</p>
    );
    return (
      <Grid container spacing={10}>
        <Grid item sm={4} xs={12}>
          <p>Profile Contents</p>
        </Grid>
        <Grid item sm={8} xs={12}>
          {recentPosts}
        </Grid>
      </Grid>
    );
  }
}

export default Home;
