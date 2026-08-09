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
// 启动 Firebase
// ==========================================

const app = initializeApp(firebaseConfig);

const database = getDatabase(app);


// ==========================================
// Firebase 分数位置
// ==========================================

const scoresRef = ref(database, "scores");


// ==========================================
// 找到网页上的组别
// ==========================================

const teams = document.querySelectorAll(".team-card");


// ==========================================
// 储存目前分数
// ==========================================

let currentScores = {};


// ==========================================
// 组别名称
// ==========================================

const teamNames = {};

teams.forEach((team, index) => {

    const teamNumber = index + 1;

    const nameElement =
        team.querySelector(".team-name");

    teamNames[teamNumber] =
        nameElement.textContent.trim();

});


// ==========================================
// 即时读取 Firebase
// ==========================================

onValue(scoresRef, (snapshot) => {

    const data = snapshot.val() || {};

    currentScores = {};

    teams.forEach((team, index) => {

        const teamNumber = index + 1;

        const score =
            Number(data["team" + teamNumber]) || 0;

        currentScores[teamNumber] = score;


        // 更新网页上的分数

        const scoreElement =
            team.querySelector(".score");

        scoreElement.textContent =
            score + " 分";

    });


    // 更新排行榜

    updateRanking();

});


// ==========================================
// 初始化 Firebase 分数
// ==========================================

teams.forEach((team, index) => {

    const teamNumber = index + 1;

    const teamRef =
        ref(database, "scores/team" + teamNumber);


    runTransaction(teamRef, (currentScore) => {

        if (currentScore === null) {

            return 0;

        }

        return currentScore;

    });

});


// ==========================================
// +5 / -5
// ==========================================

teams.forEach((team, index) => {

    const teamNumber = index + 1;

    const teamRef =
        ref(database, "scores/team" + teamNumber);


    // -------------------------
    // +5
    // -------------------------

    const plusButton =
        team.querySelector(".plus");

    plusButton.addEventListener("click", () => {

        plusButton.disabled = true;

        runTransaction(teamRef, (currentScore) => {

            return (Number(currentScore) || 0) + 5;

        }).finally(() => {

            setTimeout(() => {

                plusButton.disabled = false;

            }, 300);

        });

    });


    // -------------------------
    // -5
    // -------------------------

    const minusButton =
        team.querySelector(".minus");

    minusButton.addEventListener("click", () => {

        minusButton.disabled = true;

        runTransaction(teamRef, (currentScore) => {

            return (Number(currentScore) || 0) - 5;

        }).finally(() => {

            setTimeout(() => {

                minusButton.disabled = false;

            }, 300);

        });

    });

});


// ==========================================
// 自动排行榜
// ==========================================

function updateRanking() {

    const rankingElement =
        document.getElementById("ranking");


    if (!rankingElement) {

        return;

    }


    // 把所有组别整理成数组

    const rankingData =
        Object.keys(currentScores).map((teamNumber) => {

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


    // 清空旧排行榜

    rankingElement.innerHTML = "";


    // 建立新的排行榜

    rankingData.forEach((team, index) => {

        const item =
            document.createElement("div");

        item.className =
            "ranking-item";


        // 名次

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
