import React, { useEffect } from 'react';
import PropTypes from 'prop-types';


// interface InstntDocumentProcessorProps {
//     documentSettings: Object;
//     autoUpload: boolean;
//     captureFrameworkDebug: Boolean;
// }
/**NO NEED TO USE INTERFACE AS WE ARE NOT CALLING INSTNTDOCUMENTPROCESSOR IN ITERATION */

const InstntDocumentProcessor = ({
    documentSettings = {},
    autoUpload = true,
    captureFrameworkDebug = false,
}: any) => {
    //onMount
    useEffect(() => {
        if ((window as any).instnt) {
            const instnt = (window as any).instnt;
            if (!instnt.captureDocument) {
                console.error('instnt is not initialized, please make sure to instantiate instnt global object by using the <InstntSignupProvider> component');
            } else {  
                console.log("InstntDocumentProcessor mounted");                  
                instnt.captureDocument(documentSettings, autoUpload, captureFrameworkDebug);
            }
        }
    }, [(window as any).instnt]);

    return (
        <React.Fragment />
    );
}

InstntDocumentProcessor.propTypes = {
    documentSettings: PropTypes.object.isRequired,
    autoUpload: PropTypes.bool,
    captureFrameworkDebug: PropTypes.bool
};
InstntDocumentProcessor.DOCUMENT_TYPES = {
    license: "License",
    passportBook: "PassportBook",
    passportCard: "PassportCard"
};

export default InstntDocumentProcessor;