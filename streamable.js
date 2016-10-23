var request = require('superagent');
var Promise = require('bluebird');
var retry = require('bluebird-retry');

var STEAMABLE_API = 'https://api.streamable.com';

var importVideoFromUrl = (url, title) => new Promise((resolve, reject) => {
  var requestUrl = STEAMABLE_API + '/import?url=' + url;
  if (title) {
    requestUrl = requestUrl + "&title=" + title;
  }
  request
    .get(requestUrl)
    .accept('application/json')
    .end((err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res.body);
      }
    });
});

var getVideo = shortcode => new Promise((resolve, reject) => {
  var requestUrl = STEAMABLE_API + '/videos/' + shortcode;
  request
    .get(requestUrl)
    .accept('application/json')
    .end((err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res.body);
      }
    });
});

var waitForReadyStatus = shortcode => new Promise((resolve, reject) => {
  retryUntilSuccessOrTimeout(shortcode, 50000, 3000)
    .then(video => {
      if(video.status === 2){
        resolve(video);
      } else {
        reject(video);
      }
    }
  )
  .catch(reject);
});

var retryUntilSuccessOrTimeout = (shortcode, timeout, delay) => {
    var done = false;
    function doCheck() {
        return checkReadyStatus(shortcode).catch(function () {
            if(!done) {
                return Promise.delay(delay).then(doCheck)
            }
        })
    }
    return doCheck().timeout(timeout).finally(function () {
        //In case of timeout; set done to be true to end the retry looping
        done = true;
    })
}

var checkReadyStatus = (shortcode) => new Promise((resolve, reject) => {
  var promise = getVideo(shortcode).then(video => {
      if(video.status === 2 || video.status === 3){

        resolve(video);
      } else {
        reject(video);
      }

  })
  .catch(reject);
});

var DELAY = 3000;
var delay = () => new Promise ((resolve) =>
{
  setTimeout(resolve, DELAY);
});

module.exports = exports = {
  waitForReadyStatus,
  importVideoFromUrl,
  getVideo
};
