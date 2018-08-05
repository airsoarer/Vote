(function(){
    $(document).ready(init);
    var config = {
        apiKey: "AIzaSyChBo2i6dJhMC7-nxl7wpKfrJO72aONFUM",
        authDomain: "vote-1f5f5.firebaseapp.com",
        databaseURL: "https://vote-1f5f5.firebaseio.com",
        projectId: "vote-1f5f5",
        storageBucket: "vote-1f5f5.appspot.com",
        messagingSenderId: "870977817418"
    };

    function init(){
        firebase.initializeApp(config);
        $('#vote').on('click', voteModal);
        $('#loginNav').on('click', loginModal);
        $('#signUpNav').on('click', signUpModal)
        $('#login').on('click', login);
        $('#pass').keyup((e) => {
            if(e.keyCode === 13){
                login();
            }
        });

        $('#signUp').on('click', signUp);
        $('#enterCode').on('click', vote);
        $('#code').keyup((e) => {
            if(e.keyCode === 13){
                vote();
            }
        });

        $('#polls').on('click', polls);
    }

    function polls(){
        location.replace('../html/public.html?code=CODE');
    }

    function vote(){
        var code = $('#code').val();
        code = Number(code);

        var ref = firebase.database().ref('Users/');
        ref.on('value', function(snapshot){
            var data = snapshot.val();
            for(var i in data){
                for(var x in data[i].Polls){
                    console.log(data[i].Polls[x].Code, code);
                    if(Number(data[i].Polls[x].Code) === code){
                        console.log("working");
                        location.replace('../html/poll.html?key=' + x + "&code=CODE");
                    }
                }
            }
        })
    }

    // Authentication functions
    function login(){
        var email = $('#email').val();
        var pass = $('#pass').val();

        var auth = firebase.auth().signInWithEmailAndPassword(email, pass);
        auth.catch(function(error, firebaseUser){
            var errorCode = error.code;
            console.log(errorCode);
            if(errorCode === 'auth/user-not-found'){
                $('#wrongAuth').modal();
                $('#wrongAuth').modal('open');
                return;
            }

            if(errorCode === 'auth/wrong-password'){
                $('#wrongAuth').modal();
                $('#wrongAuth').modal('open');
                return;
            }

            if(errorCode === 'auth/invalid-email'){
                $('#wrongAuth').modal();
                $('#wrongAuth').modal('open')
                return;
            }

            if(errorCode === 'auth/email-already-in-use'){
                $('#inUse').modal();
                $('#inUse').modal('open');
                return;
            }

        });

        firebase.auth().onAuthStateChanged(firebaseUser =>{
            if(firebaseUser != null){
                // console.log(firebaseUser.uid);
                // console.log(localStorage);
                localStorage.setItem('uid', String(firebaseUser.uid));
                // console.log(localStorage.getItem('uid'));
                location.replace('../html/home.html');
            }
        });
    }

    function signUp(){
        var fname = $('#fname').val();
        var lname = $('#lname').val();
        var username = $('#username').val();
        var email = $('#semail').val();
        var pass = $('#spass').val();
        var confirmPass = $('#confirmPass').val();
        var fileInput = $('#photo')[0];
        var file = fileInput.files[0];

        // console.log(email);

        if(!file){
            noFileModal();
            // return;
        }

        if(pass === confirmPass && pass.length >= 8){
            firebase.auth().createUserWithEmailAndPassword(email, pass);
            firebase.auth().onAuthStateChanged(function(firebaseUser){
                if(firebaseUser){    
                    firebase.database().ref('Users/' + firebaseUser.uid).set({
                        FirstName:fname,
                        LastName:lname,
                        Username:username,
                        Email:email,
                        Password:pass,
                    });

                    localStorage.setItem('uid', firebaseUser.uid);

                    var storageRef = firebase.storage().ref('User Photos/' + firebaseUser.uid);
                    storageRef.put(file, {contentType: file.type}).then(function(){
                        location.replace('../html/home.html');
                    });
                }        
            });
        }else{
            // console.log(confirmPass, pass);
            $('#spass').css('border-bottom-color', 'red');
            $('#confirmPass').css('border-bottom-color', 'red');
        }    
    }
    
    // Modal functions
    function voteModal(){
        $('#voteModal').modal();
        $('#voteModal').modal('open');
    }

    function loginModal(){
        $('#loginModal').modal();
        $('#loginModal').modal('open');
    }

    function signUpModal(){
        $('#signUpModal').modal();
        $('#signUpModal').modal('open');
    }

    function noFileModal(){
        $('#noFile').modal();
        $('#noFile').modal('open');
    }
})();