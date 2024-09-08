const container = document.getElementById("root"); // 'root' 요소를 가져와서 변수에 할당 (중복 방지)
const ajax = new XMLHttpRequest(); // 데이터 변경이 없으므로 const 사용 (let은 변수를 위한 키워드)
const content = document.createElement("div"); // 새로운 div 요소 생성
const NEWS_URL = "https://api.hnpwa.com/v0/news/1.json"; // 뉴스 데이터를 가져올 API URL
const CONTENT_URL = "https://api.hnpwa.com/v0/item/@id.json"; // 뉴스 상세 데이터를 가져올 API URL (@id는 실제 ID로 대체됨)

const store = {
  currentPage: 1, // 현재 페이지를 저장하는 객체 (기본값: 1)
};

/* 데이터를 가져오는 함수 */
function getData(url) {
  ajax.open("GET", url, false); // 비동기 호출을 사용하지 않고, 동기적으로 데이터를 가져옴
  ajax.send(); // 요청을 서버에 전송

  return JSON.parse(ajax.response); // 서버 응답을 JSON 형식으로 변환하여 반환
}

/* 뉴스 목록을 화면에 표시하는 함수 */
function newsFeed() {
  const newsFeed = getData(NEWS_URL); // 뉴스 목록 데이터를 가져오기위해 getData함수가 필요한 url만 넘겨줌
  const newsList = [];
  newsList.push("<ul>"); // 목록 시작 태그 추가

  // 현재 페이지에 맞는 뉴스 10개를 리스트에 추가
  for (let i = (store.currentPage - 1) * 10; i < store.currentPage * 10; i++) {
    newsList.push(`
      <li>
        <a href="#/show/${newsFeed[i].id}">
          ${newsFeed[i].title} (${newsFeed[i].comments_count})
        </a>
      </li>
    `);
  }

  newsList.push("</ul>"); // 목록 끝 태그 추가
  newsList.push(`
    <div>
      <a href="#/page/${
        store.currentPage > 1 ? store.currentPage - 1 : 1
      }">이전 페이지</a>
      <a href="#/page/${store.currentPage + 1}">다음 페이지</a>
    </div>
  `);
  // 이전 페이지 링크와 다음 페이지 링크를 추가 (이전 페이지는 1 이하로 내려가지 않도록 방어 코드 추가)
  container.innerHTML = newsList.join(""); // 뉴스 목록을 화면에 표시 (배열을 문자열로 결합)
}

/* 해시가 변경될때 뉴스 상세 내용을 화면에 표시하는 함수 */
function newsDetail() {
  const id = location.hash.substr(7); // 해시에서 '#/show/' 이후의 ID 부분을 추출
  const newsContent = getData(CONTENT_URL.replace("@id", id)); //getData함수가 필요한 url만 넘겨줌, ID를 사용하여 상세 데이터를 가져옴

  container.innerHTML = `
    <h1>${newsContent.title}</h1>

    <div>
      <a href="#/page/${store.currentPage}">목록으로</a>
    </div>
  `;
  // 현재페이지를 알기위해 #/page/${store.currentPage}로 이동
}

/* 라우터 함수: 해시값에 따라 화면을 전환 */
function router() {
  const routePath = location.hash; // 현재 URL의 해시값을 가져옴

  if (routePath === "") {
    // 해시값이 없으면 뉴스 목록 화면 표시 (location.hash에 #만 있으면 빈값을 반환하므로 참)
    newsFeed();
  } else if (routePath.indexOf("#/page/") >= 0) {
    // 해시값에 '#/page/'가 포함되어 있으면 페이지 전환 처리 (indexof메소드는 문자열을 찾아서 없으면 0보다 작은값 반환)
    store.currentPage = Number(routePath.substr(7)); // 페이지 번호 추출 후 숫자로 변환하여 저장
    newsFeed(); // 해당 페이지의 뉴스 목록을 표시
  } else {
    newsDetail(); // 그 외의 경우 뉴스 상세 화면 표시
  }
}

window.addEventListener("hashchange", router); // 해시값 변경 시 router 함수 호출
router(); // 초기 로딩 시 router 함수 호출
