const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const gmailEmail = functions.config().gmail.email;
const gmailPassword = functions.config().gmail.password;
const mailTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: "mfctutor1437@gmail.com",
    pass: "mfctutor!@#",
  },
});
admin.initializeApp();


exports.createNewMember = functions.database.ref('/New_Application/{applicationID}').onCreate((snap, context) => {
    const createdData = snap.val(); // data that was created
    const phonenumber = "+" + createdData.contact;
    console.log("data:", createdData);

    return admin.auth().createUser({
      email: createdData.email,
      emailVerified: false,
      phoneNumber: phonenumber,
      password: "123456",
      displayName: createdData.name,
      photoURL: createdData.photoUrl,
      disabled: false
    })
      .then(function(userRecord) {
        admin.database().ref("Swipe_Authentication/"+ userRecord.uid + '/swipe').set("7415369");
       return  admin.database().ref("Members_Details/"+ userRecord.uid).set(createdData);
      })
      .catch(function(error) {
        console.log("Error creating new user:", error);
      });
  
  });

  exports.welcomeEmailer = functions.database.ref('/Members_Details/{memberID}').onCreate((snap, context) => {
    const createdData = snap.val(); // data that was created

    console.log("data:", createdData);

    const memberID = context.params.memberID;
  const mailOptions = {
    from: '"MFC Admin - Console" <noreply@MFCconsole.com>',
    to: createdData.email,
  };

  mailOptions.subject =  'Welcome to MFC Family!';
  mailOptions.text = 'Good Day!\n\n' + 'Your MFCTutor membership has been approved. Kindly follow the steps below to gain access to your new account.\n\nNew Membership details :-\nName:' + createdData.name + '\nE-mail: ' + createdData.email + '\nPassword: 1. Go to link (https://mfctutor-38bba.firebaseapp.com) 2. Select "First Time Login" and key-in email address. 3. Check you email for password reset link. 4.Follow the link and key-in new password. 5.Login to your new premium MFC Account. 6. Your default Login Pattern is M (key:7415369) \nUpline Info :' + createdData.upline + '\n\nKindly contact our admin at test@mfc.com if you need assistance.\n\nRegards,\nMFC Team';
  return mailTransport.sendMail(mailOptions)
  .then(() => console.log('subscription confirmation email sent for:' + memberID))
  .catch((error) => console.error('There was an error while sending the email:', error));
  
  });