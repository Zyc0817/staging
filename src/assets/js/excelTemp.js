const _ = require('lodash')
const costHeader = {
  'idx': {label: '序号', format: (v, rIdx) =>{
      return v !== undefined||NaN ? (v + '') : (parseInt(rIdx) + 1 + '')
  }},
  'certName': {label: '姓名'},
  // 'workerCertNo': {label: '身份证号', default: '', format: v => _.fill(String(v).split(''), '*', 0, -4).join('')},
  'workerCertNo': {label: '身份证号', default: '--'},
  'bankName': {label: '银行名称', default: '--'},
  'subBankName': {label: '开户支行', default: '--'},
  'bankNo': {label: '银行卡号', default: '--'},
  'calCost': {label: '核算费用', default: 0, format: v => typeof (v) === 'number' ? v / 100 : (v + '')}
}
export default {
  costHeader
}
