const admin = require('firebase-admin')
const { google } = require('googleapis')
const axios = require('axios')

const MESSAGING_SCOPE = 'https://www.googleapis.com/auth/firebase.messaging'
const SCOPES = [MESSAGING_SCOPE]

const serviceAccount = require('./smart-monitoring-t219-firebase-adminsdk-cvhuo-2a4d626b03.json')
const databaseURL = 'https://smart-monitoring-t219.firebaseio.com/'
const URL =
  'https://fcm.googleapis.com/v1/projects/smart-monitoring-t219/messages:send'
const deviceToken =
'd4gFoAwbrms:APA91bH5fOEGQ3iWzxD4scrI57jEbNjsECw14ipulrFhXUnDzULYLubGwWp8LaBXfCXx_2J3VK1G-hynL4yxAtiQwOuYima_GZsWKSSViAtAQMwfyt1L_Q7f2Fs8Z5RU4inm_lV3ccxh'
function get()
{
//179=ELPQW2BNi979rAh-lwcIPq_v4Z6zxJnjVQr107JSiaG8XwJqlNLYuRLdGP1s6Rvd1YBdVyO7Kl_0XNWFG2ZvbZZ-JofllKhSZRrekDvwaILttf6tfQQ8sTgfggNRDzzr3QbEdJtZYTjNiu7WAab2ofrViWxgd-b0zofGH8oZk9o
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: databaseURL
})

// Import Admin SDK

function getAccessToken(x) {
  return new Promise(function(resolve, reject) {
    var key = serviceAccount
    var jwtClient = new google.auth.JWT(
      key.client_email,
      null,
      key.private_key,
      SCOPES,
      null
    )
    var db = admin.database();
    var ref = db.ref("sw");
    ref.on("value", function(snapshot) {
    if (snapshot.val() == 0)
    {
    jwtClient.authorize(function(err, tokens) {
      if (err) {
        reject(err)
        return
      }
      resolve(tokens.access_token)
    })
  }
  else {
    if ( ! x) {
        return;
    }
    getAccessToken(--x);
  }
    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    });


  })
}//

async function init() {
  const body = {
    message: {
      data: { key: 'value' },
      notification: {
        title: 'wasin',
        body: 'Hi today is birth day'
      },
      webpush: {
        headers: {
          Urgency: 'high'
        },
        notification: {
          requireInteraction: 'true'
        }
      },
      token: deviceToken
    }
  }

  while (true)
 {
    const accessToken = await getAccessToken()
    console.log('accessToken: ', accessToken)
    const { data } = await axios.post(URL, JSON.stringify(body), {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      }
    })
    console.log('name: ', data.name)
  }
}
init()
