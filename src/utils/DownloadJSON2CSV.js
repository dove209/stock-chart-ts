const DownloadJSON2CSV = (objArray) => {
    let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    let str = '기업명,발행건수,총자금,시설자금,영업양수자금,운영자금,채무상환자금,타법인증권취득자금,기타자금\r\n';
    let fileName = "CB_Corp_List";

    for (var i = 0; i < array.length; i++) {
        var line = '';
        // Here is an example where you would wrap the values in double quotes
        for (var index in array[i]) {
            line += '"' + array[i][index] + '",';
        }
        line.slice(0, line.length - 1);
        str += line + '\r\n';
    }
    //var uri =  "data:text/csv;charset=utf-8,\uFEFF'" + encodeURI(str);
    let blob = new Blob(["\uFEFF" + str], { type: "text/csv;charset=utf-8;" });
    let uri = URL.createObjectURL(blob);
    let link = document.createElement("a");
    link.href = uri;

    //set the visibility hidden so it will not effect on your web-layout
    link.setAttribute('style', 'visibility:hidden')
    link.download = fileName + ".csv";

    //this part will append the anchor tag and remove it after automatic click
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

export default DownloadJSON2CSV;