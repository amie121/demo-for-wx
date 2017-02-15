function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function convertToStarsArray(stars) {
  var num = stars.toString().substring(0, 1);
  var array = [];
  for (var i = 1; i <= 5; i++) {
    if (i <= num) {
      array.push(1);
    } else {
      array.push(0);
    }
  }
  return array;
}


 function douban_limit() {
    var timestamp = Date.parse(new Date());
    var requestDoubanTime = wx.getStorageSync('requestDoubanTime');
    var requestDoubanNum = wx.getStorageSync('requestDoubanNum');
    if (requestDoubanTime && timestamp - requestDoubanTime < 60000) {
        wx.setStorageSync('requestDoubanNum', requestDoubanNum += 1);
        if (requestDoubanNum < 35) {
            //Lower than 35/m,pass            
            return;
        }
        else {
            wx.showToast({
                title: '豆瓣api请求频率超35/m，小心',
                icon: 'loading',
                duration: 5000
            })
        }
    }
    else {
        wx.setStorageSync('requestDoubanTime', timestamp);
        wx.setStorageSync('requestDoubanNum', 1);
    }
}

function http(url, cb) {
  douban_limit();
  wx.request({
    url: url,
    data: {},
    method: 'GET',
    header: {
      'content-type': 'json'
    },
    success: function (res) {
      cb(res.data);
      console.log(res);
    },
    fail: function (error) {
      console.log(error)
    }
  })
}

function convertToCastString(casts) {
  var castsjoin = "";
  for(var idx in casts) {
    castsjoin = castsjoin + casts[idx].name + " / ";
  }
  return castsjoin.substring(0, castsjoin.length - 2);
}

function convertToCastInfos(casts) {
  var castsArray = [];
  for(var idx in casts) {
    var cast = {
      img: casts[idx].avatars ? casts[idx].avatars.large : "",
      name: casts[idx].name 
    }
    castsArray.push(cast);
  }
  return castsArray;
}

module.exports = {
  formatTime: formatTime,
  convertToStarsArray: convertToStarsArray,
  http: http,
  convertToCastString: convertToCastString,
  convertToCastInfos: convertToCastInfos
}
