import * as React from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {
  Checkbox,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  NativeSelect,
} from "@mui/material";

import "../App.css";

const ChooseDocument = (props) => {
  const handleChange = (event) => {
    props.onToggleDocCaptureSettings(event.target.checked);
  };
  console.log("document settings to apply : ", props.documentSettingsToApply);

  const onChangeSettings = (key, event) => {
    props.changeDocumentSettings(key, event.target.value);
  };

  return (
    <FormControl
      component="fieldset"
      sx={{ alignItems: "center", width: "100%" }}
    >
      <FormLabel component="legend">
        <Typography variant="h5" component="div" gutterBottom>
          Choose the document type
        </Typography>
      </FormLabel>
      <Box sx={{ alignItems: "center", justifyContent: "left", width: "75%" }}>
        <FormLabel component="legend">
          <Typography sx={{ mb: 1.5 }}>
            As an added layer of security, we need to verify your identity
            before approving your application
          </Typography>
        </FormLabel>
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
          label="Use Custom Settings"
          control={
            <Checkbox
              checked={props.customDocCaptureSettings}
              onChange={handleChange}
            />
          }
        />
        {props.customDocCaptureSettings && (
          <>
            <FormControl fullWidth>
              <InputLabel variant="standard" htmlFor="uncontrolled-native">
                Capture Mode
              </InputLabel>
              <NativeSelect
                sx={{ mb: 2 }}
                defaultValue={props.documentSettingsToApply.captureMode}
                onChange={(event) => onChangeSettings("captureMode", event)}
              >
                <option value="Manual">Manual</option>
                <option value="Auto">Auto</option>
              </NativeSelect>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel variant="standard" htmlFor="uncontrolled-native">
                enableFaceDetection
              </InputLabel>
              <NativeSelect
                sx={{ mb: 2 }}
                defaultValue={props.documentSettingsToApply.enableFaceDetection}
                onChange={(event) => onChangeSettings("enableFaceDetection", event)}
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </NativeSelect>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel variant="standard" htmlFor="uncontrolled-native">
                isBarcodeDetectedEnabled
              </InputLabel>
              <NativeSelect
                sx={{ mb: 2 }}
                defaultValue={props.documentSettingsToApply.isBarcodeDetectedEnabled}
                onChange={(event) => onChangeSettings("isBarcodeDetectedEnabled", event)}
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </NativeSelect>
            </FormControl>
            <TextField
              sx={{ mb: 2 }}
              label="Overlay Text Manual"
              variant="standard"
              value={props.documentSettingsToApply.overlayText}
              onChange={(event) => onChangeSettings("overlayText", event)}
              fullWidth
            />
            <TextField
              sx={{ mb: 2 }}
              label="Overlay Text Auto"
              variant="standard"
              value={props.documentSettingsToApply.overlayTextAuto}
              onChange={(event) => onChangeSettings("overlayTextAuto", event)}
              fullWidth
            />
            <TextField
              sx={{ mb: 2 }}
              label="Overlay Color"
              variant="standard"
              value={props.documentSettingsToApply.overlayColor}
              onChange={(event) => onChangeSettings("overlayColor", event)}
              fullWidth
            />
          </>
        )}
      </Box>
    </FormControl>
  );
};

export default ChooseDocument;
