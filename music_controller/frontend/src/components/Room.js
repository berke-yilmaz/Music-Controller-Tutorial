import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Grid, Button, Typography, Collapse } from "@mui/material";
import CreateRoomPage from "./CreateRoomPage";
import { Alert } from "@mui/material";
import MusicPlayer from "./MusicPlayer";

const Room = () => {
  const { roomCode } = useParams();
  const navigate = useNavigate();
  const [roomDetails, setRoomDetails] = useState({
    votesToSkip: 2,
    guestCanPause: false,
    isHost: false,
    showSettings: false,
    spotifyAuthenticated: false,
    song: {},
  });
  const [error, setError] = useState("");

  const getRoomDetails = async () => {
    try {
      const response = await fetch(`/api/get-room?code=${roomCode}`);
      if (!response.ok) {
        setError("Room not found.");
        return;
      }
      const data = await response.json();
      setRoomDetails((prevState) => ({
        ...prevState,
        votesToSkip: data.votes_to_skip,
        guestCanPause: data.guest_can_pause,
        isHost: data.is_host,
      }));

      if (data.is_host) {
        authenticateSpotify();
      }
    } catch (err) {
      console.error("Error fetching room details:", err);
      setError("Failed to fetch room details.");
    }
  };

  const getCurrentSong = async () => {
    try {
      const response = await fetch("/spotify/current-song");
      if (!response.ok) {
        return;
      }
      const data = await response.json();
      setRoomDetails((prevState) => ({
        ...prevState,
        song: data,
      }));
    } catch (err) {
      console.error("Error fetching current song:", err);
    }
  };

  const authenticateSpotify = async () => {
    try {
      const response = await fetch("/spotify/is-authenticated");
      const data = await response.json();

      setRoomDetails((prevState) => ({
        ...prevState,
        spotifyAuthenticated: data.status,
      }));

      if (!data.status) {
        const authResponse = await fetch("/spotify/get-auth-url");
        const authData = await authResponse.json();
        window.location.replace(authData.url);
      }
    } catch (err) {
      console.error("Error authenticating with Spotify:", err);
      setError("Failed to authenticate with Spotify.");
    }
  };

  useEffect(() => {
    getRoomDetails();
  }, [roomCode]);

  useEffect(() => {
    const interval = setInterval(getCurrentSong, 1000);
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const leaveButtonPressed = async () => {
    try {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      };
      const response = await fetch("/api/leave-room", requestOptions);
      if (!response.ok) {
        throw new Error("Failed to leave room");
      }
      navigate("/");
    } catch (err) {
      console.error("Error leaving room:", err);
      setError("Failed to leave the room.");
    }
  };

  const updateShowSettings = (value) => {
    setRoomDetails((prevState) => ({
      ...prevState,
      showSettings: value,
    }));
  };

  const renderSettings = () => (
    <Grid container spacing={1}>
      <Grid item xs={12} align="center">
        <CreateRoomPage
          update={true}
          votesToSkip={roomDetails.votesToSkip}
          guestCanPause={roomDetails.guestCanPause}
          roomCode={roomCode}
          updateCallback={getRoomDetails}
        />
      </Grid>
      <Grid item xs={12} align="center">
        <Button
          variant="contained"
          color="secondary"
          onClick={() => updateShowSettings(false)}
        >
          Close
        </Button>
      </Grid>
    </Grid>
  );

  const renderSettingsButton = () => (
    <Grid item xs={12} align="center">
      <Button
        variant="contained"
        color="primary"
        onClick={() => updateShowSettings(true)}
      >
        Settings
      </Button>
    </Grid>
  );

  if (roomDetails.showSettings) {
    return renderSettings();
  }

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} align="center">
        <Typography variant="h4" component="h4">
          Code: {roomCode}
        </Typography>
        <Collapse in={!!error}>
          {error && (
            <Alert severity="error" onClose={() => setError("")}>
              {error}
            </Alert>
          )}
        </Collapse>
      </Grid>
      <Grid item xs={12}>
        <MusicPlayer
          image_url={roomDetails.song?.image_url || ""}
          title={roomDetails.song?.title || "No song playing"}
          artist={roomDetails.song?.artist || ""}
          is_playing={roomDetails.song?.is_playing || false}
          time={roomDetails.song?.time || 0}
          duration={roomDetails.song?.duration || 0}
          onPlayPauseClick={() => {}}
          onSkipClick={() => {}}
        />
      </Grid>
      <Grid item xs={12} align="center">
        <Typography variant="h6" component="h6">
          Votes: {roomDetails.votesToSkip}
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <Typography variant="h6" component="h6">
          Guest Can Pause: {roomDetails.guestCanPause ? "Yes" : "No"}
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <Typography variant="h6" component="h6">
          Host: {roomDetails.isHost ? "Yes" : "No"}
        </Typography>
      </Grid>
      {roomDetails.isHost && renderSettingsButton()}
      <Grid item xs={12} align="center">
        <Button variant="contained" color="secondary" onClick={leaveButtonPressed}>
          Leave Room
        </Button>
      </Grid>
    </Grid>
  );
};

export default Room;
