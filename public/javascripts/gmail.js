document.querySelector("#composeBtn").addEventListener("click", function(){
    document.querySelector("#composeMail").style.right = "0%";
})
document.querySelector("#closeComposeMail").addEventListener("click", function(){
    document.querySelector("#composeMail").style.right = "-45%";
})

document.querySelector("#profilePic").addEventListener("click", function(){
    document.querySelector("#pic").click();
})

document.querySelector("#pic").addEventListener("change", function(){
    document.querySelector("#profilePicForm").submit();
})

document.querySelector("#fetchingData").addEventListener("click", function(){
    axios.get("/check")
    .then(function(response){
        console.log(response.data);
    })
})