const fetch = require("node-fetch");
const assert = require("assert");
const ora = require("ora");

const REQUEST_INTERVAL = 100;
const REQUEST_TIMEOUT = 500;

const EXPECT_200 = (response) => assert(response.status === 200);

const singleFetch = (url, responseExpect = EXPECT_200) =>
  fetch(url, { timeout: REQUEST_TIMEOUT }).then(responseExpect);

const getSpinner = (url) =>
  ora({ text: `Watch ${url}`, spinner: "circleHalves" }).start();

const watch = (url, options) => {
  let startedAt = new Date().getTime();
  let failedAt = null;
  let spinner = getSpinner(url);
  setInterval(() => {
    const duration = new Date().getTime() - startedAt;
    const failedDuration = (failedAt && new Date().getTime() - failedAt) || 0;
    singleFetch(url)
      .then((r) => {
        if (failedAt) {
          spinner.succeed(
            `${new Date().toISOString()} online again, downtime duration=${
              failedDuration / 1000
            } seconds`
          );
          spinner = getSpinner(url);
          failedAt = null;
          startedAt = new Date().getTime();
        }
        spinner.color = "green";
        spinner.text = `${url} online since ${duration / 1000} seconds.`;
        return r;
      })
      .catch((e) => {
        if (!failedAt) {
          spinner.fail(`${new Date().toISOString()} ${url} : ${e.message}`);
          spinner = getSpinner(url);
          failedAt = new Date().getTime();
        }
        spinner.color = "red";
        spinner.text = `${url} offline since ${failedDuration / 1000} seconds.`;
      });
  }, REQUEST_INTERVAL);
};

module.exports = watch;
