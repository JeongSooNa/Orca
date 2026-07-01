$(document).ready(function() {
    // 네비게이션바 메뉴 및 로고 클릭 이벤트 연동
    $('.nav-link, .navbar-brand').on('click', function(e) {
        e.preventDefault();

        // 1. 클릭 대상의 고유 타겟 섹션 ID 추출
        var targetSection = $(this).attr('data-target');

        // 2. 상단 네비게이션의 active 하이라이트 클래스 변경 제어
        $('.navbar-nav li').removeClass('active');
        // 상단 우측 리스트 메뉴에 해당하는 경우 하이라이트 추가
        if ($(this).hasClass('nav-link')) {
            $(this).parent().addClass('active');
        } else {
            // 로고 클릭시 'Home' 메뉴에 하이라이트 매칭
            $('.navbar-nav li a[data-target="home"]').parent().addClass('active');
        }

        // 3. 모든 섹션 숨기고 선택한 섹션만 부드럽게 노출하기
        $('.page-section').removeClass('active');
        $('#' + targetSection).addClass('active');

        // 4. 모바일 해상도 화면에서 메뉴 터치 클릭 직후 네비 바 메뉴가 자동으로 말려 닫히도록 보완
        if ($('.navbar-toggle').is(':visible') && $('#navbar').hasClass('in')) {
            $('.navbar-toggle').click();
        }

        // 페이지 전환 시 최상단 스크롤 초기화
        window.scrollTo(0, 0);
    });
});