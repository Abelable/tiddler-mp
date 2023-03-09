import { storeBindingsBehavior } from "mobx-miniprogram-bindings";
import { store } from "../../../../../../../store/index";
import tim from "../../../../../../../utils/tim/index";
import LiveService from "../../../utils/liveService";

const liveService = new LiveService();
const { statusBarHeight } = getApp().globalData;

Component({
  options: {
    addGlobalClass: true,
  },

  behaviors: [storeBindingsBehavior],

  storeBindings: {
    store,
    fields: ["praiseCount", "audienceCount", "devicePosition"],
    actions: ["toggleLampVisible"],
  },

  properties: {
    roomInfo: Object,
  },

  data: {
    statusBarHeight,
    countdownVisible: false,
    start: false,
    stop: false,
    liveEnd: false, // 直播结束
    manualPraise: false, // 是否是手动点赞
    audienceActionTips: "", // 观众行为（进直播间、下单...）
    showAudienceActionTips: false, // 控制观众行为弹幕的显示隐藏
    inputVisible: false,
    shareModalVisible: false,
    posterModalVisible: false,
    moreFeaturesPopupVisible: false,
    beautyPopupVisible: false,
    startRemindPopupVisible: false,
    quitModalVisible: false,
    goodsShelvesPopupVisible: false,
    recommendGood: null,
  },

  observers: {
    roomInfo: function (info) {
      if (info) {
        const { status, viewersNumber, praiseNumber } = info;

        if (status === 1) {
          this.startLive();
          store.setAudienceCount(viewersNumber);
          store.setPraiseCount(praiseNumber);
          // 聊天消息
        }

        store.setDefinitionIndex(resolution - 1);
        // !this.data.recommendGood && this.getRecommendGood();
      }
    },
  },

  lifetimes: {
    attached() {
      getApp().onLiveCustomMsgReceive(this.handleCustomMsg.bind(this));
    },
  },

  methods: {
    startCountdown() {
      this.setData({
        countdownVisible: true,
      });
      setTimeout(() => {
        this.setData({
          countdownVisible: false,
        });
      }, 5000);
    },

    async startLive() {
      const { status, groupId } = this.properties.roomInfo;
      status !== 1 && liveService.startLive();
      tim.joinGroup(groupId);
      this.setData({ start: true });
    },

    reverseCamera() {
      store.setRemoteMirror(store.devicePosition === "front" ? false : true);
      store.setDevicePosition(
        store.devicePosition === "front" ? "back" : "front"
      );
      store.setLocalMirror("auto");
    },

    showInput() {
      this.setData({
        inputVisible: true,
      });
    },

    hideInputModal() {
      if (this.data.inputDefaultValue) {
        this.setData({
          inputDefaultValue: "",
        });
      }
      this.hideModal();
    },

    showStartRemindPopup() {
      this.setData({
        moreFeaturesPopupVisible: false,
        startRemindPopupVisible: true,
      });
    },

    showShareModal() {
      this.setData({
        shareModalVisible: true,
      });
      if (this.data.fullScreen) this.exitFullScreen();
    },

    showPosterModal() {
      this.setData({
        shareModalVisible: false,
        posterModalVisible: true,
      });
    },

    showMoreFeaturesPopup() {
      this.setData({
        moreFeaturesPopupVisible: true,
      });
      if (this.data.fullScreen) this.exitFullScreen();
    },

    showBeautyPopup() {
      this.setData({
        moreFeaturesPopupVisible: false,
        beautyPopupVisible: true,
      });
    },

    showGoodsShelvesPopup() {
      this.setData({
        goodsShelvesPopupVisible: true,
      });
      if (this.data.fullScreen) this.exitFullScreen();
    },

    showTrafficRechargePopup() {
      this.setData({
        trafficRechargePopupVisible: true,
      });
    },

    hideModal() {
      const {
        inputVisible,
        shareModalVisible,
        posterModalVisible,
        moreFeaturesPopupVisible,
        beautyPopupVisible,
        startRemindPopupVisible,
        quitModalVisible,
        goodsShelvesPopupVisible,
      } = this.data;
      if (inputVisible) this.setData({ inputVisible: false });
      if (shareModalVisible) this.setData({ shareModalVisible: false });
      if (posterModalVisible) this.setData({ posterModalVisible: false });
      if (moreFeaturesPopupVisible)
        this.setData({ moreFeaturesPopupVisible: false });
      if (beautyPopupVisible) this.setData({ beautyPopupVisible: false });
      if (startRemindPopupVisible)
        this.setData({ startRemindPopupVisible: false });
      if (quitModalVisible) this.setData({ quitModalVisible: false });
      if (goodsShelvesPopupVisible)
        this.setData({ goodsShelvesPopupVisible: false });
    },

    confirmStopLive() {
      wx.showModal({
        content: "确定结束直播吗？",
        showCancel: true,
        success: (result) => {
          if (result.confirm) {
            this.setData({ stop: true });
            store.resetRoomData();
            store.setAudienceCount(0);
            store.setPraiseCount(0);
            liveService.stopLive();
            wx.switchTab({
              url: "/pages/tab-bar-pages/home/index",
            });
          }
        },
      });
    },

    // 点赞
    praise() {
      wx.vibrateShort({ type: "heavy" });
      if (!this.data.manualPraise) this.setData({ manualPraise: true });
      liveService.praiseHandler(this.properties.roomInfo.id);
    },

    handleCustomMsg(customMsg) {
      if (customMsg) {
        if (customMsg) {
          let {
            manualPraise,
            praiseCount,
            audienceCount,
            showAudienceActionTips,
          } = this.data;

          switch (customMsg.type) {
            case "user_coming":
              if (!showAudienceActionTips) {
                this.setData({
                  audienceActionTips: {
                    type: "coming",
                    message: customMsg.message,
                  },
                  showAudienceActionTips: true,
                });
                setTimeout(() => {
                  this.setData({ showAudienceActionTips: false });
                }, 2000);
              }
              break;

            case "robot_in_group":
              if (!showAudienceActionTips) {
                this.setData({
                  audienceActionTips: {
                    type: "coming",
                    isRobot: 1,
                    message: customMsg.message,
                  },
                  showAudienceActionTips: true,
                });
                setTimeout(() => {
                  this.setData({ showAudienceActionTips: false });
                }, 2000);
              }
              break;

            case "user_comed":
              if (customMsg.zhubo_total_num) {
                store.setAudienceCount(customMsg.zhubo_total_num || 0);
              } else {
                store.setAudienceCount(++audienceCount);
              }
              break;

            case "user_leaving":
              if (customMsg.zhubo_total_num) {
                store.setAudienceCount(customMsg.zhubo_total_num || 0);
              } else {
                --audienceCount;
                store.setAudienceCount(audienceCount < 0 ? 0 : audienceCount);
              }
              break;

            case "live_room_like":
              const newPraiseCount = Number(customMsg.like_num);
              if (newPraiseCount > praiseCount) {
                manualPraise && this.setData({ manualPraise: false });
                store.setPraiseCount(newPraiseCount);
              }
              break;

            case "group_subtitle":
              store.setSubtitleContent(customMsg.subtitle);
              break;

            case "delete_group_msg":
              store.deleteLiveMsg(customMsg.delete);
              break;

            case "animation":
              store.setAnimationIndex(Number(customMsg.index));
              break;

            case "update_tag":
              const userIds = customMsg.user_id.split(",");
              if (userIds.includes(`${store.userInfo.id}`)) {
                liveService.setCurUserTagList(
                  this.properties.roomInfo.studio_id,
                  store.userInfo.id
                );
              }
              break;
          }
        }
      }
    },

    async getRecommendGood() {
      const { list = [] } =
        (await liveService.getYouboRoomGoodsList(
          this.properties.roomInfo.id,
          "3",
          1
        )) || {};
      if (list.length) {
        this.setData({
          recommendGood: list[0],
        });
      }
    },
  },
});
