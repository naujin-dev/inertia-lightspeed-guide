# Inertia

북일고등학교 학술교류 포럼(2026-11-07) 발표 준비 사이트. 빛의 속력 측정 실험 공부자료와 준비 일정을 모아 두었다.

- 사이트: https://naujin-dev.github.io/inertia-lightspeed-guide/
- 첫 화면에서 공부자료와 일정 중 하나를 고른다.

## 페이지 구성

| 파일 | 내용 |
| --- | --- |
| `index.html` | 첫 화면. 큰 Inertia 글씨, 공부자료/일정 선택, 발표까지 남은 날, 다음 일정 |
| `study.html` | 공부자료 (개정판) |
| `schedule.html` | 일정. 달력, 검색, 담당 필터, 끝낸 칸 체크, 장소이동신청, 실험실 예약 |
| `site.css`, `site.js` | 첫 화면과 일정 페이지가 같이 쓰는 스타일, 화면 모드 전환, 날짜 계산 |
| `schedule-data.js` | 엑셀에서 뽑은 일정 데이터. 직접 고치지 않는다 |
| `schedule/일정3.xlsx` | 일정 원본 |
| `scripts/build_schedule.py` | 엑셀을 읽어 `schedule-data.js` 를 만든다 |

서버나 빌드 도구 없이 정적 파일만으로 돌아간다. GitHub Pages가 저장소 루트를 그대로 내보낸다.

## 일정 고치는 법

1. `schedule/일정3.xlsx` 를 고쳐서 같은 자리에 올린다.
2. `main` 에 푸시하면 GitHub Actions가 `schedule-data.js` 를 다시 만들어 커밋한다. 1~2분 뒤 사이트에 반영된다.

내 컴퓨터에서 바로 확인하려면:

```bash
pip install openpyxl
python3 scripts/build_schedule.py
python3 -m http.server 8000   # http://localhost:8000
```

엑셀 "전체 일정" 시트는 7행부터 읽고, 행 배경색으로 구분을 나눈다. 주황은 실험실, 파랑은 대면, 회색은 구글챗·개인, 노랑은 마감·주문, 초록은 행사다. 색을 바꾸거나 열 순서를 바꾸면 스크립트도 같이 고쳐야 한다.

## 알아둘 것

- 일정 페이지의 "끝냄", "신청함", "여쭤봄" 체크는 각자 기기의 브라우저에만 저장된다. 팀원끼리 공유되지 않는다.
- 화면 모드(자동/라이트/다크)는 첫 화면 아래, 일정 페이지와 공부자료 페이지 위쪽 버튼으로 바꾼다.
- `blocks/` 와 `scripts/assemble.py` 는 예전에 공부자료 페이지를 조립하던 도구다. 지금 사이트는 이걸 쓰지 않는다. `assemble.py` 는 만든 사람의 컴퓨터 경로가 박혀 있어 다른 곳에서는 돌아가지 않는다.
