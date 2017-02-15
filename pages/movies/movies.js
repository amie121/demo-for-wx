var util = require('../../utils/util.js');
var app = getApp();
Page({
  data: {
    inTheaters: {},
    comingSoon: {},
    top250: {},
    containerShow: true,
    searchPanelShow: false,
    searchResult: {}
  },
  onLoad: function (options) {

    var inTheatersUrl = app.globalData.doubanBase + "/v2/movie/in_theaters" + "?start=0&count=3";
    var comingSoonUrl = app.globalData.doubanBase + "/v2/movie/coming_soon" + "?start=0&count=3";
    var top250Url = app.globalData.doubanBase + "/v2/movie/top250" + "?start=0&count=3";

    this.getMovieListData(inTheatersUrl, "inTheaters", "正在热映");
    this.getMovieListData(comingSoonUrl, "comingSoon", "即将上映");
    this.getMovieListData(top250Url, "top250", "豆瓣Top250");

  },

//点击更多
  onMoreTap: function (event) {
    var category = event.currentTarget.dataset.category;
    wx.navigateTo({
      url: 'more-movie/more-movie?category=' + category
    })
  },

//点击电影进入详情页
  onMovieTap: function (event) {
    var movieId = event.currentTarget.dataset.movieid;
    wx.navigateTo({
      url: 'movie-detail/movie-detail?id=' + movieId
    })
  },

//获取豆瓣数据
  getMovieListData: function (url, settedKey, categoryTitle) {
    var that = this;
    util.http(url, function cb(res) {
      that.processDoubanData(res, settedKey, categoryTitle)
    })

  },

//搜索框点击取消图标
  onCancelImgTap: function (event) {
    this.setData({
      containerShow: true,
      searchPanelShow: false,
      searchResult: {}
    })
  },

//搜索框获得焦点事件
  onBindFocus: function (event) {
    this.setData({
      containerShow: false,
      searchPanelShow: true
    })
  },

//搜索框点击回车事件
  onBindConfirm: function (event) {
    var text = event.detail.value;
    console.log(text);
    var searchUrl = app.globalData.doubanBase + "/v2/movie/search?q=" + text;
    this.getMovieListData(searchUrl, "searchResult", "")
  },

//处理豆瓣数据
  processDoubanData: function (moviesDouban, settedKey, categoryTitle) {
    var movies = [];
    for (var idx in moviesDouban.subjects) {
      var subject = moviesDouban.subjects[idx];
      var title = subject.title;
      if (title.length >= 6) {
        title = title.substring(0, 6) + "...";
      }
      var temp = {
        stars: util.convertToStarsArray(subject.rating.stars),
        title: title,
        average: subject.rating.average,
        coverageUrl: subject.images.large,
        movieId: subject.id
      }
      movies.push(temp)
    }
    var readyData = {};
    readyData[settedKey] = {
      categoryTitle: categoryTitle,
      movies: movies
    };
    this.setData(readyData);
  }
})