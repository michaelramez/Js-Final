
let mydiv = document.getElementById("div_highScores");

if (localStorage != null) {
  for (var i=0; i < localStorage.length; i++)
  {
      mydiv.innerHTML += '<br><p>- '+localStorage.key(i)+': '+localStorage.getItem(localStorage.key(i))+' </p>';
   }
 }

 

