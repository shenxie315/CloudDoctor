const app = getApp()
// pages/doctorHome/doctorHome.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    department:'',
    chat_order_price:40,
    inquiry_order_price:20,
    doctor_openid:"",
    patientid:1,
    doctorid:1,
    doctorName:'钟医生',
    title:'主任医师',
    score:4.9,
    reviews:999,
    expert:'儿科',
    patientNum:1240,
    quiryNum:1024,
    rate:99,
    introduction:"我知道这里是一段介绍",
    address:'地址',
    contactNumber:'1234565432',
    modalBodyBottom:0,
    hideModal:true,
    list:[
      {title:'简介'},
      {title:'评论'}
    ],
    currentItem:0,
    map:{
      longitude:113.324520,
      latitude:23.099994,
      scale:14,
      markers:[{
        id:0,
        latitude:23.099994,
        longitude:113.324520,
        width:50,
        heigt:50
      }]
    },
    classroomList:[
      {imgurl:'../../src/icon/throat.png',
      name:'上海市第十人民医院 心内科'},
      {imgurl:'../../src/icon/throat.png',
      name:'同济大学附属同济医院 心内科'}
    ],
    experienceList:[
      {
        title:'长年承担同济大学本科教学工作',
        content:''
      }
    
    ],
    educationList:[
      {
        school:'医学院',
        imgUrl:'../../src/icon/PekingUniversity.png',
        college:'Peking University School of Medicine',
        date:'1985'
      },
      // {
      //   school:'医学院',
      //   imgUrl:'../../src/icon/PekingUniversity.png',
      //   college:'Peking University School of Medicine',
      //   date:'1985'
      // },
      // {
      //   school:'医学院',
      //   imgUrl:'../../src/icon/PekingUniversity.png',
      //   college:'Peking University School of Medicine',
      //   date:'1985'
      // },
    ],
    commentList:[],
    isCollect:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const eventChannel = this.getOpenerEventChannel()
    var that = this
    // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    eventChannel.on('sendData', data => {
      that.setData({
        doctorid: data   
      });
      console.log(that.data.doctorid, ' from doctorList');
      this.getDoctorDetailById(that.data.doctorid)
      this.getCommentByDoctorId(that.data.doctorid)
      this.checkLike()
    })

    
    this.data.patientid=app.globalData.id
    // var query = wx.createSelectorQuery();
    // query.select('#modalBody').boundingClientRect(function (rect) {
    //   let ratio = 750 / rect.width;
    //   that.setData({
    //    modalBodyBottom:-(rect.height*ratio-30)+'rpx',
    //   })
    // }).exec();
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  /**
   * tabbar点击事件
   */
  tabBarSelected:function(e){
    let index=e.currentTarget.dataset.key;
    console.log(index)
    this.setData({
      currentItem:index
    })
  },
  
  /*
  *显示预约Modal
  */
 showAndHideModal:function(){
   var height=wx.getSystemInfoSync().windowHeight
   var that=this;
  if(that.data.hideModal==true){
    that.setData({hideModal:false})
    that.animate('#modalBody',[
      {bottom:-(height*0.93),ease: 'ease'},
      {bottom:0,ease: 'ease'}
    ],2500)
  }else{
    that.setData({hideModal:true})
    that.animate('#modalBody',[
      {bottom:0,ease: 'ease'},
      {bottom:-(height*0.93),ease: 'ease'}
    ],2500)
  } 
 },

  /**
   * 响应图文问诊按钮点击事件
  */
  onClickInquiry: function (event) {
   var inquiry_info={
     id_doctor:this.data.doctorid,
     id_patient:this.data.patientid,
     doctor_name:this.data.doctorName,
     price:this.data.inquiry_order_price,
     department:this.data.department,
     score:this.data.score,
     doctor_openid:this.doctor_openid,
   }
    wx.navigateTo({
      url: '/pages/inquiry/inquiry',
      success: function (res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('sendData', inquiry_info)
      }
    })
  },

 /**
  *通过id获取医生详细信息
  */
  getDoctorDetailById: function (doctorid) {
    var that = this;
    //请求医生信息
    wx.request({
      url: 'http://119.45.143.38:80/api/doctor/getDoctorByID',
      data: {
        id: doctorid,
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: 'POST',
      success(res) {
        console.log(res.data.data[0])
        let resp = res.data.data[0]
        //todo:异常处理
        that.setData(
          {
            doctorName: resp.doctor_name,
            title: resp.title,
            score: resp.score,
            reviews: resp.reviews,
            expert: resp.expert,
            patientNum: resp.patient_num,
            quiryNum: resp.quiry_num,
            rate: resp.rate,
            introduction: resp.introduction,
            address: resp.address,
            contactNumber: resp.contact_number,
            department:resp.department,
            doctor_openid:resp.openid
          }
        )
      }
    })
  },
  /**
 *通过id获取医生评论
 */
  getCommentByDoctorId: function (doctorid) {
    var that = this;
    //请求医生信息
    wx.request({
      url: 'http://119.45.143.38:80/api/comment/getCommentByDoctorId',
      data: {
        id_doctor: doctorid,
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: 'POST',
      success(res) {
        console.log(res.data.data[0])
        let resp = res.data.data
        //todo:异常处理
        that.setData(
          {
            commentList:resp
          }
        )
      }
    })
  },
  /**
  *响应在线咨询按钮点击事件
 */
  redirectToChatRooms: function (event) {
    var that = this;
    //请求医生信息
    wx.request({
      //url: 'http://localhost:8000/api/chat/getChatByPatientId',
      url: 'http://119.45.143.38:80/api/collect/getCollectByUid',
      data: {
        //id: app.globalData.id
        id:7
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: 'POST',
      success(res) {
        console.log(res.data.data[0])
        let resp = res.data.data
        //todo:异常处理
        // that.setData(
        //   {
        //   }
        // )
        if(resp.length==0)
        {
          wx.showToast({
            icon: 'none',
            title: '您还未挂号，请先预约！',
          })
        }
        else{
          wx.navigateTo({
            url: '/pages/chat/chat',
            success: function (res) {
              // 通过eventChannel向被打开页面传送数据
              //res.eventChannel.emit('sendData', doctorid)
            }
          })
        }
      }
    })
  },
  /**
  *响应预约挂号按钮点击事件
 */
  redirectToSchedule: function (event) {
    var chat_info={
      id_patient:this.data.patientid,
      id_doctor:this.data.doctorid,
      patient_openid:app.globalData.openid,
      doctor_openid:this.data.doctor_openid,
      price:this.data.chat_order_price,
      // price:20,
      doctor_name:this.data.doctorName
    }
    console.log("doctor_home")
    console.log(this.data.doctor_openid)
    wx.navigateTo({
      url: '/pages/schedule/schedule',
      success: function (res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('sendData', chat_info)
      }
    })
  },
  /**
  *响应问诊价格按钮点击事件
 */
  showPrice(){
    wx.showToast({
      icon: 'none',
      title: '图文问诊：20元/15次；在线咨询：40元/时',
    })
  },
  /**
  *收藏医生
 */
 onClickLike(){
  wx.showToast({
    icon: 'none',
    title: '收藏成功',
  })
  this.setData({
    isCollect:1
  })
      //收藏
      wx.request({
        url: 'http://119.45.143.38:80/api/collect/addCollect',
        data: {
          // uid:app.globalData.id,
          uid:1,
          doctor_id:this.data.doctorid,
          doctor_name:this.data.doctorName,
          department:this.data.department,
          score:this.data.score
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        method: 'POST',
        success(res) {
          console.log(res.data)
        }
      })
},
/**
  *取消收藏医生
 */
 onClickDislike(){
  wx.showToast({
    icon: 'none',
    title: '取消收藏成功',
  })
  this.setData({
    isCollect:0
  })
   //取消收藏
   wx.request({
    url: 'http://119.45.143.38:80/api/collect/deleteCollect',
    data: {
      // uid:app.globalData.id,
      uid:1,
      doctor_id:this.data.doctorid,
    },
    header: {
      'content-type': 'application/json' // 默认值
    },
    method: 'POST',
    success(res) {
      console.log(res.data)
    }
  })
},
/**
  *是否收藏
 */
checkLike(){
  //查询收藏
  var that=this
  wx.request({
    url: 'http://119.45.143.38:80/api/collect/getCollectByUid',
    data: {
      // uid:app.globalData.id,
      uid:1,
      doctor_id:this.data.doctorid,
    },
    header: {
      'content-type': 'application/json' // 默认值
    },
    method: 'POST',
    success(res) {
      console.log(res.data.data)
      if(res.data.data.length!=0){
        that.setData({
          isCollect:1
        })
      }
    }
  })
}
})