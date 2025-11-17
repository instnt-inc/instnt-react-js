import React, { useState } from 'react';
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import { Button, Alert, Paper } from '@mui/material';
import {
  TextField,
} from "@mui/material";
//import { logMessage } from "@instnt/instnt-react-js";
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

// New reusable JSON editor component for front/back/selfie settings
const JSONEditor = ({ title, initialJson, onApply }) => {
  const [text, setText] = useState(initialJson ? JSON.stringify(initialJson, null, 2) : '');
  const [parsed, setParsed] = useState(initialJson || null);
  const [error, setError] = useState('');

  const handleChange = (e) => setText(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      const p = JSON.parse(text);
      setParsed(p);
      setError('');
      if (onApply) onApply(p);
    } catch {
      setParsed(null);
      setError('Invalid JSON. Please correct it.');
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        padding: { xs: 2, sm: 3 },
        marginTop: 3,
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontSize: { xs: "16px", sm: "18px" },
          fontWeight: 600
        }}
        gutterBottom
      >
        {title}
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          label="JSON Input"
          multiline
          minRows={6}
          maxRows={14}
          value={text}
          onChange={handleChange}
          fullWidth
          variant="outlined"
          sx={{
            mb: 2,
            "& textarea": {
              fontSize: { xs: "12px", sm: "14px" },
            }
          }}
        />

        <Button
          variant="contained"
          color="primary"
          type="submit"
          fullWidth
          sx={{ paddingY: 1.2 }}
        >
          Apply
        </Button>
      </form>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {parsed && (
        <Box
          sx={{
            mt: 2,
            maxHeight: 250,
            overflowY: "auto",
            backgroundColor: "#f5f5f5",
            padding: 2,
            borderRadius: 1,
            fontSize: { xs: "12px", sm: "14px" },
          }}
        >
          <pre style={{ margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
            {JSON.stringify(parsed, null, 2)}
          </pre>
        </Box>
      )}
    </Paper>
  );
};


const ChooseDocument = (props) => {

  // handlers for toggles were removed because the corresponding UI is commented out.
  // Use props.onToggleDocCaptureSettings and props.onToggleCaptureFrameworkDebug directly
  // in the UI when you re-enable those controls.

  console.log('log', 'document settings to apply : ', props.documentSettingsToApply);

  const onSelectImage = (key, image)=>{
    props.changeDocumentSettings(key, image);
  }

  // Use props.changeDocumentSettings(...) directly where needed instead of the removed helper.

  // Handlers to receive validated JSON from each editor and forward to parent
  const applyFrontSettings = (parsed) => {
    // if (props.changeDocumentSettings) {
    //   props.changeDocumentSettings('frontDocumentCaptureSettings', parsed);
    // }
    if (props.onApplyDocumentSettings) {
      props.onApplyDocumentSettings({ type: 'front', settings: parsed });
    }
  };

  const applyBackSettings = (parsed) => {
    // if (props.changeDocumentSettings) {
    //   props.changeDocumentSettings('backDocumentCaptureSettings', parsed);
    //}
    if (props.onApplyDocumentSettings) {
      props.onApplyDocumentSettings({ type: 'back', settings: parsed });
    }
  };

  const applySelfieSettings = (parsed) => {
    // if (props.changeDocumentSettings) {
    //   props.changeDocumentSettings('selfieCaptureSettings', parsed);
    // }
    if (props.onApplyDocumentSettings) {
      props.onApplyDocumentSettings({ type: 'selfie', settings: parsed });
    }
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

        <Divider />

        <ImageUpload setUploadedImage={(key, value)=>onSelectImage(key, value)}/>
      </Box>

      {/* JSON editors for front/back/selfie - each editor calls a handler that forwards validated settings to parent */}
      <Box sx={{
    width: "100%",
    maxWidth: 800,
    margin: "20px auto",
    paddingX: { xs: 1, sm: 2 }
  }}>
        <JSONEditor
          title="Front Document Capture Settings"
          initialJson={props.documentSettingsToApply ? props.documentSettingsToApply.front : null}
          onApply={applyFrontSettings}
        />

        <JSONEditor
          title="Back Document Capture Settings"
          initialJson={props.documentSettingsToApply ? props.documentSettingsToApply.back : null}
          onApply={applyBackSettings}
        />

        <JSONEditor
          title="Selfie Settings"
          initialJson={props.documentSettingsToApply ? props.documentSettingsToApply.selfie : null}
          onApply={applySelfieSettings}
        />
      </Box>
    </FormControl>
  );
};

export default ChooseDocument;
