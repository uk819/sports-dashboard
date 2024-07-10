export type AnnouncementDetail = {
  id: number,
  billboardTitleCn: string,
  billboardTitleEn: string,
  billboardTypeCn: string,
  billboardTypeEn: string,
  billboardContentCn: string,
  billboardContentEn: string,
  status: number,
  createdAt: string,
  createdBy: string,
  updatedAt: string,
  updatedBy: string,
  sendAt: string,
  startCreatedAt: string,
  endCreatedAt: string,
  billClassify: number
}

export type Announcement = {
  endRow: number,
  hasNextPage: boolean,
  hasPreviousPage: boolean,
  isFirstPage: boolean,
  isLastPage: boolean,
  list: Array<AnnouncementDetail>,
  navigateFirstPage: number,
  navigateLastPage: number,
  navigatePages: number,
  navigatepageNums: number,
  nextPage: number,
  pageNum: number,
  pageSize: number,
  pages: number,
  prePage: number,
  size: number,
  startRow: number,
  total: number
}
