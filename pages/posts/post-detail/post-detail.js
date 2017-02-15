var database = require('../../../data/post-data.js');
var app = getApp();

Page({
    data: {
        isPlayingMusic: false
    },
    onLoad: function (option) {
        var postId = option.id;
        this.setData({
            curPostId: postId
        })
        var postData = database.postList[postId];

        this.setData({
            postData: postData
        });
        //获取缓存中的数据
        var postsCollected = wx.getStorageSync('posts_collected');
        if (postsCollected) {
            var postCollected = postsCollected[postId];
            this.setData({
                collected: postCollected
            });
        } else {
            var postsCollected = {

            }
            postsCollected[postId] = false;
            wx.setStorageSync('posts_collected', postsCollected)
        };

        
        this.setAudioMonitor();

        if (app.globalData.g_isPlayingMusic && app.globalData.g_currentMusicId === this.data.curPostId) {
            this.setData({
                isPlayingMusic: true
            })
        }

    },
    setAudioMonitor: function (event) {
        var that = this;
        wx.onBackgroundAudioPlay(function () {
            that.setData({
                isPlayingMusic: true
            });
            app.globalData.g_isPlayingMusic = true;
            app.globalData.g_currentMusicId = that.data.curPostId;
            console.log(app.globalData.g_currentMusicId);
        });
        wx.onBackgroundAudioPause(function () {
            that.setData({
                isPlayingMusic: false
            });
            app.globalData.g_isPlayingMusic = false;
            app.globalData.g_currentMusicId = null;
        });
        wx.onBackgroundAudioStop(function () {
            that.setData({
                isPlayingMusic: false
            });
            app.globalData.g_isPlayingMusic = false;
            app.globalData.g_currentMusicId = null;
        });

    },
    onCollectionTap: function (event) {
        var postsCollected = wx.getStorageSync('posts_collected');
        var postCollected = postsCollected[this.data.curPostId];
        postCollected = !postCollected;
        postsCollected[this.data.curPostId] = postCollected;
        //更新文章是否收藏的缓存
        wx.setStorageSync('posts_collected', postsCollected);
        //更新视图数据绑定
        this.setData({
            collected: postCollected
        });

        wx.showToast({
            title: postCollected ? "收藏成功" : "取消成功",
            icon: "success",
            duration: 1000
        })

    },
    onShareTap: function (event) {
        var itemList = [
            "微信好友",
            "朋友圈",
            "QQ",
            "微博"
        ];
        wx.showActionSheet({
            itemList: itemList,
            success: function (res) {
                wx.showModal({
                    title: "提示",
                    content: "分享至" + itemList[res.tapIndex]
                })
            }

        })
    },
    onMusicTap: function (event) {
        var isPlayingMusic = this.data.isPlayingMusic;
        var postId = this.data.curPostId;
        var postdata = database.postList[postId];
        if (isPlayingMusic) {
            wx.stopBackgroundAudio();
            this.setData({
                isPlayingMusic: false
            });

        } else {
            wx.playBackgroundAudio({
                dataUrl: postdata.music.url,
                title: postdata.music.title,
                coverImgUrl: postdata.music.coverImg
            });
            this.setData({
                isPlayingMusic: true
            });
        }
    }
}) 