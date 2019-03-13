const admin = require('firebase-admin')
const { google } = require('googleapis')
const axios = require('axios')

const MESSAGING_SCOPE = 'https://www.googleapis.com/auth/firebase.messaging'
const SCOPES = [MESSAGING_SCOPE]

const serviceAccount = require('./tryfirebase-a3bd9-firebase-adminsdk-jgpgl-3bee92950a.json')
const databaseURL = 'https://tryfirebase-a3bd9.firebaseio.com/'
const URL =
  'https://fcm.googleapis.com/v1/projects/tryfirebase-a3bd9/messages:send'
const deviceToken =
'esaUTrG2qzA:APA91bEJSc2cH_LKj2e0_ym3tbDGI2DGlwR24Ni7pq7_e1SYxVyaqbH2RKj7efFdmzh8vS5SG9Q0xq34Ij_tKF9RmUpgFFPe3OvixmLXkc5e-YFfSZq4OabaYrC1xQdUgyOWApJUqeUC'
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
        body: 'Hi today is wensday'
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
