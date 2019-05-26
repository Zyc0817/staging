/**
 *
 * @param {*} {startTime: 工作开始时间, endTime: 工作结束时间, restTime: 培休时间, totalCount: 申请人数}
 * @param {*} mealSettings 酒店用餐设置
 */
const genMeals = ({startTime = 0, endTime = 0, totalCount = 0}, mealSettings = {}) => {
  if (mealSettings.mealGenerate === 'none') { // 无餐次管理
    return {}
  }
  let timeSection = endTime - startTime
  timeSection = timeSection < 0 ? timeSection + 86400000 : timeSection
  let step = mealSettings.mealStep || 14400000
  let mealCount = parseInt(timeSection / step)
  mealCount = mealCount > 3 ? 4 : mealCount
  let reduceTime = mealCount * (mealSettings.deductTime || 1800000)
  let mealArr = [
    {key: 0b0000, value: startTime},
    {key: 0b1000, value: mealSettings.breakfastEnd || 31800000},
    {key: 0b0100, value: mealSettings.lunchEnd || 48600000},
    {key: 0b0010, value: mealSettings.dinnerEnd || 68400000},
    {key: 0b0001, value: mealSettings.supperEnd || 83700000}
  ]
  mealArr.sort((a, b) => a.value - b.value)
  let section = mealArr.splice(mealArr.findIndex(el => el.key === 0b0000) + 1).concat(mealArr)
  section.splice(mealCount)
  let mealTimes = section.reduce((p, c) => {
    return p | c.key
  }, 0b0000)
  let mealTimesString = ('0000' + parseInt(mealTimes).toString(2)).split('').splice(-4).join('')
  return Object.assign({
    reduceTime, // 每人每天用餐时间
    mealCount, // 每人每天用餐次数
    totalMealCount: mealCount * totalCount, // 计划每天总餐次
    mealTimes, // 每人每天用餐分配(十进制数字，如12，代表早中2餐)
    mealTimesString // 每人每天用餐分配(字符串，如1100，代表早中2餐)
  }, mealSettings)
}

export default {
  genMeals
}

// console.log(genMeals({startTime: 26000000, endTime: 79200000, totalCount: 6}))
