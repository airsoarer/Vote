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
    var id = href.split("?key=");
    id = id[1];
    id = id.split("&code=");
    code = id[1];
    code = String(code);
    id = id[0];
    
    function init(){
        firebase.initializeApp(config);
        firebase.auth().onAuthStateChanged((user) => {
            if(user != null){
                $('#name').text(localStorage.getItem('username'));
            }else{
                $('#nav').addClass("hide");
            }
        })

        var ref = firebase.database().ref('Users/' + localStorage.getItem('uid') + '/Polls/' + id);
        ref.on('value', function(snapshot){
            var data = snapshot.val();
            $('#title').text(data.Title);
            $('#code').text("Vote Code: " + data.Code);
            $('#question').text(data.Question);

            for(var i in data.Choices){
                // Label
                var label = document.createElement("label");
                label.classList.add("col");
                label.classList.add("s12");
                label.classList.add("m7");
                label.classList.add("offset-m5");

                // Span 
                var span = document.createElement("span");
                span.textContent = data.Choices[i];

                if(data.Choices[i].indexOf(" ") >= 0){
                    var id = data.Choices[i].split(" ");
                    var idTxt = "";
                    for(var i = 0; i < id.length; i++){
                        idTxt += id[i] + "-"
                    }
                }

                // Input
                var input = document.createElement("input");
                $(input).attr('name', 'choice');
                $(input).attr('type', 'radio');
                $(input).attr('id', idTxt);
                $(input).attr('class', 'choice')

                label.appendChild(input);
                label.appendChild(span);

                $('.choices').append(label);
            }
        })

        $('#btn').on('click', submit);
    }

    function submit(){
        var ref = firebase.database().ref('Users/' + localStorage.getItem('uid') + '/Polls/' + id);
        ref.once('value', function(snapshot){
            var data = snapshot.val();

            var obj = data.Points;
            obj.Votes = obj.Votes + 1;

            for(var i in data.Choices){
                // console.log(data.Choices[i]);
                obj[data.Choices[i]] = obj[data.Choices[i]] + 1;
                if(data.Choices[i].indexOf(" ") >= 0){
                    var temp = data.Choices[i].split(" ");
                    // console.log(temp.length);
                    var idTxt = "";
                    for(var i = 0; i < temp.length; i++){
                        idTxt += temp[i] + "-"
                        // console.log(idTxt);
                    }
                }

                console.log(data.Choices[i]);

                if($('#' + idTxt).prop('checked') === true){
                    console.log(obj);
                    // obj[data.Choices[i]] = obj[data.Choices[i]] + 1;
                    // console.log("working", obj);
                    firebase.database().ref('Users/' + localStorage.getItem('uid') + '/Polls/' + id + '/Points').update(obj).then(function(){
                        location.replace("../html/results.html?key=" + id + "&code=" + code);
                        return;
                    });
                }else{
                    console.log("no");
                }
            }
        })
    }
})();