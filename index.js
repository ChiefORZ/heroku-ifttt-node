const { json, send } = require('micro');
const { match, test } = require('micro-match');
const axios = require('axios');
const parse = require('urlencoded-body-parser');

module.exports = async (req, res) => {
  try {
    if (test('/ifttt/:key', req.url)) {
      const { key } = match('/ifttt/:key', req.url);
      const body = await parse(req);
  
      const iftttUrl = `https://maker.ifttt.com/trigger/heroku_deploy/with/key/${key}`;
      const iftttBody = {
        value1: `${body?.['app']} ${body?.['release']} was deployed to Heroku by ${body?.['user']}`,
        value2: body?.['url'],
        value3: `${body?.['app']} ${body?.['release']}`
      }
      console.log(`Sending post request to ${iftttUrl}`, iftttBody)
      await axios.post(iftttUrl, iftttBody, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return send(res, 200, 'ok');
    } else {
      return send(res, 404, 'not found');
    }
  } catch(err) {
    console.error(err);
    send(res, 500, 'internal server error');
  }
}