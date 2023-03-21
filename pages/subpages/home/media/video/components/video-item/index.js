import { storeBindingsBehavior } from "mobx-miniprogram-bindings";
import { store } from "../../../../../../../store/index";
import { checkLogin } from "../../../../../../../utils/index";
import VideoService from "../../utils/videoService";

const videoService = new VideoService();

Component({
  options: {
    addGlobalClass: true,
  },

  behaviors: [storeBindingsBehavior],

  storeBindings: {
    store,
    fields: ["userInfo"],
  },

  properties: {
    item: Object,
    index: Number,
    curIdx: Number,
  },

  data: {
    mode: "cover",
    videoStop: false,
    praiseHeartArr: [],
  },

  observers: {
    "index, curIdx": function (index, curIdx) {
      if (index === curIdx) {
        setTimeout(() => {
          this.player = wx.createVideoContext("video-player", this);
          this.player.play();
        }, 200);
      } else if (this.player) {
        this.player.pause();
      }
    },
  },

  methods: {
    setMode(e) {
      if (e.detail.height < 960) this.setData({ mode: "contain" });
    },

    followAuthor() {
      checkLogin(() => {
        const { id } = this.properties.item.authorInfo;
        videoService.followAuthor(id, () => {
          this.setData({
            [`item.isFollow`]: true,
          });
        });
      });
    },

    dbTap(e) {
      const { timeStamp, detail } = e;
      if (!this.timeArr) this.timeArr = [];
      this.timeArr.push(timeStamp);
      if (this.timeArr.length > 2) this.timeArr.shift();
      if (
        this.timeArr.length === 2 &&
        this.timeArr[1] - this.timeArr[0] < 300
      ) {
        const { x, y } = detail;
        const deg = Math.floor(Math.random() * 60) - 30;
        const praiseHeartItem = {
          style: `top: ${y - 40}px; left: ${
            x - 40
          }px; transform: rotate(${deg}deg); animation: float 0.6s linear;`,
          url: "https://img.ubo.vip/mp/praise-heart.png",
        };
        const { item, praiseHeartArr } = this.data;
        this.setData({
          [`praiseHeartArr[${praiseHeartArr.length}]`]: praiseHeartItem,
        });

        checkLogin(() => {
          item.isLike ? wx.vibrateShort({ type: "heavy" }) : this.like();
        }, false);

        if (this.clearPraiseHeartArrTimeout)
          clearTimeout(this.clearPraiseHeartArrTimeout);
        this.clearPraiseHeartArrTimeout = setTimeout(() => {
          this.setData({ praiseHeartArr: [] });
        }, 2000);
        if (this.toggleVideoStatusTimeout) {
          clearTimeout(this.toggleVideoStatusTimeout);
          this.toggleVideoStatusTimeout = null;
        }
      } else {
        if (this.toggleVideoStatusTimeout) {
          clearTimeout(this.toggleVideoStatusTimeout);
          this.toggleVideoStatusTimeout = null;
        }
        this.toggleVideoStatusTimeout = setTimeout(() => {
          this.toggleVideoStatus();
        }, 300);
      }
    },

    toggleVideoStatus() {
      if (this.data.videoStop) {
        this.player.play();
        this.setData({ videoStop: false });
      } else {
        this.player.pause();
        this.setData({ videoStop: true });
      }
    },

    navToUserCenter() {
      const { id } = this.properties.item.authorInfo;
      if (store.userInfo.id !== id) {
        wx.navigateTo({
          url: `/pages/subpages/index/short-video/subpages/personal-center/index?id=${user_id}`,
        });
      }
    },

    like() {
      checkLogin(() => {
        let { id, isLike, likeNumber } = this.properties.item;
        videoService.toggleLikeStatus(id, () => {
          this.setData({
            [`item.isLike`]: !isLike,
            [`item.likeNumber`]: isLike ? --likeNumber : ++likeNumber,
          });
        });
      });
    },

    collect() {
      checkLogin(() => {
        let { id, isCollected, collectionTimes } = this.properties.item;
        videoService.toggleCollectStatus(id, () => {
          this.setData({
            [`item.isCollected`]: !isCollected,
            [`item.collectionTimes`]: isCollected ? --collectionTimes : ++collectionTimes,
          });
        });
      });
    },

    comment() {
      checkLogin(() => {
        this.triggerEvent("comment");
      });
    },

    more() {
      this.triggerEvent("more");
    },
  },
});
