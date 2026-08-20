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



/*====================================================
                     スライダー
   =====================================================*/

  const container = document.querySelector('.gallery-container'); //スライダー全体を包む .gallery-container を取得します
  const slidesContainer = container.querySelector('.slides'); //スライドが横一列に並んでいる中枠（.slides）を取得します。
  const slides = Array.from(container.querySelectorAll('.slide')); //スライドが横一列に並んでいる中枠（.slides）を取得します。
  const radios = container.querySelectorAll('input[name="slider"]'); //連動させるラジオボタン（name="slider"）をすべて取得します
  const len = slides.length; 
  // 1. スライドリストを1枚ずつループ処理
  slides.forEach(function(slide) {
    slidesContainer.insertBefore(slide.cloneNode(true), slidesContainer.firstChild);//insertBefore で、現在のスライドの複製を中枠の一番最初（先頭）に
    slidesContainer.appendChild(slide.cloneNode(true));//appendChild で、現在のスライドの複製を中枠の「一番最後（末尾）」に挿入します。
  });
//これにより３枚だったものが、前後にコピー計9枚に
  container.querySelectorAll('.slide').forEach(function(s) {
    s.style.flex = "0 0 33.3%";//33と３３．３はかなり違うのでこの数値
  });//増えた分も含めた画像対して横幅を画面に並ぶサイズに設定
  let activeIndex = len; // 値が変わるためletに変更
  function move(index, animated) {
    const isAnimated = (animated !== false); //animated）が false でない限りボタンクリックで0.4秒かけて滑らかに動く
    slidesContainer.style.transition = isAnimated ? 'transform 0.4s ease-in-out' : 'none';
    slidesContainer.style.transform = 'translateX(-' + (index * 33.3) + '%)';//現在の位置番号にスライド1枚分の幅33.3を掛け算し、スライド全体を左方向へ移動させます。
    // UI（ラジオボタン）の連動
    const uiIndex = (index % len + len) % len; 
    radios[uiIndex].checked = true;
  }
  move(activeIndex, false);//最後に move(activeIndex, false); を呼び出し、ページを開いたら中央のオリジナル1枚目へ移動
  // 3. 無限ループ用のワープ処理
  slidesContainer.addEventListener('transitionend', function() {
    if (activeIndex < len) activeIndex += len;//（activeIndex < len）まで行った場合は、位置番号をオリジナルに+ lenで進めます。
    if (activeIndex >= len * 2) activeIndex -= len;//activeIndex >= len * 2）まで行った場合は、位置番号をオリジナルに- lenで戻します。
    move(activeIndex, false);//move(activeIndex, false) を実行することで中央の画像へ移動
  });
  //イベントバブリング親要
  container.addEventListener('click', function(e) {  
    // 戻るボタン
    if (e.target.closest('.prev')) {
      activeIndex--;// --デクリメント演算子です　インクリメントの逆です
      move(activeIndex);// 増減した番号の位置へスライドを動かす
    }
    // 次へボタン
    if (e.target.closest('.next')) {
      activeIndex++;
      move(activeIndex);
    }
  });
