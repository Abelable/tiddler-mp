const statusArr = [
  {
    code: ['000'],
    desc: '待付款'
  },
  {
    code: ['200', '220', '223'],
    desc: '已取消'
  },
  {
    code: ['120', '520', '620'],
    desc: '待发货'
  },
  {
    code: ['123', '523'],
    desc: '备货中'
  },
  {
    code: ['121', '521'],
    desc: '待收货'
  },
  {
    code: ['624'],
    desc: '部分发货'
  },
  {
    code: ['122', '522', '523', '623'],
    desc: '交易完成'
  }
]

function judgeOrderStatus(order_status, pay_status, shipping_status) {
  let composite_status = order_status + pay_status + shipping_status
  let desc = ''
  statusArr.map(item => {
    item.code.map(_item => {
      if (_item === composite_status) desc = item.desc
    })
  })
  return desc
}

export default judgeOrderStatus
