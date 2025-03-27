/* Custom Logger With Instnt Prefix */

/**
 * This is Custom Logger 
 * @param {string} type - Type of log message (debug|error|info|log|warn);
 * @param {string} key - key should be message as first parameter;
 * @param {any} value - value should be second message/object (optional)
 * @returns {void}
 */

export const logMessage = (type: string, key: string , value = '') => {
  switch (type) {
    case 'debug':
      console.debug('Instnt: ', key , value);
      break;
    case 'error':
      console.error('Instnt: ' , key , value);
      break;
    case 'info':
      console.info('Instnt: ' , key , value);
      break;
    case 'log':
      console.log('Instnt: ' , key , value);
      break;    
    case 'warn':
      console.warn('Instnt: ' , key , value);
      break;
    default:
      console.log('Instnt: ' , key , value);
  }
};