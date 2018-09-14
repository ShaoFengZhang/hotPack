const app = getApp()
import util from '../../utils/util.js';
Page({
    data: {
        motto: 'Hello World',
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        inputvalue: '',
        miniProgram: util.miniProgram,
    },
    onLoad: function() {
        this.canvasbg = '../../assets/canvas.jpg';
        let random = this.RandomNumBoth(1,10);
        console.log(random);
        this.fixedText = `你的尾号2279的账户转账支出人民币12799.00元，活期余额${random}00000.25元[招商银行]`;
    },

    RandomNumBoth: function(Min, Max) {
        var Range = Max - Min;
        var Rand = Math.random();
        var num = Min + Math.round(Rand * Range); //四舍五入
        return num;
    },

    onShareAppMessage: function(res) {
        return {
            title: `快来和我一起装x吧~`,
            path: `pages/index/index`,
        };
    },


    inputfocus: function() {
        this.setData({
            inputvalue: '',
        })
    },

    getinputvalue: function(e) {
        let inputvalue = e.detail.value.slice(0, 14);
        this.setData({
            inputvalue: inputvalue
        })
    },

    startGame: function() {
        if (this.data.inputvalue == '') {
            wx.showModal({
                title: '提示',
                content: '请输入姓名',
                showCancel: false,
                success: function(res) {}
            })
        } else {
            wx.showLoading({
                title: '拼命计算中',
                mask: true,
            });
            this.contentTxt = this.data.inputvalue + this.fixedText;
            this.drawcanvs();
        }
    },

    drawcanvs: function() {
        let _this = this;
        let ctx = wx.createCanvasContext('canvas');
        console.log(this.canvasbg);
        wx.getImageInfo({
            src: this.canvasbg,
            success: function(res) {
                _this.setData({
                    bgimgH: res.height,
                    bgimgW: res.width,
                    bgimgUrl: res.path,
                });
                ctx.drawImage(_this.canvasbg, 0, 0, res.width, res.height);
                ctx.drawImage('../../assets/qr.jpg', 50, 1060, 150, 150);
                ctx.setFontSize(24);
                ctx.setFillStyle('#000');
                ctx.setTextAlign('left');
                ctx.fillText(_this.contentTxt.slice(0, 32), 40, 150);
                ctx.fillText(_this.contentTxt.slice(32), 40, 186);

                ctx.draw();
                setTimeout(function() {
                    _this.showOffRecord();
                }, 1000)

            },
            fail: function(res) {
                console.log(res)
            }
        })
    },

    showOffRecord: function() {

        wx.canvasToTempFilePath({
            destWidth: this.data.bgimgW * 4,
            destHeight: this.data.bgimgH * 4,
            canvasId: 'canvas',
            success: function(res) {
                wx.hideLoading();
                wx.saveImageToPhotosAlbum({
                    filePath: res.tempFilePath,
                    success: function() {
                        wx.showModal({
                            title: '温馨提示',
                            content: '图片已保存成功,快去分享朋友圈吧!',
                            showCancel: false,
                            success: function(data) {
                                wx.previewImage({
                                    urls: [res.tempFilePath]
                                })
                            }
                        });
                    },
                    fail: function() {
                        wx.hideLoading();
                        wx.previewImage({
                            urls: [res.tempFilePath]
                        })
                    }
                })
            }
        })
    },


})