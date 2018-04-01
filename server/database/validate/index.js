/**
 * 判断身份证号码为18位时最后的验证位是否正确
 * @param a_idCard 身份证号码数组
 * @return
 */
function isTrueValidateCodeBy18IdCard(a_idCard) {
  var Wi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1]; // 加权因子;
  var ValideCode = [1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2]; // 身份证验证位值，10代表X;
  var sum = 0; // 声明加权求和变量
  if (a_idCard[17].toLowerCase() == "x") {
    a_idCard[17] = 10; // 将最后位为x的验证码替换为10方便后续操作
  }
  for (var i = 0; i < 17; i++) {
    sum += Wi[i] * a_idCard[i]; // 加权求和
  }
  var valCodePosition = sum % 11; // 得到验证码所位置
  if (a_idCard[17] == ValideCode[valCodePosition]) {
    return true;
  }
  return false;
}

/**
 * 通过身份证判断是否是合法的的长度 18位
 */
function isValidityBrithBy18IdCard(idCard18) {
  var year = idCard18.substring(6, 10);
  var month = idCard18.substring(10, 12);
  var day = idCard18.substring(12, 14);
  var temp_date = new Date(year, parseFloat(month) - 1, parseFloat(day));
  // 这里用getFullYear()获取年份，避免千年虫问题
  if (
    temp_date.getFullYear() != parseFloat(year) ||
    temp_date.getMonth() != parseFloat(month) - 1 ||
    temp_date.getDate() != parseFloat(day)
  ) {
    return false;
  }
  return true;
}
/**
 * 通过身份证判断是否是合法的的长度 15位
 */
function isValidityBrithBy15IdCard(idCard15) {
  var year = idCard15.substring(6, 8);
  var month = idCard15.substring(8, 10);
  var day = idCard15.substring(10, 12);
  var temp_date = new Date(year, parseFloat(month) - 1, parseFloat(day));
  // 对于老身份证中的你年龄则不需考虑千年虫问题而使用getYear()方法
  if (
    temp_date.getYear() != parseFloat(year) ||
    temp_date.getMonth() != parseFloat(month) - 1 ||
    temp_date.getDate() != parseFloat(day)
  ) {
    return false;
  }
  return true;
}

class validate {
  constructor() {}
  phone(v) {
    return /^13[0-9]{9}$|14[0-9]{9}|15[0-9]{9}$|18[0-9]{9}$/.test(v);
  }
  email(v) {
    return /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(v);
  }
  url(v) {
    return /^(\w+:\/\/)?\w+(\.\w+)+.*$/.test(v);
  }
  idcardnumber(v){
    return /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}[0-9Xx]$)/.test(v);
  }
  idcard(v) {
    v = v.trim();
    console.log(v.length);
    if (v.length == 15) {
      if (isValidityBrithBy15IdCard(v)) {
        return true;
      } else {
        return false;
      }
    } else if (v.length == 18) {
      var a_idCard = v.split(""); // 得到身份证数组
      console.log(isTrueValidateCodeBy18IdCard(a_idCard));
      if (
        isValidityBrithBy18IdCard(v) &&
        isTrueValidateCodeBy18IdCard(a_idCard)
      ) {
        return true;
      }
      return false;
    }
    return false;
  }
  postcode(v) {
    return /^[0-9]{6}$/.test(v);
  }
}

export default new validate();
