//OpenDart [공시정보]-[고유번호]에서 다운로드한 xml파일 JSON으로 변환 후 작업
const fs = require('fs');

const dataFetch = () => {
    const jsonFile = fs.readFileSync('./convertjson.json', 'utf-8');
    const {result: data} = JSON.parse(jsonFile);


    const result = data.list.filter((item) => item.stock_code !== ''); //비상장사 제거
    result.forEach((item) => delete item.modify_date);                 //수정일 필드 제거

    const obj = {
        list : result
    }
    let json = JSON.stringify(obj);

    fs.writeFileSync('corp_code.json', json, err => {
        if(err) {
            throw err;
        }
        console.log('JSON data is saved');
    })
}

dataFetch();