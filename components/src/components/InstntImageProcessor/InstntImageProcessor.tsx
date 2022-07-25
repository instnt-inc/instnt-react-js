import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { isMobile } from "react-device-detect";


// interface InstntImageProcessorProps {
//     documentType: String;
//     documentSide: String;
//     captureMode: String;
//     autoUpload: boolean;
//     captureFrameworkDebug: Boolean;
// }
/**NO NEED TO USE INTERFACE AS WE ARE NOT CALLING INSTNTIMAGEPROCESSOR IN ITERATION */

const InstntImageProcessor = ({
    documentType,
    documentSide,
    captureMode = "Auto",
    autoUpload = true,
    captureFrameworkDebug = false,
}: any) => {
    //onMount
    useEffect(() => {
        console.log("InstntImageProcessor mounted");
        console.log("isMobile: " + isMobile);
        (window as any).instnt.initImageProcessor();
        if (isMobile) {
            if (documentSide) {
                (window as any).documentCapture(
                    documentType,
                    documentSide,
                    captureMode,
                    autoUpload,
                    captureFrameworkDebug
                );
            } else {
                (window as any).selfieCapture(
                    captureMode,
                    autoUpload,
                    captureFrameworkDebug
                );
            }
        }
    }, []);

    return (
        <React.Fragment />
    );
}

InstntImageProcessor.propTypes = {
    documentType: PropTypes.string.isRequired,
    documentSide: PropTypes.string,
    captureFrameworkDebug: PropTypes.bool
};
InstntImageProcessor.DOCUMENT_TYPES =  {
    license: "License",
    passportBook: "PassportBook",
    passportCard: "PassportCard"
};

export default InstntImageProcessor;