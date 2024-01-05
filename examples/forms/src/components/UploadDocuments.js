import * as React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Box,
  Collapse,
  List,
  ListItemButton,
  ListItemText,
  Divider,
  Button,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import Typography from "@mui/material/Typography";
import {
  InstntDocumentProcessor,
  InstntSelfieProcessor,
} from "@instnt/instnt-react-js";
import "../App.css";
import "./styles.css";

const ReviewCapture = (props) => {
  let img = document.createElement("IMG");
  img.src = props.captureResult?.result;

  const [openFront, setOpenFront] = React.useState(false);
  const [openBack, setOpenBack] = React.useState(false);
  const [openSelfie, setOpenSelfie] = React.useState(false);

  const handleClickCollapse = (key) => {
    if (key === "front") {
      setOpenFront(!openFront);
    } else if (key === "back") {
      setOpenBack(!openBack);
    } else if (key === "selfie") {
      setOpenSelfie(!openSelfie);
    }

    if (key !== "front") {
      setOpenFront(false);
    }
    if (key !== "back") {
      setOpenBack(false);
    }
    if (key !== "selfie") {
      setOpenSelfie(false);
    }
  };

  const handleClickStart = (key) => {
    if (props.onChangeStart) {
      props.onChangeStart(key);
    }
  };

  return (
    <div>
      {props.startFront ? (
        <InstntDocumentProcessor
          documentSettings={props.frontLicenseSettings}
          captureFrameworkDebug={props.captureFrameworkDebug}
        />
      ) : props.startBack ? (
        <InstntDocumentProcessor documentSettings={props.backLicenseSettings} captureFrameworkDebug={props.captureFrameworkDebug}/>
      ) : props.startSelfie ? (
        <InstntSelfieProcessor selfieSettings={props.selfieSettings} captureFrameworkDebug={props.captureFrameworkDebug} />
      ) : (
        <Box
          sx={{
            minWidth: {
              xs: "100%",
              sm: "700px",
            },
          }}
        >
          <Typography
            variant="h6"
            gutterBottom
            className="upload-documents-container"
            component="div"
            style={{ fontWeight: 600, color: "#000" }}
            align="left"
          >
            Upload Document Images and Selfie
          </Typography>

          <Card sx={{ mt: 3 }}>
            <CardContent sx={{ p: "0px !important" }}>
              <List>
                <ListItemButton onClick={() => handleClickCollapse("front")}>
                  <ListItemText className="front-image-section" primary="Front Image" />
                  {openFront ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={openFront} timeout="auto" unmountOnExit>
                  <Box sx={{ p: 2 }}>
                    <Typography
                      variant="body2"
                      gutterBottom
                      component="div"
                      color="#000"
                      align="left"
                    >
                      {props.frontCapture
                        ? `To Update the front of your driver's license, please click again:`
                        : `Please take a picture of the front of your driver's
                      license:`}
                    </Typography>

                    <Divider />

                    {props.frontCapture && (
                      <CardMedia
                        component="img"
                        height="300"
                        image={props.frontCapture?.result}
                        alt="DL front"
                      />
                    )}
                    <div style={{ textAlign: "right" }}>
                      <Button
                        variant="contained"
                        size="small"
                        sx={{ mt: "12px", textTransform: "capitalize" }}
                        onClick={() => {
                          handleClickStart("front");
                        }}
                      >
                        Start Camera
                      </Button>
                    </div>
                  </Box>
                </Collapse>
              </List>
            </CardContent>
          </Card>
          <Card sx={{}}>
            <CardContent sx={{ p: "0px !important" }}>
              <List>
                <ListItemButton onClick={() => handleClickCollapse("back")}>
                  <ListItemText className="back-image-section" primary="Back Image" />
                  {openBack ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={openBack} timeout="auto" unmountOnExit>
                  <Box sx={{ p: 2 }}>
                    <Typography
                      variant="body2"
                      gutterBottom
                      component="div"
                      color="#000"
                      align="left"
                    >
                      {props.frontCapture
                        ? `To Update the back of your driver's license, please click again:`
                        : `Please take a picture of the back of your driver's
                      license:`}
                    </Typography>
                    <Divider />
                    {props.backCapture && (
                      <CardMedia
                        component="img"
                        height="300"
                        image={props.backCapture?.result}
                        alt="DL back"
                      />
                    )}
                    <div style={{ textAlign: "right" }}>
                      <Button
                        variant="contained"
                        size="small"
                        sx={{ mt: "12px", textTransform: "capitalize" }}
                        onClick={() => {
                          handleClickStart("back");
                        }}
                      >
                        Start Camera
                      </Button>
                    </div>
                  </Box>
                </Collapse>
              </List>
            </CardContent>
          </Card>
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: "0px !important" }}>
              <List>
                <ListItemButton onClick={() => handleClickCollapse("selfie")}>
                  <ListItemText className="selfie-image-section" primary="Selfie" />
                  {openSelfie ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={openSelfie} timeout="auto" unmountOnExit>
                  <Box sx={{ p: 2 }}>
                    <Typography
                      variant="body2"
                      gutterBottom
                      component="div"
                      color="#000"
                      align="left"
                    >
                      {props.selfieCapture
                        ? `To Update the selfie, please click again:`
                        : `Please take a selfie:`}
                    </Typography>
                    <Divider />
                    {props.selfieCapture && (
                      <CardMedia
                        component="img"
                        height="300"
                        image={props.selfieCapture?.result}
                        alt=""
                      />
                    )}
                    <div style={{ textAlign: "right" }}>
                      <Button
                        variant="contained"
                        size="small"
                        sx={{ mt: "12px", textTransform: "capitalize" }}
                        onClick={() => {
                          handleClickStart("selfie");
                        }}
                      >
                        Start Camera
                      </Button>
                    </div>
                  </Box>
                </Collapse>
              </List>
            </CardContent>
          </Card>
        </Box>
      )}
    </div>
  );
};

export default ReviewCapture;
