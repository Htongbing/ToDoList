module.exports = {
  ACCOUNT_RE: /^[a-z][a-z\d]{5,19}$/i,
  PASSWORD_RE: /^(?=[a-z]*\d)(?=\d*[a-z])[a-z\d]{6,20}$/i,
  EMAIL_RE: /^[a-z0-9\!\#\$\%\&\'\*\+\/\=\?\^\_\`\{\|\}\~\-]+(?:\.[a-z0-9\!\#\$\%\&\'\*\+\/\=\?\^\_\`\{\|\}\~\-]+)*@(?:[a-z0-9](?:[a-z0-9\-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9\-]*[a-z0-9])?$/i,
  VERIFICATION_TIME: 60,
  EMAIL_CODE_TIME: 600,
  EMAIL_CODE_EX_TIME: 60
}