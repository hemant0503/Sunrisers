
(function ($) {
    "use strict";
var resetemail;
var uid;
var auth = firebase.auth();
$( "#logoutBtn" ).on( "click",logout );
$( "#passwordResetBtn" ).on( "click", resetpassword );
 auth.onAuthStateChanged(firebaseUser => {
        if(firebaseUser) {

           resetemail = firebaseUser.email;
           uid = firebaseUser.uid;
           console.log('logged in' + resetemail + '|' + uid);
           coreQuery(firebaseUser.uid);
           patternQuery(firebaseUser.uid);
            }  else {
                console.log('not logged in');
                location.href = "../index.html";
            }
        
             })


             function coreQuery(uid) {
                var coreRef = firebase.database().ref('Members_Details/' + uid);
                coreRef.on('value' , function(snapshot) {
                    document.getElementById("account_photoUrl").innerHTML = ' <img class="author_img rounded-circle" src="' + snapshot.child('photoUrl').val() + '" alt="">';
                  document.getElementById("account_name").innerHTML = "Holder Name : " + snapshot.child('name').val();
                  document.getElementById("account_type").innerHTML = "Account Type : " + snapshot.child('type').val();
                  document.getElementById("account_email").innerHTML = "Primary Email Address : " + snapshot.child('email').val();
                  document.getElementById("account_contact").innerHTML = "Contact Number : " + snapshot.child('contact').val();
                  document.getElementById("account_memberID").innerHTML = "MFC Member ID : " + snapshot.child('memberID').val(); 
                  document.getElementById("account_joindate").innerHTML = "Date Joined : " + snapshot.child('joined').val(); 
                  document.getElementById("account_upline").innerHTML = "Upline : " + snapshot.child('upline').val(); 
                  document.getElementById("account_country").innerHTML = "Country : " + snapshot.child('country').val(); 


                 
               })
             }
             function patternQuery(uid) {
                var coreRef = firebase.database().ref('Swipe_Authentication/' + uid);
                coreRef.on('value' , function(snapshot) {
                 
                  document.getElementById("pattern_currentkey").innerHTML = "Current Key : " + snapshot.child('swipe').val();
                
               })
             }

             var lock = new PatternLock('#patternContainer',{

                onDraw:function(pattern){
                    if (confirm("Proceed to reset pattern with KEY :"+ pattern +"?")) {
                        firebase.database().ref('Swipe_Authentication/' + uid).update({swipe : pattern });
                        alert("Pattern reset successful! Your new pattern key is : "+ pattern);
                        location.reload();
                    }
            
                    
                    
                }
            });
             function logout() {
   
                auth.signOut();
                return false;
               }

               function resetpassword() {
          
                if (confirm("Proceed to reset password?")) {
                    auth.sendPasswordResetEmail(resetemail).then(function() {
                  
                        alert("Success! Check your email for password reset link.")
                     
                        return false;
                      }).catch(function(error) {
                        alert("Failure! Try again later.")
                     
                        return true;
                      });  
                }
            
                }


    
})(jQuery);