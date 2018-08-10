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

    // Array to make code for polls
    arr = [ '1', '2', '3', '4', '5', '6', '7', '8', '9','0'];

    choices = 2;
    creator;
    imgURL;

    function init(){
        firebase.initializeApp(config);
        firebase.auth().onAuthStateChanged((user) => {
            if(user != null){
                $('.noneLogged').addClass('hide');
                var ref = firebase.database().ref('Users/' + localStorage.getItem('uid'));
                ref.once('value', function(snapshot){
                    var data = snapshot.val();
                    
                    // Set creator variable 
                    creator = data.Username;
    
                    // Append username
                    $('#name').text(data.Username);
                    localStorage.setItem('username', data.Username);
                    $('#name').text(localStorage.getItem('username'));
                });
    
                var refTwo = firebase.database().ref('Users/' + localStorage.getItem('uid') + '/Polls');
                refTwo.once("value", function(snapshot){
                    var data = snapshot.val();
                    for(var i in data){
                        if(data[i].Status === "ongoing"){
                            $('.noOngoing').addClass('hide');
                            // Create poll view in html for onging polls
                            // Poll div
                            var div = document.createElement("div");
                            div.classList.add('poll');
                            div.id = i;
    
                            // div
                            var divTwo = document.createElement("div");
                            divTwo.classList.add("row");
    
                            // A tag to link
                            var a = document.createElement("h3");
                            a.classList.add("col");
                            a.classList.add("s12");
                            a.classList.add('m4');
                            a.textContent = data[i].Title;
    
                            // h5 tag
                            var h5 = document.createElement("h5");
                            h5.textContent = "Vote Code: " + data[i].Code;
                            h5.classList.add("col");
                            h5.classList.add("s12");
                            h5.classList.add('m12')
    
                            // End Poll Btn
                            var end = document.createElement("button");
                            end.classList.add('col');
                            end.classList.add('s6');
                            end.classList.add('m2');
                            end.classList.add('end');
                            end.id = i + "end";
                            end.textContent = "End Poll"
    
                            // Vote Btn
                            var vote = document.createElement("button");
                            vote.classList.add('col');
                            vote.classList.add('s6');
                            vote.classList.add('m2');
                            vote.classList.add('vote');
                            vote.id = i + "vote";
                            vote.textContent = "Vote!";
    
                            // Results Btn 
                            var results = document.createElement("button");
                            results.classList.add("col");
                            results.classList.add("s6");
                            results.classList.add("m2");
                            results.classList.add("results");
                            results.id = i + "results";
                            results.textContent = "Results"

                            // Delete Btn
                            var del = document.createElement("button");
                            del.classList.add("col");
                            del.classList.add('s6');
                            del.classList.add("m2");
                            del.classList.add("del");
                            del.id = i + "del";
                            del.textContent = "Delete";
    
                            divTwo.append(a);
                            divTwo.appendChild(vote);
                            divTwo.appendChild(results);
                            divTwo.appendChild(end);
                            divTwo.appendChild(del);
    
                            // Append Data Elements
                            div.appendChild(divTwo);
                            div.appendChild(h5);
    
                            $('.ongoing').append(div);
                        }else{
                            $('.noEnded').addClass('hide');
                            // Create poll view in html for onging polls
                            // Poll div
                            var div = document.createElement("div");
                            div.classList.add('poll');
    
                            // A tag to link
                            var a = document.createElement("a");
                            a.classList.add("col");
                            a.classList.add("s12");
                            a.classList.add('m10');
                            $(a).attr('href', '../html/poll.html?key=' + i + '&code=NO_CODE');
                            a.textContent = data[i].Title;
    
                            // Results Btn
                            var vote = document.createElement("button");
                            vote.classList.add('col');
                            vote.classList.add('s12');
                            vote.classList.add('m2');
                            vote.classList.add('results');
                            vote.id = i + "results";
                            vote.textContent = "Results";
    
                            // Append Data Elements
                            div.appendChild(a);
                            div.appendChild(vote);
    
                            $('.ended').append(div);
                        }
                    }

                    // refTwo.off();
                });
    
                var storageRef = firebase.storage().ref('User Photos/' + localStorage.getItem('uid'));
                storageRef.getDownloadURL().then(function(url){
                    imgURL = url;
                });

            }else{
                $('.noneLogged').removeClass('hide');
                $('.noneLogged').addClass('show');
                $('.wrapper').addClass('hide');
            }
        });

        // Button clicks
        $('#logout').on('click', logout);
        $('#newPoll').on('click', pollModal);
        $('#create').on('click', create);
        $('.addChoice').on('click', addChoice);
        $(document.body).on('click', '.end', endPoll);
        $(document.body).on('click', '.vote', vote);
        $(document.body).on('click', '.results', results);
        $(document.body).on('click', '.del', del);
    }

    function del(){
        var id = $(this).attr('id');
        id = id.split("del");
        id = id[0];
        
        firebase.database().ref('Users/' + localStorage.getItem('uid') + '/Polls/' + id).remove();
        $('#' + id).remove();
    }

    function results(){
        var id = $(this).attr('id');
        id = id.split('results');
        id = id[0];

        location.replace('../html/results.html?key=' + id + "&code=NO_CODE");
    }

    function endPoll(){
        var id = $(this).attr('id');
        id = id.split('end');
        id = id[0];
        var ref = firebase.database().ref('Users/' + localStorage.getItem('uid') + '/Polls/' + id);
        ref.on('value', function(snapshot){
            var data = snapshot.val();
            var obj = {
                Title:data.Title,
                Status:"ended",
                Question:data.Question,
                Code:data.Code,
                Choices:data.Choices,
            };

            ref.update(obj);
            return;
        });
    }

    function vote(){
        var id = $(this).attr('id');
        id = id.split('vote');
        id = id[0];

        location.replace('../html/poll.html?key=' +  id + "&code=NO_CODE");
    }

    function addChoice(){
        // Incrememnt Choices
        choices++;

        // Choice Label
        var label = document.createElement("label");
        $(label).attr('for','choice' + String(choices));
        label.classList.add('col');
        label.classList.add('m10');
        label.classList.add('offset-m2');
        label.textContent = "Choice " + String(choices);

        // Choice input
        var input = document.createElement('input');
        $(input).attr('type', 'text');
        input.classList.add('col');
        input.classList.add('m10');
        input.classList.add('offset-m2');
        input.id = "choice" + String(choices);

        $('.choices').append(label);
        $('.choices').append(input);
    }

    function create(){
        // variable to house code for poll
        var code = '';

        // Get title and quetions values
        var title = $('#title').val();
        if(title === ""){
            $('#title').css('border-color', 'red');
            return
        }
        var question = $('#question').val();
        if(question === ""){
            $('#question').css("border-color", 'red');
            return;
        }
        
        // Check if the public radio button is checked
        if($('#public').prop('checked') === true){
            var status = "public";
        }else if($('#private').prop('checked') === true){
            var status = "private";
        }else{
            $('#forgot').removeClass('hide');
            $('#forgot').addClass('show');
            return;
        }

        // Create an array to hold the choices
        var choicesArray = [];
        // Incrememnt the choices variable so the for loop works
        choices++;

        var points = {
            Votes:0,
        };

        // add value of choices to the choices array
        for(var i = 1; i < choices; i++){
            if($('#choice1').val() === ""){
                $('#choice1').css('border-color', 'red');
                return;
            }

            if($('#choice2').val() === ""){
                $('#choice2').css('border-color', 'red');
                return;
            }

            if($('#choice' + i).val().includes("#") === true || 
            $('#choice' + i).val().includes(".") === true || 
            $('#choice' + i).val().includes("$") === true ||
            $('#choice' + i).val().includes("/") === true ||
            $('#choice' + i).val().includes("[") === true ||
            $('#choice' + i).val().includes("]") === true){
                $('#choice' + i).css("border-color", 'red');
                return;
            }else{
                var choice = $('#choice' + i).val();
                choicesArray.push(choice);
                var name = $('#choice' + i).val();
                points[name] = 0;
            }
        }

        // For loop to create code variable
        for(var i = 0; i < 7; i++){
            var random = Math.floor((Math.random() * 9) + 1);
            code = code + arr[random];
        }

        var privateRef = firebase.database().ref('Users/' + localStorage.getItem('uid') + "/Polls");
        privateRef.push({
            Title:title,
            Question:question,
            Choices:choicesArray,
            Code:code,
            Status:"ongoing",
            SecurityType:status,
            Points:points,
        });

        $('#updateModal').modal();
        $('#updateModal').modal('open');

        // var ref = firebase.database().ref('')
        showNew();
    }

    function showNew(){
        $('.ongoing').empty();
        $('.ended').empty();
        var refTwo = firebase.database().ref('Users/' + localStorage.getItem('uid') + '/Polls');
        refTwo.on("value", function(snapshot){
            var data = snapshot.val();
            for(var i in data){
                if(data[i].Status === "ongoing"){
                    $('.noOngoing').addClass('hide');
                    // Create poll view in html for onging polls
                    // Poll div
                    var div = document.createElement("div");
                    div.classList.add('poll');
                    div.id = i;

                    // div
                    var divTwo = document.createElement("div");
                    divTwo.classList.add("row");

                    // A tag to link
                    var a = document.createElement("h3");
                    a.classList.add("col");
                    a.classList.add("s12");
                    a.classList.add('m4');
                    a.textContent = data[i].Title;

                    // h5 tag
                    var h5 = document.createElement("h5");
                    h5.textContent = "Vote Code: " + data[i].Code;
                    h5.classList.add("col");
                    h5.classList.add("s12");
                    h5.classList.add('m12')

                    // End Poll Btn
                    var end = document.createElement("button");
                    end.classList.add('col');
                    end.classList.add('s6');
                    end.classList.add('m2');
                    end.classList.add('end');
                    end.id = i + "end";
                    end.textContent = "End Poll"

                    // Vote Btn
                    var vote = document.createElement("button");
                    vote.classList.add('col');
                    vote.classList.add('s6');
                    vote.classList.add('m2');
                    vote.classList.add('vote');
                    vote.id = i + "vote";
                    vote.textContent = "Vote!";

                    // Results Btn 
                    var results = document.createElement("button");
                    results.classList.add("col");
                    results.classList.add("s6");
                    results.classList.add("m2");
                    results.classList.add("results");
                    results.id = i + "results";
                    results.textContent = "Results"

                    // Delete Btn
                    var del = document.createElement("button");
                    del.classList.add("col");
                    del.classList.add('s6');
                    del.classList.add("m2");
                    del.classList.add("del");
                    del.id = i + "del";
                    del.textContent = "Delete";

                    divTwo.append(a);
                    divTwo.appendChild(vote);
                    divTwo.appendChild(results);
                    divTwo.appendChild(end);
                    divTwo.appendChild(del);

                    // Append Data Elements
                    div.appendChild(divTwo);
                    div.appendChild(h5);

                    $('.ongoing').append(div);
                }else{
                    $('.noEnded').addClass('hide');
                    // Create poll view in html for onging polls
                    // Poll div
                    var div = document.createElement("div");
                    div.classList.add('poll');

                    // A tag to link
                    var a = document.createElement("a");
                    a.classList.add("col");
                    a.classList.add("s12");
                    a.classList.add('m10');
                    $(a).attr('href', '../html/poll.html?key=' + i + '&code=NO_CODE');
                    a.textContent = data[i].Title;

                    // Results Btn
                    var vote = document.createElement("button");
                    vote.classList.add('col');
                    vote.classList.add('s12');
                    vote.classList.add('m2');
                    vote.classList.add('results');
                    vote.id = i + "results";
                    vote.textContent = "Results";

                    // Append Data Elements
                    div.appendChild(a);
                    div.appendChild(vote);

                    $('.ended').append(div);
                }
            }
        });
    }

    function pollModal(){
        $('#forgot').removeClass("show");
        $('#forgot').addClass("hide");

        // Modal
        $('#pollModal').modal();
        $('#pollModal').modal('open');
    }

    function logout(){
        firebase.auth().signOut().then(function(){
            location.replace('../html/landing.html');
        });
    }
})();