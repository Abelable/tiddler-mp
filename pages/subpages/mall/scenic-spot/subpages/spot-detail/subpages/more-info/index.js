Page({
  data: {
    menuList: [],
    curMenuIdx: 0,
    scenicInfo: null,
    briefFold: true,
    curFacilityIdx: 0,
  },

  async onLoad({ info, scene }) {
    let {
      name: title,
      brief,
      openTimeList = [],
      policyList = [],
      hotlineList = [],
      projectList = [],
      facilityList = [],
      tipsList = [],
    } = JSON.parse(info);
    wx.setNavigationBarTitle({ title });
    this.brief = brief;

    const menuList = [{ name: "景点简介", scene: "brief" }];
    let scenicInfo = { brief: `${this.brief.slice(0, 68)}...` };
    if (openTimeList.length) {
      menuList.push({ name: "开放时间", scene: "openTime" });
      scenicInfo = { ...scenicInfo, openTimeList };
    }
    if (policyList.length) {
      menuList.push({ name: "优待政策", scene: "policy" });
      scenicInfo = { ...scenicInfo, policyList };
    }
    if (hotlineList.length) {
      menuList.push({ name: "咨询热线", scene: "hotline" });
      scenicInfo = { ...scenicInfo, hotlineList };
    }
    if (projectList.length) {
      menuList.push({ name: "景区项目", scene: "project" });
      scenicInfo = { ...scenicInfo, projectList };
    }
    if (facilityList.length) {
      menuList.push({ name: "景区设施", scene: "facility" });
      facilityList = facilityList.map((item) => ({
        name: ["停车场", "卫生间", "商店", "餐厅"][item.facilityId - 1],
        image: ["park", "toilet", "shop", "food"][item.facilityId - 1],
        content: item.content,
      }));
      scenicInfo = { ...scenicInfo, facilityList };
    }
    if (tipsList.length) {
      menuList.push({ name: "游玩贴士", scene: "tips" });
      scenicInfo = { ...scenicInfo, tipsList };
    }

    this.setData({ menuList, scenicInfo });

    if (scene) {
      const menuIdx = menuList.findIndex((item) => item.scene === scene);
      this.setMenuChangeLimitList(menuIdx);
    } else {
      this.setMenuChangeLimitList();
    }
  },

  setMenuChangeLimitList(menuIdx) {
    const query = wx.createSelectorQuery();
    query.selectAll(".card").boundingClientRect();
    query.exec((res) => {
      this.menuChangeLimitList = res[0].map(
        (item) => item.top + (this.scrollTop || 0)
      );

      if (menuIdx) {
        wx.pageScrollTo({
          scrollTop: this.menuChangeLimitList[menuIdx] - 56,
        });
      }
    });
  },

  selectMenu(e) {
    const { index } = e.currentTarget.dataset;
    wx.pageScrollTo({
      scrollTop: this.menuChangeLimitList[index] - 56,
    });
  },

  toggleBriefFold() {
    const { briefFold } = this.data;
    this.setData({
      briefFold: !briefFold,
      ["scenicInfo.brief"]: briefFold
        ? this.brief
        : `${this.brief.slice(0, 68)}...`,
    });
    this.setMenuChangeLimitList();
  },

  selectFacility(e) {
    const curFacilityIdx = Number(e.currentTarget.dataset.index);
    this.setData({ curFacilityIdx });
  },

  onPageScroll({ scrollTop }) {
    this.scrollTop = scrollTop;

    const menuLimit = scrollTop + 56;
    if (menuLimit < this.menuChangeLimitList[1]) {
      if (this.data.curMenuIdx !== 0) this.setData({ curMenuIdx: 0 });
    } else if (
      menuLimit >= this.menuChangeLimitList[1] &&
      menuLimit < this.menuChangeLimitList[2]
    ) {
      if (this.data.curMenuIdx !== 1) this.setData({ curMenuIdx: 1 });
    } else if (
      menuLimit >= this.menuChangeLimitList[2] &&
      menuLimit < this.menuChangeLimitList[3]
    ) {
      if (this.data.curMenuIdx !== 2) this.setData({ curMenuIdx: 2 });
    } else if (
      menuLimit >= this.menuChangeLimitList[3] &&
      menuLimit < this.menuChangeLimitList[4]
    ) {
      if (this.data.curMenuIdx !== 3) this.setData({ curMenuIdx: 3 });
    } else if (
      menuLimit >= this.menuChangeLimitList[4] &&
      menuLimit < this.menuChangeLimitList[5]
    ) {
      if (this.data.curMenuIdx !== 4) this.setData({ curMenuIdx: 4 });
    } else if (
      menuLimit >= this.menuChangeLimitList[5] &&
      menuLimit < this.menuChangeLimitList[6]
    ) {
      if (this.data.curMenuIdx !== 5) this.setData({ curMenuIdx: 5 });
    } else if (menuLimit >= this.menuChangeLimitList[6]) {
      if (this.data.curMenuIdx !== 6) this.setData({ curMenuIdx: 6 });
    }
  },
});
