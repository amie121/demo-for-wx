var post_data = require('../../data/post-data.js');

Page({
  data:{
  },
  onLoad:function(options){
    // 生命周期函数--监听页面加载

    this.setData({post_key: post_data.postList});
  },

  onPostTap:function(event) {
      var postId = event.currentTarget.dataset.postid;  //事件.当前点击对象.对象上的自定义数据集集.数据集中的一个属性
                                                        //自定义属性全部改为小写，连字符改为驼峰写法

      wx.navigateTo({
        url: 'post-detail/post-detail?id=' + postId
      })
  },

  swiperTap: function(event) {
    var postId = event.target.dataset.postid;
    //target指的是当前点击的组件,currentTarget指的是事件捕获的组件
    //target当前是指image，而currentTarget指的是swiper
     wx.navigateTo({
        url: 'post-detail/post-detail?id=' + postId
      })
  }
 
})