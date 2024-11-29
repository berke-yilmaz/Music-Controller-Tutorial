import React from "react";
import {
  Grid,
  Typography,
  Card,
  IconButton,
  LinearProgress,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import PauseIcon from "@mui/icons-material/Pause";

const MusicPlayer = ({
  image_url,
  title,
  artist,
  is_playing,
  time,
  duration,
  onPlayPauseClick,
  onSkipClick,
  votes,
  votes_required,
}) => {
  const songProgress = (time / duration) * 100;

  // Pause song request
  const pauseSong = async () => {
    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    };
    await fetch("/spotify/pause", requestOptions);
  };

  // Play song request
  const playSong = async () => {
    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    };
    await fetch("/spotify/play", requestOptions);
  };

  // Skip song request
  const skipSong = async () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    };
    await fetch("/spotify/skip", requestOptions); // Correct endpoint for skipping a song
  };

  return (
    <Card>
      <Grid container alignItems="center">
        <Grid item align="center" xs={4}>
          <img src={image_url} alt="Song artwork" height="100%" width="100%" />
        </Grid>
        <Grid item align="center" xs={8}>
          <Typography component="h5" variant="h5">
            {title}
          </Typography>
          <Typography color="textSecondary" variant="subtitle1">
            {artist}
          </Typography>
          <div>
            <IconButton onClick={() => (is_playing ? pauseSong() : playSong())}>
              {is_playing ? <PauseIcon /> : <PlayArrowIcon />}
            </IconButton>
            <IconButton onClick={onSkipClick}>
              <SkipNextIcon />
            </IconButton>
            <Typography variant="body2" color="textSecondary">
              {votes} / {votes_required} votes
            </Typography>
          </div>
        </Grid>
      </Grid>
      <LinearProgress variant="determinate" value={songProgress} />
    </Card>
  );
};

export default MusicPlayer;
