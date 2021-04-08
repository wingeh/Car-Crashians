var route = document.getElementById("route")
var street1 = document.getElementById("street1")
var street2 = document.getElementById("street2")
const search = document.getElementById("search")
var menu = document.querySelector(".menu")


function currentRoute() {
    route.textContent = street1.value + " to " + street2.value
    menu.style.visibility = "hidden";
}

search.addEventListener("click", function(event) { 
    event.preventDefault()  
    currentRoute()
})

