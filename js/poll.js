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

                // Input
                var input = document.createElement("input");
                $(input).attr('name', 'choice');
                $(input).attr('type', 'radio');
                $(input).attr('id', data.Choices[i]);
                $(input).attr('class', 'choice')
                
                // Span 
                var span = document.createElement("span");
                span.textContent = data.Choices[i];

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
                if($('#' + data.Choices[i]).prop('checked') === true){
                    obj[data.Choices[i]] = obj[data.Choices[i]] + 1;
                    console.log("working", obj);
                    firebase.database().ref('Users/' + localStorage.getItem('uid') + '/Polls/' + id + '/Points').update(obj).then(function(){
                        location.replace("../html/results.html?key=" + id + "&code=" + code);
                        return;
                    });
                }
            }
        })
    }
})();