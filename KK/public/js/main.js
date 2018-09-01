
(function ($) {
    "use strict";
 
    
    /*==================================================================
    [ Validate ]*/
    var input = $('.validate-input .input100');
    var secondauth;
  
    $('.validate-form').on('submit',function(){
        var check = true;

        for(var i=0; i<input.length; i++) {
            if(validate(input[i]) == false){
                showValidate(input[i]);
                check=false;
            }
        }
        if(check){
      
            const email = document.getElementById('loginemail').value;
            const password = document.getElementById('loginpassword').value;
           const auth = firebase.auth();
            const promise = auth.signInWithEmailAndPassword(email, password);
            promise.catch(e => alert(e.message));
            
           
       firebase.auth().onAuthStateChanged(firebaseUser => {
  if(firebaseUser) {
      console.log(firebaseUser);
    
    //  location.href = "member/index.html";

  
    $("#login-form").hide();
    $("#patternDiv").show();
    var lock = new PatternLock('#patternContainer',{

        onDraw:function(pattern){
            console.log("pattern value:" +pattern);
           checkSecondAuth(pattern,firebaseUser.uid);
            
            
        }
    });
      }  else {
         
      }
  
       })
            return false;
        }
        else if(!check){
            return check;
        }
   
    });


    $('.validate-form .input100').each(function(){
        $(this).focus(function(){
           hideValidate(this);
        });
    });

    function validate (input) {
        if($(input).attr('type') == 'email' || $(input).attr('name') == 'email') {
            if($(input).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
                return false;
            }
        }
        else {
            if($(input).val().trim() == ''){
                return false;
            }
        }
    }

    function showValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).addClass('alert-validate');
    }

    function hideValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).removeClass('alert-validate');
    }
    
    
   
    function checkSecondAuth (authpattern,uid) {
        var secondAuthRef = firebase.database().ref('Swipe_Authentication/' + uid);
        var authcheck;
        secondAuthRef.on('value' , function(snapshot) {
            console.log("snapshot value: "+snapshot.child('swipe').val());                     
            if(snapshot.child('swipe').val() == authpattern){
                location.href = 'members/index.html';
                alert("Successfully logged in!");

            }               
            else if(snapshot.child('swipe').val() != authpattern){
                alert("failedauth,try again");
                location.reload();
            }     
            
          })
    }

    $('#forgotpassword').on('click', function() {
        var txt;
          var forgotemail = prompt("Please enter your email:", "example@yahoo.com");
          if (forgotemail == null ||forgotemail == "") {
            
              txt = "User cancelled the prompt.";
      
      
          } else {
            var auth = firebase.auth();
      var emailAddress = forgotemail;
      
      auth.sendPasswordResetEmail(emailAddress).then(function() {
       alert("Password reset link sent to  " + forgotemail + "!");
      }).catch(function(error) {
        
        
        alert("Some error occured, contact Admin for assistance!");;
      });
           
          }
         
      });

})(jQuery);