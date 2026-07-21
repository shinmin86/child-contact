# child-contact

미아 발생 시 카카오톡·WeChat·전화·현재 위치 공유를 이용할 수 있는 모바일 연락 페이지입니다.

## 적용된 정보

- 아이 이름: **송아이**
- 보호자 이름: **송어른**
- 전화번호: **+82 10-1111-2222**
- 카카오 오픈채팅: `https://open.kakao.com/o/sCKQl3Ei`
- WeChat ID: **shinmin**
- 예상 공개 주소: `https://shinmin86.github.io/child-contact/`

## GitHub에 올리는 방법

1. GitHub에서 `child-contact` 저장소를 만듭니다.
2. 이 ZIP 파일의 **child-contact 폴더 안에 있는 파일 전체**를 저장소 최상단에 업로드합니다.
3. 저장소에서 **Settings → Pages**로 이동합니다.
4. `Build and deployment`에서 다음과 같이 선택합니다.
   - Source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/ (root)`
5. `Save`를 누르고 잠시 기다립니다.
6. 아래 주소로 접속합니다.

`https://shinmin86.github.io/child-contact/`

## QR 코드

`images/site-qr.png`은 위 GitHub Pages 주소를 연결하도록 미리 만들어져 있습니다.

GitHub Pages를 실제로 활성화한 뒤 휴대전화로 반드시 테스트하세요.

## 수정할 곳

- 이름·전화번호·카카오 링크: `index.html`
- 위치 공유 메시지의 아이 이름: `script.js`
- WeChat QR 이미지: `images/wechat-qr.png`
- WeChat ID: `index.html`, `script.js`

## 주의 사항

- 현재 위치 공유는 HTTPS 환경인 GitHub Pages에서 작동합니다.
- 사용자가 위치 권한을 허용해야 합니다.
- WeChat은 ID를 URL로 직접 열 수 없으므로 QR 코드 팝업과 ID 복사 방식으로 구성했습니다.
- 공개 페이지에 이름과 전화번호가 표시되므로 개인정보 공개 범위를 확인하세요.


## v2 업데이트

주요 화면과 버튼에 한국어·영어·중국어 번체·중국어 간체가 함께 표시됩니다.
기존 캐시를 갱신하기 위해 CSS, JavaScript, 서비스 워커 버전을 v2로 변경했습니다.


## v3 다크 모드

- 화면 오른쪽 위의 달/해 버튼으로 라이트 모드와 다크 모드를 전환합니다.
- 사용자가 선택한 모드는 브라우저에 저장되어 다음 방문에도 유지됩니다.
- 처음 방문할 때는 기기의 시스템 모드를 따릅니다.
- 서비스 워커 캐시를 v3로 변경했습니다.
