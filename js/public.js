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
    href = href.split("?code=");
    var id = href[1];

    imgURL = null;

    function init(){
        firebase.initializeApp(config);
        firebase.auth().onAuthStateChanged((user) => {
            if(user === null){
                $('.nav').addClass('hide');
            }
        });

        $('#name').text(localStorage.getItem('username'));

        var ref = firebase.database().ref('Users');
        ref.once('value', (snapshot) => {
            var data = snapshot.val();
            for(var i in data){
                for(var x in data[i].Polls){
                    if(data[i].Polls[x].SecurityType === "public"){
                        firebase.storage().ref('User Photos/' + i).getDownloadURL().then((url) => {
                            console.log(url);
                            var div = document.createElement("div");
                            div.classList.add('card')
                            div.classList.add('poll');

                            // div
                            var divTwo = document.createElement("div");
                            divTwo.classList.add("row");

                            // img
                            var img = document.createElement("img");
                            $(img).attr('src', url);
                            img.classList.add('col');
                            img.classList.add('s4');
                            img.classList.add('m1');
                            img.classList.add('circle');

                            // h5
                            var name = document.createElement('h5');
                            name.textContent = data[i].Username;
                            name.classList.add("col");
                            name.classList.add('s8');
                            name.classList.add('m11');
                            name.classList.add('truncate');

                            // img and h5 container div
                            var divThree = document.createElement("div");
                            divThree.classList.add('row');
                            divThree.classList.add("info");
                            divThree.appendChild(img);
                            divThree.appendChild(name);

                            // h3
                            var a = document.createElement("h3");
                            a.classList.add("col");
                            a.classList.add("s12");
                            a.classList.add('m8');
                            a.textContent = data[i].Polls[x].Title;

                            // h5 tag
                            var h5 = document.createElement("h5");
                            h5.textContent = "Vote Code: " + data[i].Polls[x].Code;
                            h5.classList.add("col");
                            h5.classList.add("s12");
                            h5.classList.add('m12')

                            // Vote Btn
                            var vote = document.createElement("button");
                            vote.classList.add('col');
                            vote.classList.add('s6');
                            vote.classList.add('m2');
                            vote.classList.add('vote');
                            vote.id = x + "vote";
                            vote.textContent = "Vote!";

                            // Results Btn 
                            var results = document.createElement("button");
                            results.classList.add("col");
                            results.classList.add("s6");
                            results.classList.add("m2");
                            results.classList.add("results");
                            results.id = x + "results";
                            results.textContent = "Results"

                            
                            divTwo.appendChild(a);
                            divTwo.appendChild(vote);
                            divTwo.appendChild(results);

                            // Append Data Elements
                            div.appendChild(divThree);
                            div.appendChild(divTwo);
                            div.appendChild(h5);

                            $('.polls').append(div); 
                        });
                    }
                }
            }
        });

        $('#logout').on('click', logout);
        $(document.body).on('click', '.vote', vote);
        $(document.body).on('click', '.results', results);
    }

    function vote(){
        var id = $(this).attr('id');
        id = id.split('vote');
        id = id[0];

        location.replace('../html/poll.html?key=' +  id + "&code=NO_CODE");
    }

    function results(){
        var id = $(this).attr('id');
        id = id.split('results');
        id = id[0];

        location.replace('../html/results.html?key=' + id + "&code=NO_CODE");
    }

    function logout(){
        firebase.auth().signOut().then(function(){
            location.replace('../html/landing.html');
        });
    }
})();