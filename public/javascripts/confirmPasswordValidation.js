console.log('inside my validation js');

function validatePassword(){
    const password = document.getElementById("inputpassword")
    , confirm_password = document.getElementById("confirmpassword");
  
    if(password.value != confirm_password.value) {
    confirm_password.setCustomValidity("Passwords Don't Match");
    return false;
  } else {
    confirm_password.setCustomValidity('');
    return true;
  }
}

//password.onchange = validatePassword;
//confirm_password.onkeyup = validatePassword;