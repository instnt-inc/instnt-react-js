import React, { useState } from 'react';
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
} from "@mui/material";
import { logMessage } from "@instnt/instnt-react-js";
import { Button } from '@mui/material';
import "../App.css";

const ImageUpload = (props) => {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {

      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(URL.createObjectURL(file));
        props.setUploadedImage('companyLogo', reader.result); // Set the Base64 string
      };
      reader.readAsDataURL(file);
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <Button
        variant="contained"
        component="label"
        sx={{ marginBottom: 2, marginTop:5 }}
      >
        Upload Image
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          hidden
        />
      </Button>

      {selectedImage && (
        <Box
          component="img"
          src={selectedImage}
          alt="Selected"
          sx={{ width: 200, height: 200, objectFit: 'cover', marginBottom: 2 }}
        />
      )}
    </Box>
  );
};




const ChooseDocument = (props) => {
  const handleChange = (event) => {
    props.onToggleDocCaptureSettings(event.target.checked);
  };

  const handleChangeFrameworkDebug = (event) =>{
    props.onToggleCaptureFrameworkDebug(event.target.checked);
  }

  logMessage('log', 'document settings to apply : ', props.documentSettingsToApply);

  const onSelectImage = (key, image)=>{
    props.changeDocumentSettings(key, image);
  }

  const onChangeSettings = (key, event) => {
    props.changeDocumentSettings(key, event.target.value);
  };

  return (
    <FormControl className="choose-document-container" component="fieldset" sx={{
      minWidth: {
        xs: "100%",
        sm: "500px",
      },
    }}>
      <FormLabel component="legend">
        <Typography
          variant="h6"
          className="choose-document-heading"
          component="div"
          style={{ fontWeight: 600, color: "#000" }}
          align="left"
        >
          Choose Document Type
        </Typography>
        <Typography
          variant="body2"
          gutterBottom
          className="choose-document-sub-heading"
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
          className="radio-buttons-group"
          name="radio-buttons-group"
          onChange={props.onDocumentTypeChanged}
        >
          <FormControlLabel
            value="License"
            className="license-radio"
            control={<Radio />}
            label="Driver's License or ID card"
          />
          <FormControlLabel
            value="PassportBook"
            className="passport-book-radio"
            control={<Radio />}
            label="Passport Book"
          />
          <FormControlLabel
            value="passportCard"
            className="passport-card-radio"
            control={<Radio />}
            label="Passport Card"
          />
        </RadioGroup>

        <FormControlLabel
          label="Enable Debug"
          sx={{ mb: 2 }}
          className="enable-debug-checkbox"
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
          className="use-custom-settings-checkbox"
          control={
            <Checkbox
              checked={props.customDocCaptureSettings}
              onChange={handleChange}
            />
          }
        />
        

        <Divider />

        <ImageUpload setUploadedImage={(key, value)=>onSelectImage(key, value)}/>

        {props.customDocCaptureSettings && (
          <FormControl className="custom-setting-container" sx={{ mt: 2 }} fullWidth>
            <FormControl className="custom-setting-capture-mode" variant="filled">
              <InputLabel className="custom-setting-capture-mode-label" htmlFor="uncontrolled-native">
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

            <FormControl className="custom-setting-orientation-capture-mode" variant="filled">
              <InputLabel className="custom-setting-orientation-capture-mode-label" htmlFor="uncontrolled-native">
                Orientation Capture Mode
              </InputLabel>
              <Select
                sx={{ mb: 2 }}
                defaultValue={props.documentSettingsToApply.orientationCaptureMode}
                onChange={(event) => onChangeSettings("orientationCaptureMode", event)}
              >
                <MenuItem value="Any">Any</MenuItem>
                <MenuItem value="Portrait">Portrait</MenuItem>
                <MenuItem value="Landscape">Landscape</MenuItem>
                <MenuItem value="LandscapeLeft">LandscapeLeft</MenuItem>
                <MenuItem value="LandscapeRight">LandscapeRight</MenuItem>
              </Select>
            </FormControl>

            <FormControl className="custom-setting-enable-face-detection" variant="filled">
              <InputLabel className="custom-setting-enable-face-detection-label" htmlFor="uncontrolled-native">
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

            <FormControl className="custom-setting-is-barcode-detected-enabled" variant="filled">
              <InputLabel className="custom-setting-is-barcode-detected-enabled-label" htmlFor="uncontrolled-native">
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
              label="Loading Screen Primary Text"
              className="custom-setting-primary-text"
              id='primary-text-manual'
              variant="filled"
              value={props.documentSettingsToApply.loadingScreenPrimaryText}
              onChange={(event) => onChangeSettings("loadingScreenPrimaryText", event)}
            />

            <TextField
              sx={{ mb: 2 }}
              label="Loading Screen Notice Text"
              className="custom-setting-notice-text"
              id='notice-text-manual'
              variant="filled"
              value={props.documentSettingsToApply.loadingScreenNoticeText}
              onChange={(event) => onChangeSettings("loadingScreenNoticeText", event)}
            />

            <TextField
              sx={{ mb: 2 }}
              label="Overlay Text Manual"
              className="custom-setting-overlay-text-manual"
              id='overlay-text-manual'
              variant="filled"
              value={props.documentSettingsToApply.overlayText}
              onChange={(event) => onChangeSettings("overlayText", event)}
            />
            <TextField
              sx={{ mb: 2 }}
              label="Overlay Text Auto"
              className="custom-setting-overlay-text-auto"
              id='overlay-text-auto'
              variant="filled"
              value={props.documentSettingsToApply.overlayTextAuto}
              onChange={(event) => onChangeSettings("overlayTextAuto", event)}
            />
            <TextField
              sx={{ mb: 2 }}
              label="Overlay Color"
              className="custom-setting-overlay-color"
              id='overlay-color'
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
