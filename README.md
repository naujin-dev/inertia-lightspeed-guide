# Inertia 빛의 속력 측정 공부자료

동아리 Inertia의 학술 포럼 발표를 위한 빛의 속력 측정 실험 공부자료입니다.

## 📖 내용

- **실험 A**: 콘덴서를 이용한 속력 측정
- **실험 B**: 솔레노이드 코일을 이용한 방법
- **실험 C**: LC 공진 회로를 이용한 직접 측정
- **일정표**: 전체 실험 일정 및 장비 예약
- **Q&A**: 실험 관련 39개 예상 질문

## 🌐 웹사이트

이 사이트는 GitHub Pages를 통해 자동으로 배포됩니다.

**접속 주소**: `https://[your-username].github.io/inertia-lightspeed-guide`

로그인 없이 누구나 접근 가능합니다.

## 📝 수정 방법

1. 블록 파일(`blocks/blk_*.html`) 또는 일정표(`schedule/일정3.xlsx`) 수정
2. Git에 푸시 (`git push`)
3. 2분 후 자동으로 웹사이트 업데이트됨

## 🔨 로컬에서 빌드하기

```bash
python3 scripts/assemble.py
```

`index.html`이 생성되며, 브라우저에서 열어 확인할 수 있습니다.

## 📁 폴더 구조

```
├── index.html           # 웹사이트 메인 페이지
├── blocks/              # HTML 블록 파일들
├── schedule/            # 일정표 (Excel)
├── scripts/             # Python 빌드 스크립트
└── .github/workflows/   # GitHub Actions 설정
```

## ⚙️ 기술 스택

- HTML5 + CSS3
- Python (HTML 조합)
- GitHub Pages (호스팅)
- GitHub Actions (자동 빌드)

---

*Inertia 학술교류 포럼 - 2026*
