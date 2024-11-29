import React, { Component } from "react";
import RoomJoinPage from "./RoomJoinPage";
import CreateRoomPage from "./CreateRoomPage";
import Room from "./Room";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import { Grid, Button, ButtonGroup, Typography } from "@mui/material";
import Info from "./info";


export default class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roomCode: null
    };
    this.clearRoomCode = this.clearRoomCode.bind(this); // Ensure `this` is bound correctly
  }

  async componentDidMount() {
    fetch('/api/user-in-room')
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          roomCode: data.code
        });
      });
  }

  renderHomePage() {
    return (
      <Grid container spacing={3}>
        <Grid item xs={12} align="center">
          <Typography variant="h3" component="h3">
            House Party
          </Typography>
        </Grid>
        <Grid item xs={12} align="center">
          <ButtonGroup disableElevation variant="contained" color="primary">
            <Button color="primary" to='/join' component={Link}>
              Join A Room
            </Button>
            <Button color="default" to='/info' component={Link}>
              Info
            </Button>
            <Button color="secondary" to='/create' component={Link}>
              Create A Room
            </Button>
          </ButtonGroup>
        </Grid>
      </Grid>
    );
  }

  clearRoomCode(){
    this.setState({
      roomCode: null,
    });
  }

  render() { 
    return (
      <Router>
        <Routes>
          <Route path="/" element={this.state.roomCode ? <Navigate replace to={`/room/${this.state.roomCode}`} /> : this.renderHomePage()} />
          <Route path="/join" element={<RoomJoinPage />} />
          <Route path="/info" element={<Info/>}/>
          <Route path="/create" element={<CreateRoomPage />} />
          <Route path="/room/:roomCode" element={<Room leaveRoomCallback={this.clearRoomCode} />} />
        </Routes>
      </Router>
    );
  }
}
 