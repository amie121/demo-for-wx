// pages/movies/movie-detail/movie-detail.js
var app = getApp();
import { Movie } from 'class/Movie.js'

Page({
  data: {
    movie: {}
  },
  onLoad: function (options) {
    var movieId = options.id;
    var url = app.globalData.doubanBase + "/v2/movie/subject/" + movieId;
    var movie = new Movie(url);
    // var that = this;
    movie.getMovieData((movie) => {
      this.setData({
        movie: movie
      })
    })
  },


  onPreviewImg: function (event) {
    var src = event.currentTarget.dataset.src;
    wx.previewImage({
      current: src, // 当前显示图片的链接，不填则默认为 urls 的第一张
      urls: [src]
    })
  }
})