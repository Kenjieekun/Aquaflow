document.addEventListener("DOMContentLoaded", () => {

    document.querySelectorAll(".toggle-password").forEach(icon => {

        icon.addEventListener("click", function(){

            const input = this.parentElement.querySelector("input");

            if(input.type === "password"){
                input.type = "text";
                this.classList.replace("fa-eye","fa-eye-slash");
            }else{
                input.type = "password";
                this.classList.replace("fa-eye-slash","fa-eye");
            }

        });

    });

});