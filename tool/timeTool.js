export function convertTimeStampToDate(timestamp) {
  // var dateTime = new Date(timestamp);
  // return dateTime.toLocaleDateString() + " " + dateTime.toLocaleTimeString();

  var d = new Date(timestamp * 1000), // Convert the passed timestamp to milliseconds
    yyyy = d.getFullYear(),
    mm = ("0" + (d.getMonth() + 1)).slice(-2), // Months are zero based. Add leading 0.
    dd = ("0" + d.getDate()).slice(-2), // Add leading 0.
    hh = d.getHours(),
    h = hh,
    min = ("0" + d.getMinutes()).slice(-2), // Add leading 0.
    ampm = "AM",
    time;
  if (hh > 12) {
    h = hh - 12;
    ampm = "PM";
  } else if (hh === 12) {
    h = 12;
    ampm = "PM";
  } else if (hh == 0) {
    h = 12;
  }
  // ie: 2013-02-18, 8:35 AM
  time = yyyy + "-" + mm + "-" + dd + " " + h + ":" + min + " ";
  return time;
}


//根据时间戳获取时间 yyyy-MM-dd
export const formatDateString = (timestamp) => {
  const date = new Date(parseInt(timestamp) * 1000);
  const year = date.getFullYear();
  const month = ("0" + (parseInt(date.getMonth()) + 1)).slice(-2);
  const day = ("0" + date.getDate()).slice(-2); // Add leading 0.
 // const add = add0(day)
  return `${year}-${month}-${day}`;
};

//根据时间戳获取时间 yyyy-MM-dd hh:mm:ss
export const formatTimeString = (timestamp) => {
  
  const date = new Date(parseInt(timestamp) * 1000);
  const year = date.getFullYear();
  const month = ("0" + (parseInt(date.getMonth()) + 1)).slice(-2);
  const day = ("0" + date.getDate()).slice(-2); // Add leading 0.
  const h = ("0" + date.getHours()).slice(-2); 
  const mm = ("0" + date.getMinutes()).slice(-2); 
  const s = ("0" + date.getSeconds()).slice(-2);  
  return `${year}-${month}-${day} ${h}:${mm}:${s}`;
};


//获取当前的日期时间 格式“yyyy-MM-dd”
export const getNowFormatDate = () => {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
    return currentdate;
}
  // 获取某个时间格式的时间戳
export const getTimeIntervalSince1970 = (stringTime) => {
  //var stringTime = "2014-07-10 10:21:12";
  var timestamp2 = Date.parse(new Date(stringTime));
  timestamp2 = timestamp2 / 1000;
  return timestamp2;
};

export const getLessValue = (timestamp) => {
  let date = new Date(parseInt(timestamp) * 1000);
  let nowDate = new Date();
  var lessDate = date.getTime() - nowDate.getTime(); //时间差的毫秒数

  //计算出相差天数
  var days = Math.floor(lessDate/(24 * 3600 * 1000));
  return days + 1
}