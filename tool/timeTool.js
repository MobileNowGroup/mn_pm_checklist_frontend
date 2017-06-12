export function convertTimeStampToDate(timestamp) {
  var dateTime = new Date(timestamp);
  return dateTime.toLocaleDateString() + " " + dateTime.toLocaleTimeString();
}
