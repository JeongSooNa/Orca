document.addEventListener('DOMContentLoaded', () => {
    const navButtons = document.querySelectorAll('.nav-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.getAttribute('data-target');

            // 모든 버튼 비활성화 및 선택된 버튼 활성화
            navButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // 모든 탭 콘텐츠 숨기기 및 타겟 콘텐츠 표시
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === targetId) {
                    content.classList.add('active');
                }
            });
        });
    });
});