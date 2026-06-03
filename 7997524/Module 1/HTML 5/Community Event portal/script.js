function validatePhone(){

    let phone =
    document.getElementById("phone").value;

    if(phone.length != 10){

        alert("Phone number must be 10 digits");

    }

}

function showFee(){

    let fee =
    document.getElementById("eventType").value;

    document.getElementById("fee").innerHTML =
    "Event Fee: ₹" + fee;

    localStorage.setItem("selectedEvent", fee);

}

function submitForm(){

    alert("Registration Successful!");

}

function enlargeImage(img){

    if(img.style.width == "400px"){

        img.style.width = "250px";

    }else{

        img.style.width = "400px";

    }

}

function countCharacters(){

    let text =
    document.getElementById("message").value;

    document.getElementById("charCount").innerHTML =
    "Characters: " + text.length;

}

window.onload = function(){

    let saved =
    localStorage.getItem("selectedEvent");

    if(saved){

        document.getElementById("eventType").value =
        saved;

    }

}