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

    var href = window.location.href;
    var id = href.split('?key=');
    id = id[1];
    id = id.split('&code=');
    var code = id[1];
    id = id[0];
    code = String(code);
    // console.log(code);


    function init(){
        firebase.initializeApp(config);
        firebase.auth().onAuthStateChanged((user) => {
            if(user === null){
                $('#nav').addClass('hide');
                $('#vote').removeClass('hide');
                $('#vote').addClass('show');
            }
        });
        
        $('#name').text(localStorage.getItem('username'));

        var ref = firebase.database().ref('Users/' + localStorage.getItem('uid') + '/Polls/' + id);
        ref.on('value', function(snapshot){
            var data = snapshot.val();
            // console.log(data);
            
            $('#title').text(data.Title + " Results");
            $('#voteCode').text("Vote Code: " + data.Code);
            $('#votes').text(data.Points.Votes + " People Voted");
        });

        var ref = firebase.database().ref('Users/' + localStorage.getItem('uid') + '/Polls/' + id + '/Points');
        ref.on('value', function(snapshot){
            var data = snapshot.val();
            var length = -1;

            for(var i in data){
                length++;
            }

            for(var i in data){
                if(i === "Votes"){
                    console.log("hello");
                }else{
                    // Div
                    var div = document.createElement("div");
                    div.classList.add("bar");
                    var percent = data[i] / data.Votes * 100;
                    var percentTxt = data[i] /data.Votes * 100 ;
                    percentTxt = Math.floor(percentTxt * 100) / 100;
                    percentTxt.toFixed(2);
                    Math.round(percentTxt);
        
                    if(percent < 10){
                        // $(div).css('width', '10%');
                        $(div).animate({
                            width: "10%"
                        }, 1000);
                    }else{
                        // $(div).css('width',  percent + '%');
                        $(div).animate({
                            width: percent + "%"
                        }, 1000);
                    }
                    
                    // hr
                    var hr = document.createElement("hr");
                    $(hr).html(i + "<br>" + " " + data[i] + " Votes" + " " + "<br>" + percentTxt + "%");

                    div.appendChild(hr);

                    $('.bars').append(div);
                }
            }
        });

        $('#logout').on('click', logout);
    }

    function logout(){
        firebase.auth().signOut().then(function(){
            location.replace('../html/landing.html');
        })
    }
})();