// firebase.js — Firebase init + Firestore helpers

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAxiKlXg2RkeSdSf89vN_JknjqI8ogZ0mE",
  authDomain: "guilded-by-memories.firebaseapp.com",
  projectId: "guilded-by-memories",
  storageBucket: "guilded-by-memories.firebasestorage.app",
  messagingSenderId: "258050673040",
  appId: "1:258050673040:web:3fa28bfaf1e615b2618b15"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const COLLECTION = "leaderboard";

/**
 * Lưu kết quả người chơi lên Firestore
 * @param {string} name - Tên người chơi
 * @param {number} score - Điểm số
 * @param {number} timeSeconds - Thời gian hoàn thành (giây) — càng thấp càng tốt
 * @param {number} playCount - Lần chơi thứ mấy
 */
export async function saveScore(name, score, timeSeconds, playCount) {
  try {
    await addDoc(collection(db, COLLECTION), {
      name,
      score,
      timeSeconds,   // dùng để sort: cùng điểm → thời gian thấp hơn xếp trước
      playCount,
      createdAt: serverTimestamp()  // dùng để sort: cùng điểm + cùng time → ai chơi trước xếp trước
    });
    console.log("✅ Score saved!");
  } catch (e) {
    console.error("❌ Save failed:", e);
  }
}

/**
 * Lấy toàn bộ leaderboard, sort đúng rule:
 * 1. score DESC (điểm cao hơn xếp trước)
 * 2. timeSeconds ASC (cùng điểm → thời gian ít hơn xếp trước)
 * 3. createdAt ASC (cùng điểm + cùng time → chơi trước xếp trước)
 */
export async function fetchLeaderboard() {
  try {
    // Firestore chỉ cho orderBy nhiều field nếu có composite index
    // Sort chính bằng Firestore, sort phụ bằng JS để tránh cần index phức tạp
    const q = query(
      collection(db, COLLECTION),
      orderBy("score", "desc"),
      orderBy("timeSeconds", "asc"),
      orderBy("createdAt", "asc")
    );

    const snapshot = await getDocs(q);
    const data = [];

    snapshot.forEach(doc => {
      data.push({ id: doc.id, ...doc.data() });
    });

    return data;
  } catch (e) {
    console.error("❌ Fetch failed:", e);
    return [];
  }
}