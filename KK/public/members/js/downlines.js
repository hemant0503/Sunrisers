
(function ($) {
    "use strict";
var resetemail,uid,name;

var auth = firebase.auth();
$( "#logoutBtn" ).on( "click",logout );
$( "#btn_dl-add" ).on( "click",show_dladd );
$(".register-select").select2({ width: '180px' }); 
var uploader = document.getElementById('photoUrlProgress');
var fileButton = document.getElementById('photoUrl_Btn');

 auth.onAuthStateChanged(firebaseUser => {
        if(firebaseUser) {
            name = firebaseUser.displayName + "d";
           resetemail = firebaseUser.email;
           uid = firebaseUser.uid;
           console.log('logged in' + resetemail + '|' + uid + '|' + name);
           downlineQuery(firebaseUser.uid);
   
     
            }  else {
                console.log('not logged in');
                location.href = "../index.html";
            }
        
             })



             function downlineQuery(uid){
              var DownlineRef =  firebase.database().ref('Members_Details/');
             DownlineRef.on("child_added", snap => {
                 
               if(snap.child('upline_id').val() == uid){
                $("#downline-list").append(' <div class="table-row">'  
               + '<div class="serial">' + snap.child('memberID').val() + '</div>' 
               + '<div class="country"> <img height="42" width="42" src="' + snap.child('photoUrl').val() + '" alt="flag">' + snap.child('name').val() +'</div>'
               + '<div class="visit">' + snap.child('joined').val() + '</div>'
               + '<div class="percentage"><div class="progress"> <div class="progress-bar color-1" role="progressbar" style="width: 80%" aria-valuenow="80" aria-valuemin="0" aria-valuemax="100"></div></div> </div> </div>"');

               }
     
              
           
             
                         
                                       
              });
   
             }  

      


              function logout() {
   
                auth.signOut();
                return false;
               }
               function show_dladd() {
                $("#dl-list").hide();
                $("#dl-add").show();
            
               }

               
          fileButton.addEventListener('change',function(e) {
            var file = e.target.files[0];
            var timeStampInMs = window.performance && window.performance.now && window.performance.timing && window.performance.timing.navigationStart ? window.performance.now() + window.performance.timing.navigationStart : Date.now();
            var storageRef = firebase.storage().ref('PhotoID/' + file.name + timeStampInMs);
            
            var task = storageRef.put(file);
            task.on('state_changed',
            function progress(snapshot) {
              var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              uploader.value = percentage; 
            },
            function error(err) {
            
            },
            function complete() {
               task.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                $("#header").data('headerSettings',{
                    link1 :  downloadURL ,
                    
                 }); 
                    console.log('File available at', downloadURL);
                  });
             
              
            }
            );
            });

            $('#registerForm').submit(function() {
                 
      var firstname = document.getElementById("first_name").value;
      var lastname = document.getElementById("last_name").value;
      var callingcode = document.getElementById("calling_code").value;
      var contactnumber = document.getElementById("contact").value;
      var email = document.getElementById("email").value;
      var address = document.getElementById("address").value;
      var membertype = document.getElementById("type").value;
      var country = document.getElementById("country").value;  
     var photoUrl = $("#header").data('headerSettings').link1;
     var contact =  document.getElementById("calling_code").value +  document.getElementById("contact").value;    
     var membername = document.getElementById("first_name").value + document.getElementById("last_name").value;
     var dl_msg = "A very warm welcome to my downline members!";
     var joined = new Date();
     var memberID = "MFCX";
     var upline = name;
     var upline_id = uid;
console.log(firstname+lastname+callingcode+contactnumber+email+address+membertype+country+photoUrl+contact+membername+dl_msg+joined+memberID+upline+upline_id);
  let postRef = firebase.database().ref('/New_Application');
  postRef.push({ name : membername,
    contact : contact,    
    country : country,
    address : address,
    dl_msg : dl_msg,
    email : email,
    joined : joined,
    memberID  : memberID,
    photoUrl : photoUrl,
    type : membertype,
    upline: upline,
    upline_id : upline_id })
      .then(res => {
        console.log(res.getKey()) // this will return you ID
          alert("Successfully added new member! Member will be notified & guided with Welcome Email. Transaction ID - " + res.getKey());
          location.reload();
    
      })
      .catch(error => console.log(error));
     return false;

            });
            })(jQuery);