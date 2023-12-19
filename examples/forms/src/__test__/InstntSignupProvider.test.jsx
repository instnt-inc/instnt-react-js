import expect from 'expect'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { InstntSignupProvider } from '@instnt/instnt-react-js'
import { DOCUMENT_CAPTURE_FRAMEWORKLOADED, FORM_KEY, ID_METRIC_VERSION, SERVICE_URL, TRANSACTION_PROCESSED, TRANSACTION_INITIATED_EVENT, OTP_SENT_EVENT, TRANSACTION_ERROR } from '../Constant'

describe('Testing Instnt Signup Provider Component', ()=>{

  let event_type = ''
  let transaction_decision = ''
  
  const onEventCallBack = (event) =>{
    console.log('I am getting called', event)
    event_type = event?.type;
    if(event_type === TRANSACTION_PROCESSED){
      transaction_decision = event.data.decision
    }
  }

  const props = {
    formKey : FORM_KEY,
    serviceURL : SERVICE_URL,
    onEvent : onEventCallBack,
    idmetrics_version : ID_METRIC_VERSION
  }
  
  const children = () => <></>
  
  render(<InstntSignupProvider {...props} >{children}</InstntSignupProvider>)


  describe('Pre_Module loading before begin transaction', ()=>{
     
    it('should ensure Document_capture_Framework_loaded_successfully', async ()=>{
      await browser.waitUntil(()=>{
        if(event_type === DOCUMENT_CAPTURE_FRAMEWORKLOADED){
          return true
        }
        return false
      },{timeout:100000})
      //browser.debug()
      console.log('!!!!!window instnt Document_capture_Framework_loaded_successfully!!!!!! ')
     })
     
    it('should ensure IDMetricsCaptureFramework_loaded_successfully', async ()=>{
      await browser.waitUntil(()=>{
        if(event_type === DOCUMENT_CAPTURE_FRAMEWORKLOADED){
          return true
        }
        return false
      },{timeout:100000})
      const getLoadedSDKVersion = await browser.execute(function(){ // Either we should go with this or we can get that checked by getting data from eventHandler 
         //return window.capture.GetSDKVersion(function(a){return a}); use below nested callback function to get SDK version
         return window.WebSDKUI.getSDKVersion();
      })
      console.log("!!!!!IDMetricsCaptureFramework v" + getLoadedSDKVersion + " loaded successfully!!!!!")
      expect(getLoadedSDKVersion).not.toBeNull();
    })
 
    it('should ensure FingerprintJS initialized properly', async ()=>{
       await browser.waitUntil(()=>{
         if(Object.keys(FingerprintJS)){
           return true
         }
         return false
       },{timeout:100000})
       const fingerprintjsBrowserToken = await browser.execute(function(){
         return window.fingerprintjsBrowserToken;
       })
       const fpAgent = await FingerprintJS.load({token: fingerprintjsBrowserToken,endpoint: 'https://fp.instnt.org'})
       console.log('!!!!!fpAgent!!!!!',fpAgent)
       expect(fpAgent.get).toBeDefined()
       console.log('!!!!!FingerprintJS initialized!!!!!')
       console.log('!!!!!FingerprintJS initialized with fingerprintjsBrowserToken!!!!!', fingerprintjsBrowserToken)
    })

    it('should ensure Behaviosec initialized properly', async ()=>{
      const behaviosecweb = await browser.execute(function(){
        return window.bw;
      })
      expect(behaviosecweb.getData).toBeDefined()
      expect(behaviosecweb.startMonitor).toBeDefined()
      expect(behaviosecweb.stopMonitor).toBeDefined()
      const behaviosecData = await browser.execute(function(){
        return window.bw.getData();
      })
      console.log('!!!!!Behaviosec Data ' + behaviosecData + '!!!!!');    
      console.log('!!!!!Behaviosec initialized!!!!!');
    })

    it('should generate token after proper initialization of FingerprintJS and Behaviosec', async ()=>{
      const getToken = await browser.execute(function(){
        return window.instnt.getToken()
      })
      expect(getToken).not.toBeNull()
      console.log('!!!!!Instnt generated token ' + getToken + '!!!!!')
    })

  })

  describe('TRANSACTION_INITIATED_EVENT after begin transaction', ()=>{
    
    it('should contain FORM_KEY after TRANSACTION_INITIATED', async ()=>{
      await browser.waitUntil(()=>{
        if(event_type === TRANSACTION_INITIATED_EVENT){
          return true
        }
        return false
      },{timeout:100000})
      
      const formKey = await browser.execute(function(){ // Either we should go with this or we can get that checked by getting data from eventHandler 
          return window.instnt.formKey;
        })
      console.log('!!!!!window instnt formKey!!!!!! ',formKey)
      expect(formKey).toBe(FORM_KEY)
    })

    it('should contain SERVICE_URL after TRANSACTION_INITIATED', async ()=>{
      const serviceURL = await browser.execute(function(){ // Either we should go with this or we can get that checked by getting data from eventHandler 
        return window.serviceURL;
      })
      console.log('!!!!!window instnt serviceURL!!!!!! ',serviceURL)
      expect(serviceURL).toBe(SERVICE_URL)
    })

    it('should contain ID_METRIC_VERSION after TRANSACTION_INITIATED', async ()=>{
      const idmetricsVersion = await browser.execute(function(){ // Either we should go with this or we can get that checked by getting data from eventHandler 
        return window.idmetrics_version;
      })
      console.log('!!!!!window instnt idmetricsVersion!!!!!! ',idmetricsVersion)
      expect(idmetricsVersion).toBe(ID_METRIC_VERSION)
    })

    it('should contain instnttxnid after TRANSACTION_INITIATED',async ()=>{
      const instnttxnid = await browser.execute(function(){
        return window.instnt.instnttxnid;
      })
      console.log('!!!!!window instnt instnttxnid!!!!!! ',instnttxnid)
      expect(instnttxnid).toBeDefined()
    })

    it('should contain otpVerification after TRANSACTION_INITIATED', async ()=>{
      const otpVerification = await browser.execute(function(){
        return window.instnt.otpVerification;
      })
      console.log('!!!!!window instnt otpVerification!!!!!! ',otpVerification)
      expect(otpVerification).toBeDefined()
    })
    
    it('should contain documentVerification after TRANSACTION_INITIATED', async ()=>{
      const documentVerification = await browser.execute(function(){
        return window.instnt.documentVerification;
      })
      console.log('!!!!!window instnt documentVerification!!!!!! ',documentVerification)
      expect(documentVerification).toBeDefined()
    })

    it('should contain getDeviceType after TRANSACTION_INITIATED', async ()=>{
      const getDeviceType = await browser.execute(function(){
        return window.instnt.getDeviceType(window.navigator.userAgent);
      })
      console.log('!!!!!window instnt getDeviceType!!!!!! ',getDeviceType)
      expect(getDeviceType).toBeDefined()
    })
  
  })

  describe('Instnt Functional Testing After TRANSACTION_INITIATED', ()=>{
      
    it('should call sendOTP', async ()=>{
      const otpVerification = await browser.execute(function(){
        return window.instnt.otpVerification;
      })
      if(otpVerification){
        const otpCallback = await browser.execute(function(){
          return window.instnt.sendOTP('+918750747583');
        })
        await browser.waitUntil(()=>{
          if(event_type === OTP_SENT_EVENT){
            return true
          }
          return false
        },{timeout:100000})
        console.log('!!!!!window instnt OTP sent Successfully!!!!!! ',otpCallback)
        expect(event_type).toBe(OTP_SENT_EVENT)
      }else{
        console.log('!!!!!window instnt otpVerification is disable for workflow!!!!!! ')
      }
    })

    /** Only one we can test at one time if your workflow id enable SSI 
     *  If SSI not enabled in workflow we can test NOTE1 and NOTE2 together
    */

    /** NOTE1: Below you can uncomment two test case if you are try to test incorrect Form data*/

    it('should submit false form_data with submitSignupData', async ()=>{
      await browser.execute(function(){
        return window.instnt.submitSignupData({
          "city": "Brooklyn",
          "country": "United States",
          "email": "darkrazeen@gmail.com",
          "firstName":"Razeen",
          "mobileNumber": "+13472636617",
          "physicalAddress": "1212 newkirk avenue",
          "state": "NY",
          "surName":"Ahmad",
          "zip": "11203"
        });
      })
      await browser.waitUntil(()=>{
        if(event_type === TRANSACTION_ERROR){
          return true
        }
        return false
      },{timeout:100000})
      console.log('!!!!!window instnt TRANSACTION_ERROR Successfully!!!!!! ')
    })

    it('should return false form_data transaction status after submitSignupData', async ()=>{
      console.log('!!!!!window instnt TRANSACTION_ERROR status '+ transaction_decision + " "+'!!!!!')
    })

    /** NOTE2: Below you can uncomment two test case if you are try to test correct Form data*/
    
    it('should submit correct form_data with submitSignupData', async ()=>{
      await browser.execute(function(){
        return window.instnt.submitSignupData({
          "city": "Brooklyn",
          "country": "United States",
          "email": "darkrazeen@gmail.com",
          "firstName":"Razeen",
          "mobileNumber": "+13472636617",
          "physicalAddress": "1212 newkirk avenue",
          "state": "NY",
          "surName":"Ahmad",
          "zip": "11203",
          "nationalId": '111-11-1111',
          "dob": '2023-08-21'
        });
      })
      await browser.waitUntil(()=>{
        if(event_type === TRANSACTION_PROCESSED){
          return true
        }
        return false
      },{timeout:100000})
      console.log('!!!!!window instnt TRANSACTION_PROCESSED Successfully!!!!!! ')
    })

    it('should return correct form_data transaction status after submitSignupData', async ()=>{
      console.log('!!!!!window instnt TRANSACTION_PROCESSED status '+ transaction_decision + " "+'!!!!!')
    })


  })
 
})