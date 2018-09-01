
(function ($) {
    "use strict";
var resetemail;
var uid;
var auth = firebase.auth();
$( "#logoutBtn" ).on( "click",logout );

 auth.onAuthStateChanged(firebaseUser => {
        if(firebaseUser) {

           resetemail = firebaseUser.email;
           uid = firebaseUser.uid;
           console.log('logged in' + resetemail + '|' + uid);
          welcomeQuery(firebaseUser.uid);
     
            }  else {
                console.log('not logged in');
                location.href = "../index.html";
            }
        
             })



             function welcomeQuery(uid) {
                var coreRef = firebase.database().ref('Members_Details/' + uid);
                coreRef.on('value' , function(snapshot) {
                     welcomeQuery2(snapshot.child('upline_id').val());
    


                 
               })
             }

             function welcomeQuery2(upline_id) {
        
                var coreRef2 = firebase.database().ref('Members_Details/' + upline_id);
                coreRef2.on('value' , function(snapshot) {
                    document.getElementById("upline_photoUrl").innerHTML = '<img class="avatar" src="' + snapshot.child('photoUrl').val() + '" alt="Avatar">';
                    document.getElementById("upline_msg").innerHTML = "" + snapshot.child('dl_msg').val();
                    document.getElementById("upline_name").innerHTML = "" + snapshot.child('name').val();


                 
               })
             }

             $('#redirect_account').on('click', function() {
                window.location = 'account_settings.html';
              });
              $('#redirect_downline').on('click', function() {
                window.location = 'downlines.html';
              });
              function logout() {
   
                auth.signOut();
                return false;
               }
            })(jQuery);