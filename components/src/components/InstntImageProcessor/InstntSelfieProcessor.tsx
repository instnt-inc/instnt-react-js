import React, { useEffect } from 'react';
import PropTypes from 'prop-types';


const propTypes = {
    selfieSettings: PropTypes.object.isRequired,
    autoUpload: PropTypes.bool,
    captureFrameworkDebug: PropTypes.bool
};

interface InstntSelfieProcessorProps {
    selfieSettings: Object;
    autoUpload: boolean;
    captureFrameworkDebug: Boolean;
}

const InstntSelfieProcessor = ({
    selfieSettings = {},
    autoUpload = true,
    captureFrameworkDebug = false,
}: InstntSelfieProcessorProps) => {
    //onMount
    useEffect(() => {
        console.log("InstntSelfieProcessor mounted");
        if ((window as any).instnt) {
            const instnt = (window as any).instnt;

            if (!instnt.captureSelfie) {
                console.error('instnt is not initialized, please make sure to instantiate instnt global object by using the <InstntSignupProvider> component');
            } else {
                instnt.captureSelfie(selfieSettings, autoUpload, captureFrameworkDebug);
            }
        } else {
            console.error('instnt is not initialized, please make sure to instantiate instnt global object by using the <InstntSignupProvider> component');
        }
    }, []);

    return (
        <React.Fragment />
    );
}

InstntSelfieProcessor.propTypes = propTypes;

export default InstntSelfieProcessor;