import React, { useState } from "react";
import {
  Typography,
  Button,
  Grid,
  FormHelperText,
  FormControl,
  Radio,
  RadioGroup,
  FormControlLabel,
  TextField,
  Link,
  Collapse,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const CreateRoomPage = ({
  votesToSkip = 2,
  guestCanPause = true,
  update = false,
  roomCode = null,
  errorMsg = "",
  succecsMsg = "",
  updateCallback = () => {},
}) => {
  const navigate = useNavigate();
  const [guestCanPauseState, setGuestCanPauseState] = useState(guestCanPause);
  const [votesToSkipState, setVotesToSkipState] = useState(votesToSkip);
  const [errorMessage, setErrorMessage] = useState(errorMsg);
  const [successMessage, setSuccessMessage] = useState(succecsMsg);

  const handleRoomButtonPressed = () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        votes_to_skip: votesToSkipState,
        guest_can_pause: guestCanPauseState,
      }),
    };
    fetch("/api/create-room", requestOptions)
      .then((response) => response.json())
      .then((data) => navigate("/room/" + data.code))
      .catch(() => setErrorMessage("Error creating the room."));
  };

  const handleUpdateButtonPressed = () => {
    const requestOptions = {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        votes_to_skip: votesToSkipState,
        guest_can_pause: guestCanPauseState,
        code: roomCode,
      }),
    };
    fetch("/api/update-room", requestOptions)
      .then((response) => {
        if (response.ok) {
          setSuccessMessage("Room updated successfully!");
          if (updateCallback) updateCallback();
        } else {
          setErrorMessage("Error updating the room.");
        }
      })
      .catch(() => setErrorMessage("Error updating the room."));
  };

  const title = update ? "Update Room" : "Create a Room";

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} align="center">
        <Collapse in={errorMessage !== "" || successMessage !== ""}>
          {successMessage !== "" ? (
            <Alert
              severity="success"
              onClose={() => setSuccessMessage("")}
            >
              {successMessage}
            </Alert>
          ) : (
            <Alert
              severity="error"
              onClose={() => setErrorMessage("")}
            >
              {errorMessage}
            </Alert>
          )}
        </Collapse>
      </Grid>
      <Grid item xs={12} align="center">
        <Typography component="h4" variant="h4">
          {title}
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <FormControl component="fieldset">
          <FormHelperText>
            <div align="center">Guest Control of Playback State</div>
          </FormHelperText>
          <RadioGroup
            row
            value={guestCanPauseState.toString()}
            onChange={(e) => setGuestCanPauseState(e.target.value === "true")}
          >
            <FormControlLabel
              value="true"
              control={<Radio color="primary" />}
              label="Play/Pause"
              labelPlacement="bottom"
            />
            <FormControlLabel
              value="false"
              control={<Radio color="secondary" />}
              label="No Control"
              labelPlacement="bottom"
            />
          </RadioGroup>
        </FormControl>
      </Grid>
      <Grid item xs={12} align="center">
        <FormControl>
          <TextField
            required
            type="number"
            onChange={(e) => setVotesToSkipState(e.target.value)}
            value={votesToSkipState}
            inputProps={{
              min: 1,
              style: { textAlign: "center" },
            }}
          />
          <FormHelperText>
            <div align="center">Votes Required To Skip Song</div>
          </FormHelperText>
        </FormControl>
      </Grid>
      <Grid item xs={12} align="center">
        {update ? (
          <Button
            color="primary"
            variant="contained"
            onClick={handleUpdateButtonPressed}
          >
            Update the Room
          </Button>
        ) : (
          <Button
            color="primary"
            variant="contained"
            onClick={handleRoomButtonPressed}
          >
            Create A Room
          </Button>
        )}
      </Grid>

      <Grid item xs={12} align="center">
        <Button color="secondary" variant="contained" to="/" component={Link}>
          Back
        </Button>
      </Grid>
    </Grid>
  );
};

export default CreateRoomPage;
