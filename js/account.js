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
        var ref = firebase.database().ref('Users/' + localStorage.getItem('uid'));
        ref.on('value', function(snapshot){
            var data = snapshot.val();
            $('#name').text(data.FirstName + " " + data.LastName);

            $('#fname').attr('placeholder', data.FirstName);
            $('#lname').attr('placeholder', data.LastName);
            $('#username').attr('placeholder', data.Username);
            $('#email').attr('placeholder', data.Email);
            $('#pass').attr('placeholder', data.Password);
        });

        var storageRef = firebase.storage().ref('User Photos/' + localStorage.getItem('uid'));
        storageRef.getDownloadURL().then(function(url){
            $('#photo').attr('src', url);
        })


        // Button Clicks
        $('#change').on('click', change);
        $('#logout').on('click', logout);
    }

    function change(){
        var fname = $('#fname').val();
        var lname = $('#lname').val();
        var email = $('#email').val();
        var username = $('#username').val();
        var pass = $('#pass').val();
        var fileInput = $('#newPhoto')[0];
        var file = fileInput.files[0];

        var ref = firebase.database().ref('Users/' + localStorage.getItem('uid'));
        ref.on('value', function(snapshot){
            var data = snapshot.val();
            
            if(!fname){
               fname = data.FirstName;
            }

            if(!lname){
                lname = data.LastName;
            }

            if(!email){
                email = data.Email;
            }

            if(!username){
                username = data.Username;
            }

            if(!pass){
                pass = data.Password;
            }

            var update = {
                FirstName:fname,
                LastName:lname,
                Username:username,
                Email:email,
                Password:pass,
            }

            console.log(data.Email, data.Password);

            firebase.auth().signInWithEmailAndPassword(data.Email, data.Password).then(function(firebaseUser){
                firebase.auth().currentUser.updateEmail(email);
                firebase.auth().currentUser.updatePassword(pass);
            });

            firebase.database().ref('Users/' + localStorage.getItem('uid')).update(update);
            if(!file){
                $('#updateModal').modal();
                $('#updateModal').modal('open');
            }else{
                firebase.storage().ref('User Photos/' + localStorage.getItem('uid')).put(file, {contentType: file.type}).then(function(){
                    $('#updateModal').modal();
                    $('#updateModal').modal('open');
                    return;
                });
            }
        });
    }

    function logout(){
        firebase.auth().signOut().then(function(){
            location.replace('../html/landing.html');
        })
    }
})();