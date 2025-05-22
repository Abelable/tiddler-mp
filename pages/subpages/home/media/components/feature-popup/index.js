import { VIDEO, NOTE } from "../../../../utils/emuns/mediaType";
import MediaService from "../../../utils/mediaService";

const mediaService = new MediaService();

Component({
  properties: {
    mediaType: Number,
    videoId: Number,
    noteId: Number,
    isPrivate: Number,
  },

  methods: {
    togglePrivate() {
      const { mediaType, videoId, noteId, isPrivate } = this.properties;
      switch (mediaType) {
        case VIDEO:
          mediaService.toggleVideoPrivateStatus(videoId, () => {
            this.setData({ isPrivate: isPrivate ? 0 : 1 });
          });
          break;

        case NOTE:
          mediaService.toggleNotePrivateStatus(noteId, () => {
            this.setData({ isPrivate: isPrivate ? 0 : 1 });
          });
          break;
      }
    },

    delete() {
      const { mediaType, videoId, noteId } = this.properties;

      switch (mediaType) {
        case VIDEO:
          wx.showModal({
            content: "确定删除该视频游记吗？",
            showCancel: true,
            success: (result) => {
              if (result.confirm) {
                mediaService.deleteVideo(videoId, () => {
                  wx.showToast({
                    title: "删除成功",
                    icon: "none",
                  });
                  setTimeout(() => {
                    wx.navigateBack();
                  }, 2000);
                });
              }
            },
          });
          break;

        case NOTE:
          wx.showModal({
            content: "确定删除该图文游记吗？",
            showCancel: true,
            success: (result) => {
              if (result.confirm) {
                mediaService.deleteNote(noteId, () => {
                  wx.showToast({
                    title: "删除成功",
                    icon: "none",
                  });
                  setTimeout(() => {
                    wx.navigateBack();
                  }, 2000);
                });
              }
            },
          });
          break;
      }
    },

    hide() {
      this.triggerEvent("hide");
    },
  },
});
