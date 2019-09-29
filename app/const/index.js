module.exports = {
  ACCOUNT_RE: /^[a-z][a-z\d]{5,19}$/i,
  PASSWORD_RE: /^(?=[a-z]*\d)(?=\d*[a-z])[a-z\d]{6,20}$/i,
  EMAIL_RE: /^[a-z0-9\!\#\$\%\&\'\*\+\/\=\?\^\_\`\{\|\}\~\-]+(?:\.[a-z0-9\!\#\$\%\&\'\*\+\/\=\?\^\_\`\{\|\}\~\-]+)*@(?:[a-z0-9](?:[a-z0-9\-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9\-]*[a-z0-9])?$/i,
  TASK_NAME_RE: /^[\w\u4e00-\u9fa5]{1,20}$/,
  TASK_CONTENT_RE: /^(.|\n){1,200}$/,
  NOTICE_TIME_RE: /^(?!2[4-9]:)[0-2][0-9]:[0-5][0-9]$/,
  VERIFICATION_TIME: 60,
  EMAIL_CODE_TIME: 600,
  EMAIL_CODE_EX_TIME: 60,
  RESET_PASSWORD_URL: 'http://localhost:3000/#/reset-password'
}