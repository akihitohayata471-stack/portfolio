/* ==========================================
                 ローディング
   ========================================== */
 const Loader = document.querySelector('.page-loader');
const loaderImg = document.querySelector('.loader-img');
let timeoutId; // タイマーIDのみ再代入するため let を使用
// ローダーを非表示にする関数
function HideLoader() {
  Loader.classList.remove('is-active');
}
// ローダーを表示する関数（外部呼び出し用）
function triggerLoader() {
  Loader.classList.add('is-active');
  // 画像のアニメーションをリセットして動かす
  if (loaderImg) {
    loaderImg.classList.add('active');
  }
  // 2.5秒後に強制終了する保険ループしてビビったので実装
  timeoutId = setTimeout(HideLoader, 2500);
};
// リンククリックの監視
document.addEventListener('click', function(event) {
  const anchor = event.target.closest('a');
  if (!anchor) return;  // aタグ以外のクリックを止める
  triggerLoader();
});
/* ==========================================
                     モーダル
   ========================================== */
// すべての「夜市を開くボタン」を取得
const openButtons = document.querySelectorAll('.market-btn');
// すべての「閉じるボタン」を取得
const closeButtons = document.querySelectorAll('.modal-close');
// すべての「モーダル（ポップアップ）」を取得
const modals = document.querySelectorAll('.modal');
// 1. 開くボタンがクリックされたときの処理（中継なし版）
openButtons.forEach(function(button) {
  button.addEventListener('click', function() {
    // ボタンのid（例: "btn-ningxia"）から、夜市名（"ningxia"）だけを切り出す
    const marketName = button.id.replace('btn-', '');
    // その夜市名がついたモーダル（例: .modal.modal-ningxia）を直接探す
    const targetModal = document.querySelector('.modal.' + marketName).classList.add('is-active');
  });
});
// 2. 閉じるボタン（×）がクリックされたときの処理
closeButtons.forEach(function(button) {
  button.addEventListener('click', function() {
    // クリックされた閉じるボタンの一番近い親要素（モーダル全体）を探してクラスを消す
    const openModal = button.closest('.modal');
    if (openModal) {
      openModal.classList.remove('is-active');
    }
  });
});
modals.forEach(function(modal) {
  modal.addEventListener('click', function(event) {
    // クリックされたのが、中の箱ではなく「外側の黒背景自体」だった場合だけ閉じる
    if (event.target === modal) {
      modal.classList.remove('is-active');
    }
  });
});


/* ==========================================
         ハンバーガーメニューの制御
   ========================================== */
  const menuBtn = document.querySelector('.hamburger-btn');
  const navMenu = document.getElementById('sp-menu');
  const navItems = document.querySelectorAll('.nav-item');

  // メニューを閉じる共通処理1
  function closeMenu() {
    menuBtn.classList.remove('is-open');
    navMenu.classList.remove('is-open');
  }
  // メニューを開閉する処理
  function toggleMenu() {
     menuBtn.classList.toggle('is-open');
    navMenu.classList.toggle('is-open');
  }
  // リンククリック時の処理
  function navClick(e) {
    const href = e.currentTarget.getAttribute('href');
    e.preventDefault();// リンクをクリックしたらブラウザが次のページへ切り替える挙動を一時的にブロック
    closeMenu();//先ほど定義した closeMenu() 1をここで呼び出し、開いているスマホメニューを閉じるアニメーションを開始させます。
      triggerLoader();
    // 0.8秒のアニメーションを待って遷移
    setTimeout(function() {
      location.href = href;
    }, 800);
  }
  // イベントリスナーの登録
  menuBtn.addEventListener('click', toggleMenu);
  navItems.forEach(function(item) {
    item.addEventListener('click', navClick);
  });

