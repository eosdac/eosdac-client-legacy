export function isEosName(accountname) {
  const re = /^[a-z1-5.]{1,12}$/;
  return re.test(accountname);
}
