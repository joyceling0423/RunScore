import { initializeApp } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js";

import {
    getDatabase,
    ref,
    onValue,
    runTransaction
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-database.js";


// ===============================
// Firebase 設定
// ===============================

const firebaseConfig = {
    apiKey: "AIzaSyCrhw9801HH1Od2nxceP7MNFHm4e6A6BZI",
    authDomain: "runscore-d0d68.firebaseapp.com",
    databaseURL: "https://runscore-d0d68-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "runscore-d0d68",
    storageBucket: "runscore-d0d68.firebasestorage.app",
    messagingSenderId: "782511712945",
    appId: "1:782511712945:web:bd3d0bce0ae37328145090"
};


// ===============================
// 啟動 Firebase
// ===============================

const app = initializeApp(firebaseConfig);

const database = getDatabase(app);


// ===============================
// 找到所有組別
// ===============================

const teams = document.querySelectorAll(".team-card");


// ===============================
// Firebase 分數資料
// ===============================

const scoresRef = ref(database, "scores");


// ===============================
// 即時監聽所有組別分數
// ===============================

onValue(scoresRef, (snapshot) => {

    const scores = snapshot.val() || {};

    teams.forEach((team, index) => {

        const scoreElement = team.querySelector(".score");

        const score = scores["team" + (index + 1)] || 0;

        scoreElement.textContent = score + " 分";

    });

});


// ===============================
// 初始化分數
// ===============================

teams.forEach((team, index) => {

    const teamNumber = index + 1;

    const teamRef = ref(database, "scores/team" + teamNumber);

    runTransaction(teamRef, (currentScore) => {

        if (currentScore === null) {
            return 0;
        }

        return currentScore;

    });

});


// ===============================
// +5 / -5 按鈕
// ===============================

teams.forEach((team, index) => {

    const teamNumber = index + 1;

    const teamRef = ref(database, "scores/team" + teamNumber);


    // +5

    const plusButton = team.querySelector(".plus");

    plusButton.addEventListener("click", () => {

        runTransaction(teamRef, (currentScore) => {

            return (currentScore || 0) + 5;

        });

    });


    // -5

    const minusButton = team.querySelector(".minus");

    minusButton.addEventListener("click", () => {

        runTransaction(teamRef, (currentScore) => {

            return (currentScore || 0) - 5;

        });

    });

});
