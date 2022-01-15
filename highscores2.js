let div = document.getElementById("div_highScores");

if (localStorage !== null) {

  let arrHighScore = [{ key: 'A', value: 0 }];

  for (var i = 0; i < localStorage.length; i++) {
    arrHighScore[i] = {
      key: localStorage.key(i),
      value: localStorage.getItem(localStorage.key(i))
    }
    // console.log(localStorage.key(i));
    // arrHighScore[i].key=localStorage.key(i);
    // arrHighScore[i].value=localStorage.getItem(localStorage.key(i));
  }

  arrHighScore.sort(function (a, b) { return b.value - a.value });

  console.log(arrHighScore);

  for (var i = 0; i < localStorage.length; i++) {
    let num = i + 1;
    div.innerHTML += '<br><p>' + num + '-' + arrHighScore[i].key + ': ' + arrHighScore[i].value + ' </p>';

  }
}
