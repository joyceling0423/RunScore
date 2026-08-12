import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js";

import {
    getDatabase,
    ref,
    onValue,
    runTransaction
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-database.js";


// ==========================================
// Firebase Configuration
// ==========================================

const firebaseConfig = {
    apiKey: "AIzaSyCrhw9801HH1Od2nxceP7MNFHm4e6A6BZI",
    authDomain: "runscore-d0d68.firebaseapp.com",
    databaseURL: "https://runscore-d0d68-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "runscore-d0d68",
    storageBucket: "runscore-d0d68.firebasestorage.app",
    messagingSenderId: "782511712945",
    appId: "1:782511712945:web:bd3d0bce0ae37328145090"
};


// ==========================================
// 初始化 Firebase
// ==========================================

const app = initializeApp(firebaseConfig);

const database = getDatabase(app);


// ==========================================
// Firebase 位置
// ==========================================

const settingsRef =
    ref(database, "settings/teamCount");

const scoresRef =
    ref(database, "scores");


// ==========================================
// 当前组数
// ==========================================

let teamCount = 0;


// ==========================================
// 当前分数
// ==========================================

let currentScores = {};


// ==========================================
// 组别名称
// ==========================================

let teamNames = {};


// ==========================================
// 读取组数
// ==========================================

onValue(settingsRef, (snapshot) => {

    const count = Number(snapshot.val());

    console.log("Firebase teamCount =", count);

    if (!Number.isInteger(count) || count < 1) {
        return;
    }

    teamCount = count;

    createTeams();

});


// ==========================================
// 建立组别
// ==========================================

function createTeams() {

    const teamsContainer =
        document.getElementById("teams");

    teamsContainer.innerHTML = "";

    teamNames = {};


    for (let i = 1; i <= teamCount; i++) {

        const teamCard =
            document.createElement("div");

        teamCard.className =
            "team-card";

        teamCard.dataset.team = i;


        const teamName =
            `第${numberToChinese(i)}组`;


        teamNames[i] =
            teamName;


        teamCard.innerHTML = `

            <div class="team-name">

                ${teamName}

            </div>


            <div class="score">

                0 分

            </div>

            <div class="buttons">

<button class="plus" data-change="5">
+5
</button>

<button class="plus" data-change="3">
+3
</button>

<button class="plus" data-change="1">
+1
</button>

<button class="minus" data-change="-5">
-5
</button>

<button class="minus" data-change="-10">
-10
</button>

</div>


</div>

          

        `;


        teamsContainer.appendChild(teamCard);

    }


    attachButtons();

    loadScores();

    updateRanking();

}


// ==========================================
// 中文数字
// ==========================================

function numberToChinese(number) {

    const chineseNumbers = [

        "零",
        "一",
        "二",
        "三",
        "四",
        "五",
        "六",
        "七",
        "八",
        "九",
        "十",
        "十一",
        "十二",
        "十三",
        "十四",
        "十五",
        "十六",
        "十七",
        "十八",
        "十九",
        "二十"

    ];


    if (number <= 20) {

        return chineseNumbers[number];

    }


    return number;

}


// ==========================================
// 读取分数
// ==========================================

function loadScores() {

    onValue(scoresRef, (snapshot) => {

        const data =
            snapshot.val() || {};


        currentScores = {};


        for (let i = 1; i <= teamCount; i++) {

            const score =
                Number(data["team" + i]) || 0;


            currentScores[i] =
                score;


            const teamCard =
                document.querySelector(
                    `.team-card[data-team="${i}"]`
                );


            if (teamCard) {

                const scoreElement =
                    teamCard.querySelector(".score");


                scoreElement.textContent =
                    score + " 分";

            }

        }


        updateRanking();

    });

}


// ==========================================
// 建立 +5 / -5 按钮功能
// ==========================================

function attachButtons() {

  const teams = document.querySelectorAll(".team-card");

  teams.forEach((team) => {

    const teamNumber = Number(team.dataset.team);

    const teamRef = ref(
      database,
      "scores/team" + teamNumber
    );

    const buttons = team.querySelectorAll("button[data-change]");

    buttons.forEach((button) => {

      const change = Number(button.dataset.change);

      button.addEventListener("click", () => {

        button.disabled = true;

        runTransaction(
          teamRef,
          (currentScore) => {

            return (
              Number(currentScore) || 0
            ) + change;

          }
        ).finally(() => {

          setTimeout(() => {
            button.disabled = false;
          }, 300);

        });

      });

    });

  });

}


// ==========================================
// 自动排行榜
// ==========================================

function updateRanking() {

    const rankingElement =
        document.getElementById("ranking");


    if (!rankingElement) {

        return;

    }


    const rankingData =
        Object.keys(currentScores)
            .map((teamNumber) => {

                return {

                    teamNumber:
                        Number(teamNumber),

                    name:
                        teamNames[teamNumber],

                    score:
                        currentScores[teamNumber]

                };

            });


    // 分数由高到低

    rankingData.sort((a, b) => {

        return b.score - a.score;

    });


    rankingElement.innerHTML = "";


    rankingData.forEach((team, index) => {

        const item =
            document.createElement("div");

        item.className =
            "ranking-item";


        let rankText =
            (index + 1) + "位";


        if (index === 0) {

            rankText = "🥇";

        }

        else if (index === 1) {

            rankText = "🥈";

        }

        else if (index === 2) {

            rankText = "🥉";

        }


        item.innerHTML = `

            <div class="rank-left">

                <div class="rank-number">

                    ${rankText}

                </div>


                <div class="rank-name">

                    ${team.name}

                </div>

            </div>


            <div class="rank-score">

                ${team.score} 分

            </div>

        `;


        rankingElement.appendChild(item);

    });

}
