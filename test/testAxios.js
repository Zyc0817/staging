const axios = require('axios')
const Qs = require('qs')
// const url = 'http://47.96.2.39/advertise/advertiseList'
const url = 'http://47.96.2.39/departments/posts'

// const data = {
//   hotalId: 800000000000,
//   size: 8,
//   hasSplit: 0
// }

const data = {
  departmentIds: [100000000000, 100000000001]
}

axios({
  url,
  method: 'get',
  params: data,
  paramsSerializer: params => Qs.stringify(params, {arrayFormat: 'repeat'})
})
  .then(res => {
    console.log(res.data)
  })
  .catch(err => {
    console.error(err)
  })
