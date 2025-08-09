
/**
 * Time Helper
 * @typedef {Object} TimeHelper
 * @property {Number} FiveSeconds - 5 seconds
 * @property {Number} ThreeMinutes - 3 minutes
 * @property {Number} OneDay - 1 day
 * @property {Number} OneWeek - 1 week
 * @property {Number} OneMonth - 1 month
 * @property {Number} TwoMonths - 2 months
 * @property {Number} OneYear - 1 year
 */
const TimeHelper                            = {
  FiveSeconds                               : 1000 * 5, // 5 seconds
  ThreeMinutes                              : 1000 * 60 * 3, // 3 minutes
  OneDay                                    : 1000 * 60 * 60 * 24, // 1 day
  OneWeek                                   : 1000 * 60 * 60 * 24 * 7, // 1 week
  OneMonth                                  : 1000 * 60 * 60 * 24 * 30, // 1 month
  TwoMonths                                 : 1000 * 60 * 60 * 24 * 60, // 2 months
  OneYear                                   : 1000 * 60 * 60 * 24 * 365, // 1 year
}

export {
  TimeHelper as default,
}
