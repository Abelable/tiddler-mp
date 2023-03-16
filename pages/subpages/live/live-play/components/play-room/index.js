import { storeBindingsBehavior } from "mobx-miniprogram-bindings";
import { store } from "../../../../../../store/index";
import { checkLogin } from "../../../../../../utils/index";
import tim from "../../../../../../utils/tim/index";
import LiveService from "../../../utils/liveService";

const liveService = new LiveService();
const { statusBarHeight } = getApp().globalData.systemInfo;

Component({
  options: {
    addGlobalClass: true,
  },

  behaviors: [storeBindingsBehavior],

  storeBindings: {
    store,
    fields: [
      "userInfo",
      "srcIniting",
      "liveLoading",
      "liveBreak",
      "fullScreen",
      "audienceCount",
      "praiseCount",
    ],
    actions: ["setFullScreen", "exitFullScreen"],
  },

  properties: {
    roomInfo: Object,
  },

  data: {
    statusBarHeight,
    isFollow: false,
    goodsList: [],
    manualPraise: false, // 是否是手动点赞
    audienceActionTips: "", // 观众行为（进直播间、下单...）
    showAudienceActionTips: false, // 控制观众行为弹幕的显示隐藏
    praiseHeartArr: [], // 双击爱心
    liveEnd: false, // 直播结束
    liveDuration: 0, // 直播总时长
  },

  observers: {
    srcIniting: function (truthy) {
      !truthy && checkLogin(this.init, false);
    },
  },

  lifetimes: {
    attached() {
      this.inited = false;
    },

    detached() {
      store.resetRoomData();
    },
  },

  pageLifetimes: {
    show() {
      !this.inited && checkLogin(this.init, false);
    },
  },

  methods: {
    async init() {
      const { id, groupId } = this.properties.roomInfo;
      const {
        viewersNumber,
        praiseNumber,
        goodsList,
        historyChatMsgList,
        isFollow,
      } = (await liveService.joinRoom(id)) || {};
      store.setAudienceCount(viewersNumber);
      store.setPraiseCount(praiseNumber);
      store.setLiveMsgList([
        ...historyChatMsgList,
        {
          content:
            "平台依法对直播内容进行24小时巡查，倡导绿色直播，维护网络文明健康。切勿与他人私下交易，非官方活动谨慎参与，避免上当受骗。",
        },
      ]);
      this.setData({ goodsList, isFollow });
      getApp().onLiveCustomMsgReceive(this.handleCustomMsg.bind(this));
      tim.joinGroup(groupId);
      this.inited = true;
    },

    joinRoom() {
      const { id, groupId } = this.properties.roomInfo;
      getApp().globalData.im.joinGroup(groupId);
    },

    handleCustomMsg(customMsg) {
      if (customMsg) {
        const {
          audienceCount,
          praiseCount,
          manualPraise,
          showAudienceActionTips,
          liveBreak,
        } = this.data;
        const { url, message } = customMsg;
        const {
          show_message,
          total_time: liveDuration,
          member_num,
          praise_count,
        } = message;

        // 监听用户数量
        if (member_num && member_num > audienceCount)
          store.setAudienceCount(member_num);

        // 监听用户操作
        const audienceActionIndex = audienceActionTipsArr.indexOf(url);
        if (audienceActionIndex !== -1 && !showAudienceActionTips) {
          this.setData({
            audienceActionTips: {
              type: audienceActionTypeArr[audienceActionIndex],
              message: show_message,
            },
            showAudienceActionTips: true,
          });
          setTimeout(() => {
            this.setData({ showAudienceActionTips: false });
          }, 2000);
        }

        // 监听点赞
        if (praise_count && praise_count > praiseCount) {
          manualPraise && this.setData({ manualPraise: false });
          store.setPraiseCount(praise_count);
        }

        // 监听直播重连
        url === "report-openliveroom" && this.setVideoPlayingStatus(true);

        // 监听直播结束
        if (show_message === "房间已被关闭") {
          this.setData({ liveDuration, liveEnd: true });
          liveBreak && this.setData({ liveBreak: false });
        }
      }
    },

    dbTap(e) {
      checkLogin(() => {
        const { timeStamp, detail } = e;
        if (this.lastTimeStamp) {
          if (timeStamp - this.lastTimeStamp < 300) {
            const { x, y } = detail;
            const deg = Math.floor(Math.random() * 60) - 30;
            const praiseHeartItem = {
              style: `top: ${y - 40}px; left: ${
                x - 40
              }px; transform: rotate(${deg}deg); animation: float 0.6s linear;`,
              url: "https://img.ubo.vip/mp/praise-heart.png",
            };
            this.setData({
              [`praiseHeartArr[${this.data.praiseHeartArr.length}]`]:
                praiseHeartItem,
            });
            this.praise();
            if (this.clearPraiseHeartArrTimeout)
              clearTimeout(this.clearPraiseHeartArrTimeout);
            this.clearPraiseHeartArrTimeout = setTimeout(() => {
              this.setData({ praiseHeartArr: [] });
            }, 2000);
          }
          this.lastTimeStamp = 0;
        } else {
          this.lastTimeStamp = timeStamp;
        }
      }, false);
    },

    praise() {
      wx.vibrateShort({ type: "heavy" });
      if (!this.data.manualPraise) this.setData({ manualPraise: true });

      let praiseCount = store.praiseCount;
      store.setPraiseCount(++praiseCount);
      if (!this.praiseCount) this.praiseCount = 0;
      ++this.praiseCount;
      if (!this.savePraiseInterval) {
        this.savePraiseInterval = setInterval(() => {
          if (this.praiseCount) {
            liveService.savePraiseCount(
              this.properties.roomInfo.id,
              this.praiseCount
            );
            this.praiseCount = 0;
          } else {
            clearInterval(this.savePraiseInterval);
            this.savePraiseInterval = null;
          }
        }, 5000);
      }
    },

    showGoodsModal() {
      this.showModal("goods");
    },

    showInputModal() {
      checkLogin(() => {
        this.showModal("input");
      });
    },

    showShareModal() {
      this.showModal("share");
    },
  },
});
