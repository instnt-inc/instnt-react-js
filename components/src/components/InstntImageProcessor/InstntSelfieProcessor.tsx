import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

const InstntSelfieProcessor = ({
    selfieSettings = {},
    autoUpload = true,
    captureFrameworkDebug = undefined,
}: any) => {
    //onMount
    useEffect(() => {
        if ((window as any).instnt) {
            const instnt = (window as any).instnt;

            if (!instnt.captureSelfie) {
                console.error('instnt is not initialized, please make sure to instantiate instnt global object by using the <InstntSignupProvider> component');
            } else {
                console.log("InstntSelfieProcessor mounted");
                console.log('/*-----InstntSelfieProcessor Props-----*/');
                console.log('selfieSettings',selfieSettings);
                console.log('auto upload', autoUpload);
                console.log('captureFrameworkDebug',captureFrameworkDebug);
                console.log('/*-----InstntSelfieProcessor Props-----*/');
                instnt.captureSelfie(selfieSettings, autoUpload, captureFrameworkDebug);
            }
        }
    }, [(window as any).instnt]);

    return (
        <React.Fragment />
    );
}

InstntSelfieProcessor.propTypes ={
    selfieSettings: PropTypes.object.isRequired,
    autoUpload: PropTypes.bool,
    captureFrameworkDebug: PropTypes.any
};

export default InstntSelfieProcessor;