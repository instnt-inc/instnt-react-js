import * as React from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import {
  Checkbox,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  NativeSelect,
} from "@mui/material";

import "../App.css";
import { logMessage } from "@instnt/instnt-react-js";

const ChooseDocument = (props) => {
  const handleChange = (event) => {
    props.onToggleDocCaptureSettings(event.target.checked);
  };

  const handleChangeFrameworkDebug = (event) =>{
    props.onToggleCaptureFrameworkDebug(event.target.checked);
  }

  logMessage('log', 'document settings to apply : ', props.documentSettingsToApply);

  const onChangeSettings = (key, event) => {
    props.changeDocumentSettings(key, event.target.value);
  };

  return (
    <FormControl component="fieldset" sx={{
      minWidth: {
        xs: "100%",
        sm: "500px",
      },
    }}>
      <FormLabel component="legend">
        <Typography
          variant="h6"
          // gutterBottom
          component="div"
          style={{ fontWeight: 600, color: "#000" }}
          align="left"
        >
          Choose Document Type
        </Typography>
        <Typography
          variant="body2"
          gutterBottom
          component="div"
          color="#000"
          align="left"
        >
          As an added layer of security, we need to verify your identity before
          approving your application
        </Typography>
      </FormLabel>
      <Box
        sx={{
          mt: 2,
        }}
      >
        <RadioGroup
          aria-label="document"
          defaultValue="License"
          name="radio-buttons-group"
          onChange={props.onDocumentTypeChanged}
        >
          <FormControlLabel
            value="License"
            control={<Radio />}
            label="Driver's License or ID card"
          />
          <FormControlLabel
            value="PassportBook"
            control={<Radio />}
            label="Passport Book"
          />
          <FormControlLabel
            value="passportCard"
            control={<Radio />}
            label="Passport Card"
          />
        </RadioGroup>

        <FormControlLabel
          label="Enable Debug"
          sx={{ mb: 2 }}
          control={
            <Checkbox
              checked={props.captureFrameworkDebug}
              onChange={handleChangeFrameworkDebug}
            />
          }
        />

        <FormControlLabel
          label="Use Custom Settings"
          sx={{ mb: 2 }}
          control={
            <Checkbox
              checked={props.customDocCaptureSettings}
              onChange={handleChange}
            />
          }
        />
        

        <Divider />

        {props.customDocCaptureSettings && (
          <FormControl sx={{ mt: 2 }} fullWidth>
            <FormControl variant="filled">
              <InputLabel htmlFor="uncontrolled-native">
                Capture Mode
              </InputLabel>
              <Select
                sx={{ mb: 2 }}
                defaultValue={props.documentSettingsToApply.captureMode}
                onChange={(event) => onChangeSettings("captureMode", event)}
              >
                <MenuItem value="Manual">Manual</MenuItem>
                <MenuItem value="Auto">Auto</MenuItem>
              </Select>
            </FormControl>

            <FormControl variant="filled">
              <InputLabel htmlFor="uncontrolled-native">
              enableFaceDetection
              </InputLabel>
              <Select
                sx={{ mb: 2 }}
                defaultValue={props.documentSettingsToApply.enableFaceDetection}
                onChange={(event) => onChangeSettings("enableFaceDetection", event)}
              >
                <MenuItem value="true">Yes</MenuItem>
                <MenuItem value="false">No</MenuItem>
              </Select>
            </FormControl>

            <FormControl variant="filled">
              <InputLabel htmlFor="uncontrolled-native">
              isBarcodeDetectedEnabled
              </InputLabel>
              <Select
                sx={{ mb: 2 }}
                defaultValue={props.documentSettingsToApply.isBarcodeDetectedEnabled}
                onChange={(event) => onChangeSettings("isBarcodeDetectedEnabled", event)}
              >
                <MenuItem value="true">Yes</MenuItem>
                <MenuItem value="false">No</MenuItem>
              </Select>
            </FormControl>

            <TextField
              sx={{ mb: 2 }}
              label="Overlay Text Manual"
              variant="filled"
              value={props.documentSettingsToApply.overlayText}
              onChange={(event) => onChangeSettings("overlayText", event)}
            />
            <TextField
              sx={{ mb: 2 }}
              label="Overlay Text Auto"
              variant="filled"
              value={props.documentSettingsToApply.overlayTextAuto}
              onChange={(event) => onChangeSettings("overlayTextAuto", event)}
            />
            <TextField
              sx={{ mb: 2 }}
              label="Overlay Color"
              variant="filled"
              value={props.documentSettingsToApply.overlayColor}
              onChange={(event) => onChangeSettings("overlayColor", event)}
            />
          </FormControl>
        )}
      </Box>
    </FormControl>
  );
};

export default ChooseDocument;
