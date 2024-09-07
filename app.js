const container = document.getElementById("root"); // 'root'가 반복되지않도록
const ajax = new XMLHttpRequest(); // 데이터 변경하지 않을 것이므로 상수.(let은 변수)
const content = document.createElement("div");
const NEWS_URL = "https://api.hnpwa.com/v0/news/1.json";
const CONTENT_URL = "https://api.hnpwa.com/v0/item/@id.json";

function getData(url) {
  ajax.open("GET", url, false); // url, async boolean값(동기처리)
  ajax.send();

  return JSON.parse(ajax.response);
}

/* 목록화면 코드를 함수로 묶어서 재활용 */
function newsFeed() {
  const newsFeed = getData(NEWS_URL); // getData함수가 필요한 url만 넘겨줌
  const newsList = [];
  newsList.push("<ul>");

  for (let i = 0; i < 10; i++) {
    newsList.push(`
      <li>
        <a href="#${newsFeed[i].id}">
          ${newsFeed[i].title} (${newsFeed[i].comments_count})
        </a>
      </li>
    `);
  }

  newsList.push("</ul>");

  container.innerHTML = newsList.join(""); //태그들을 하나의 문자열로 합쳐서 반환
}

/* 해시가 변경될때 실행되는 상세화면 함수 */
function newsDetail() {
  const id = location.hash.substr(1); //#이 제거된 숫자값만 할당
  const newsContent = getData(CONTENT_URL.replace("@id", id)); //getData함수가 필요한 url만 넘겨줌

  container.innerHTML = `
    <h1>${newsContent.title}</h1>

    <div>
      <a href="#">목록으로</a>
    </div>
  `;
}

/* 화면을 호출하는 라우터처리 함수 */
function router() {
  const routePath = location.hash; // 해시값을 가져와서 목록인지 상세인지 호출

  if (routePath === "") {
    //location.hash에 #만 있으면 빈값을 반환하므로 참.
    newsFeed();
  } else {
    newsDetail();
  }
}

window.addEventListener("hashchange", router); //화면이 전환될때 router함수 호출
router();
