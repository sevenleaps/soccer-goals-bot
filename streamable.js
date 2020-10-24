const request = require('superagent')
const Promise = require('bluebird')

const STEAMABLE_API = 'https://api.streamable.com'

const importVideoFromUrl = (url, title) => new Promise((resolve, reject) => {
  var requestUrl = STEAMABLE_API + '/import?url=' + url
  if (title) {
    requestUrl = `${requestUrl}&title=${title}`
  }
  request
    .get(requestUrl)
    .accept('application/json')
    .end((err, res) => {
      if (err) {
        reject(err)
      } else {
        resolve(res.body)
      }
    })
})

const getVideo = shortcode => new Promise((resolve, reject) => {
  var requestUrl = STEAMABLE_API + '/videos/' + shortcode
  request
    .get(requestUrl)
    .accept('application/json')
    .end((err, res) => {
      if (err) {
        reject(err)
      } else {
        resolve(res.body)
      }
    })
})

const waitForReadyStatus = shortcode => new Promise((resolve, reject) => {
  retryUntilSuccessOrTimeout(shortcode, 50000, 3000)
    .then(video => {
      if (video.status === 2) {
        resolve(video)
      } else {
        reject(video)
      }
    })
    .catch(reject)
})

const retryUntilSuccessOrTimeout = (shortcode, timeout, delay) => {
  var done = false
  function doCheck () {
    return checkReadyStatus(shortcode).catch(function () {
      if (!done) {
        return Promise.delay(delay).then(doCheck)
      }
    })
  }
  return doCheck().timeout(timeout).finally(function () {
    // In case of timeout set done to be true to end the retry looping
    done = true
  })
}

const checkReadyStatus = (shortcode) => new Promise((resolve, reject) => {
  getVideo(shortcode).then(video => {
    if (video.status === 2 || video.status === 3) {
      resolve(video)
    } else {
      reject(video)
    }
  })
    .catch(reject)
})

module.exports = exports = {
  waitForReadyStatus,
  importVideoFromUrl,
  getVideo
}
