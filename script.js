// 初始分数
let scores = [0, 0, 0];


// 找到所有组别卡片
const teams = document.querySelectorAll(".team-card");


teams.forEach((team, index) => {

    let scoreText = team.querySelector(".score");

    let plusButton = team.querySelector(".plus");

    let minusButton = team.querySelector(".minus");


    // +5按钮

    plusButton.addEventListener("click", function(){

        scores[index] += 5;

        scoreText.innerHTML = scores[index] + " 分";

    });


    // -5按钮

    minusButton.addEventListener("click", function(){

        scores[index] -= 5;

        scoreText.innerHTML = scores[index] + " 分";

    });


});
