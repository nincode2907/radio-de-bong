const playlist = [
    // --- LIST CHILL (Nhạc vui, yêu đời) ---
    {
        id: 1,
        file: '1.mp3',
        title: 'Quang Hùng MasterD - Đã Có Anh',
        type: 'chill',
        message: 'Dành cho những ngày em thấy mệt mỏi hay áp lực thì nhớ nhé, vai anh free 24/7! ❤️'
    },
    {
        id: 2,
        file: '2.mp3',
        title: 'BẤT CHẤP - WHEE',
        type: 'chill',
        message: ''
    },
    {
        id: 3,
        file: '3.mp3',
        title: 'Chúa Tể - Bùi Công Nam',
        type: 'chill',
        message: 'Em là Chúa tể hủy diệt mood buồn, còn anh là Chúa tể... simp em. 🤣'
    },
    {
        id: 4,
        file: '4.mp3',
        title: 'EM LÀ AI TRONG ĐÔI MẮT ANH - NGUYỄN TRUNG ĐỨC',
        type: 'chill',
        message: 'Là cô giáo, là tiên nữ mất cánh, và là... người thương của anh IT nào đó. 😳'
    },
    {
        id: 5,
        file: '5.mp3',
        title: 'Lời Yêu - buitruonglinh ft. Minsicko',
        type: 'chill',
        message: 'Nghe bài này xong thì nhớ lại những lời iu của chúng ta nha. 😋'
    },
    {
        id: 9,
        file: '9.mp3',
        title: 'VSTRA - Ai Ngoài Anh',
        type: 'chill',
        message: 'Ngoài anh ra thì còn ai chịu được cái nết ngang của cô giáo nữa. Chốt đơn đii! ✍️'
    },
    {
        id: 11,
        file: '11.mp3',
        title: 'Đoạn Kết Mới - Hoàng Dũng',
        type: 'chill',
        message: 'Đoạn kết mới nha cô giáo. 🤝'
    },
    {
        id: 10,
        file: '10.mp3',
        title: 'Catch Me If You Can',
        type: 'chill',
        message: '',
    },
    {
        id: 14,
        file: '14.mp3',
        title: 'Con Rồng Cháu Tiên - Tùng Dương',
        type: 'chill',
        message: ''
    },
    {
        id: 16,
        file: '16.mp3',
        title: 'Đúng Người Đúng Thời Điểm - Thanh Hưng',
        type: 'chill',
        message: ''
    },
    {
        id: 22,
        file: '22.mp3',
        title: 'Kiếp Sau Vẫn Là Người Việt Nam - Various Artists',
        type: 'chill',
        message: ''
    },
    {
        id: 23,
        file: '23.mp3',
        title: 'Làm Vợ Anh Nhé - Chi Dân',
        type: 'chill',
        message: ''
    },
    {
        id: 25,
        file: '25.mp3',
        title: 'Mãi Mãi Bên Nhau - Noo Phước Thịnh',
        type: 'chill',
        message: ''
    },
    {
        id: 26,
        file: '26.mp3',
        title: 'Một Vòng Việt Nam - Tùng Dương',
        type: 'chill',
        message: ''
    },
    {
        id: 32,
        file: '32.mp3',
        title: 'Quê Hương Việt Nam - Anh Khang, Suboi',
        type: 'chill',
        message: ''
    },
    {
        id: 33,
        file: '33.mp3',
        title: 'Sao Hạng A - HIEUTHUHAI, Dương Domic, Song Luân, JSOL',
        type: 'chill',
        message: ''
    },
    {
        id: 36,
        file: '36.mp3',
        title: 'Thịnh Vượng Việt Nam Sáng Ngời - Bùi Trường Linh',
        type: 'chill',
        message: ''
    },
    {
        id: 37,
        file: '37.mp3',
        title: 'Thủy Chung - Thương Võ, K-ICM',
        type: 'chill',
        message: ''
    },
    {
        id: 38,
        file: '38.mp3',
        title: 'Tình Đầu Quá Chén - Quang Hùng MasterD, ERIK, Negav',
        type: 'chill',
        message: ''
    },
    {
        id: 40,
        file: '40.mp3',
        title: 'Tự Hào Màu Áo Lính - Various Artists',
        type: 'chill',
        message: ''
    },
    {
        id: 42,
        file: '42.mp3',
        title: 'Viết Tiếp Câu Chuyện Hòa Bình - Tùng Dương, Nguyễn Văn Chung',
        type: 'chill',
        message: ''
    },
    {
        id: 43,
        file: '43.mp3',
        title: 'Con Đường Hạnh Phúc - Thùy Chi',
        type: 'chill',
        message: ''
    },
    {
        id: 44,
        file: '44.mp3',
        title: 'Lửa Gần Rơm - Quân A.P',
        type: 'chill',
        message: 'Bén liền bé iu ơi'
    },
    {
        id: 8,
        file: '8.mp3',
        title: 'Người Đầu Tiên - Juky San, Em Xinh Say Hi',
        type: 'chill',
        message: 'Người đầu tiên làm anh web tặng riêng thế này đấy. Cảm thấy VIP chưa? 👑'
    },
    {
        id: 48,
        file: '48.mp3',
        title: 'Từng Ngày Yêu Em - Bùi Tường Linh',
        type: 'chill',
        message: 'Từng giây yêu em luôn nha'
    },
    {
        id: 49,
        file: '49.mp3',
        title: 'Em Là Bà Nội Của Anh - Trọng Hiếu ft. Tăng Nhật Tuệ',
        type: 'chill',
        message: 'Chuẩn không cần chỉnh!'
    },
    {
        id: 50,
        file: '50.mp3',
        title: 'Hoa Và Váy - Quốc Thiên',
        type: 'chill',
        message: ''
    },
    {
        id: 51,
        file: '51.mp3',
        title: 'Đại Hải Trình',
        type: 'chill',
        message: ''
    },
    {
        id: 60,
        file: '60.mp3',
        title: 'Đi Để Trở Về 2 - Soobin Hoàng Sơn',
        type: 'chill',
        message: ''
    },
    {
        id: 61,
        file: '61.mp3',
        title: 'Vị Quê Nhà - Noo Phước Thịnh ft. Lou Hoàng',
        type: 'chill',
        message: ''
    },
    {
        id: 65,
        file: '65.mp3',
        title: 'Người Im Lặng Gặp Người Hay Nói - HIEUTHUHAI',
        type: 'chill',
        message: ''
    },
    {
        id: 68,
        file: '68.mp3',
        title: 'Bài này không để đi diễn - Anh Tu Atus',
        type: 'chill',
        message: ''
    },
    {
        id: 69,
        file: '69.mp3',
        title: 'Dạo Bước Hong Kong 1999 - PhongG',
        type: 'chill',
        message: ''
    },
    {
        id: 70,
        file: '70.mp3',
        title: 'Được không - Binz ft. Châu Bùi',
        type: 'chill',
        message: ''
    },
    {
        id: 71,
        file: '71.mp3',
        title: 'Em Đồng Ý - Juky San',
        type: 'chill',
        message: ''
    },
    {
        id: 73,
        file: '73.mp3',
        title: 'Từ Ngày Hôm Nay - Anh Tú Atus',
        type: 'chill',
        message: ''
    },
    {
        id: 74,
        file: '74.mp3',
        title: 'Một Đời - 14 Casper & Bon Nghiêm (feat. buitruonglinh)',
        type: 'chill',
        message: ''
    },
    {
        id: 75,
        file: '75.mp3',
        title: 'Anh chẳng thể (Lofi Ver.) - Phạm Kỳ x Orinn',
        type: 'chill',
        message: ''
    },
    {
        id: 77,
        file: '77.mp3',
        title: 'Có Ai Hẹn Hò Cùng Em Chưa - Quân A.P',
        type: 'chill',
        message: ''
    },
    {
        id: 78,
        file: '78.mp3',
        title: 'Có Một Người, Luôn Cười Khi Anh Đến - Tofu, PC & D.Blue (Prod. by 1nG)',
        type: 'chill',
        message: ''
    },
    {
        id: 79,
        file: '79.mp3',
        title: 'Ghế Qua - Dick x PC x Tofu',
        type: 'chill',
        message: ''
    },
    {
        id: 83,
        file: '83.mp3',
        title: 'Hẹn Gặp Em Dưới Ánh Trăng - HURRYKNG, HIEUTHUHAI, MANBO',
        type: 'chill',
        message: ''
    },
    {
        id: 84,
        file: '84.mp3',
        title: 'Lễ Đường - KAI ĐINH',
        type: 'chill',
        message: ''
    },
    {
        id: 86,
        file: '86.mp3',
        title: 'Ngày Đầu Tiên - Đức Phúc',
        type: 'chill',
        message: ''
    },
    {
        id: 87,
        file: '87.mp3',
        title: '10 Ngàn Năm - PC',
        type: 'chill',
        message: ''
    },
    {
        id: 89,
        file: '89.mp3',
        title: 'Già Cùng Nhau Là Được - Tùng TeA ft. PC',
        type: 'chill',
        message: ''
    },
    {
        id: 92,
        file: '92.mp3',
        title: 'Chẳng Thích Thế Giới',
        type: 'chill',
        message: ''
    },

    //Type chill here

    // --- LIST SUY (Nhạc buồn, tâm trạng) ---
    {
        id: 6,
        file: '6.mp3',
        title: 'Cho em gần anh thêm chút nữa',
        type: 'suy',
        message: 'Gần thêm chút nữa để... dễ ôm hơn. Chỗ bao cứng cáp chỗ bao mềm khà khà! 💪'
    },
    {
        id: 7,
        file: '7.mp3',
        title: 'Thôi Đừng Chiêm Bao',
        type: 'suy',
        message: 'Đừng chiêm bao nữa, gặp anh ngoài đời real 4k sướng hơn nhiều. Set kèo liền? ☕'
    },
    {
        id: 12,
        file: '12.mp3',
        title: 'AI LÀ NGƯỜI THƯƠNG EM - QUÂN A.P',
        type: 'suy',
        message: ''
    },
    {
        id: 13,
        file: '13.mp3',
        title: 'Cơ Hội Cuối (Lofi) - An Vũ',
        type: 'suy',
        message: ''
    },
    {
        id: 15,
        file: '15.mp3',
        title: 'Đóa Phù Dung Cuối Cùng - Tăng Phúc, Đức Phúc',
        type: 'suy',
        message: ''
    },
    {
        id: 17,
        file: '17.mp3',
        title: 'Duyên Mình Lỡ - Hương Tràm',
        type: 'suy',
        message: ''
    },
    {
        id: 18,
        file: '18.mp3',
        title: 'Hương Tình Thân - Lâm Bảo Ngọc',
        type: 'suy',
        message: ''
    },
    {
        id: 19,
        file: '19.mp3',
        title: 'Kết Thúc Và Chia Tay',
        type: 'suy',
        message: ''
    },
    {
        id: 21,
        file: '21.mp3',
        title: 'Kiếp Chồng Chung - Bùi Công Nam',
        type: 'suy',
        message: ''
    },
    {
        id: 24,
        file: '24.mp3',
        title: 'Lỡ Một Lời Thương - Vy Oanh',
        type: 'suy',
        message: ''
    },
    {
        id: 27,
        file: '27.mp3',
        title: 'Nên Chờ Hay Nên Quên - Chu Thúy Quỳnh',
        type: 'suy',
        message: ''
    },
    {
        id: 28,
        file: '28.mp3',
        title: 'Như Là Một Giấc Mơ - DangTuanVu.O, Lâm Tuấn',
        type: 'suy',
        message: ''
    },
    {
        id: 29,
        file: '29.mp3',
        title: 'Như Phút Ban Đầu - Quân A.P, Đức Phúc',
        type: 'suy',
        message: ''
    },
    {
        id: 30,
        file: '30.mp3',
        title: 'Những Lời Hứa Bỏ Quên - Vũ., Dear Jane',
        type: 'suy',
        message: ''
    },
    {
        id: 31,
        file: '31.mp3',
        title: 'Nỗi Đau Giữa Hòa Bình - Hòa Minzy',
        type: 'suy',
        message: ''
    },
    {
        id: 34,
        file: '34.mp3',
        title: 'Sao Mình Chưa Nắm Tay Nhau - Various Artists',
        type: 'suy',
        message: ''
    },
    {
        id: 35,
        file: '35.mp3',
        title: 'Tháng Tư Là Lời Nói Dối Của Em - Hà Anh Tuấn',
        type: 'suy',
        message: ''
    },
    {
        id: 39,
        file: '39.mp3',
        title: 'Tôi Thấy Hoa Vàng Trên Cỏ Xanh - Ái Phương',
        type: 'suy',
        message: ''
    },
    {
        id: 41,
        file: '41.mp3',
        title: 'Tự Tình 2 - Trung Quân',
        type: 'suy',
        message: ''
    },
    {
        id: 20,
        file: '20.mp3',
        title: 'Khổ Quá Thì Về Mẹ Nuôi - Noo Phước Thịnh',
        type: 'suy',
        message: ''
    },
    {
        id: 45,
        file: '45.mp3',
        title: 'Tình Yêu Buông Tha Cho Chúng Ta - Trungg I.U Lâm Bảo Ngọc x Caotri',
        type: 'suy',
        message: ''
    },
    {
        id: 46,
        file: '46.mp3',
        title: 'Có Chàng Trai Viết Lên Cây - Phan Mạnh Quỳnh',
        type: 'suy',
        message: ''
    },
    {
        id: 47,
        file: '47.mp3',
        title: 'Hẹn Lần Sau - MAYDAYs',
        type: 'suy',
        message: ''
    },
    {
        id: 52,
        file: '52.mp3',
        title: 'Nổi gió rồi - Châu Thâm',
        type: 'suy',
        message: ''
    },
    {
        id: 53,
        file: '53.mp3',
        title: 'Nan Giải - Triệu Tâm Nguyện, NUONUO',
        type: 'suy',
        message: ''
    },
    {
        id: 54,
        file: '54.mp3',
        title: 'Trường An Cô Nương - Dư Hựu Ft Đàm Nặc Long',
        type: 'suy',
        message: ''
    },
    {
        id: 55,
        file: '55.mp3',
        title: 'Đoá Hồng Chơi Vơi - Anh Tú',
        type: 'suy',
        message: ''
    },
    {
        id: 56,
        file: '56.mp3',
        title: 'Em Là Cô Dâu Đẹp Nhất - Châu Khải Phong',
        type: 'suy',
        message: ''
    },
    {
        id: 57,
        file: '57.mp3',
        title: 'Hết Thương Cạn Nhớ - Đức Phúc',
        type: 'suy',
        message: ''
    },
    {
        id: 58,
        file: '58.mp3',
        title: 'Em Giấu Anh Điều Gì - Trịnh Đình Quang',
        type: 'suy',
        message: ''
    },
    {
        id: 59,
        file: '59.mp3',
        title: 'Cơm Đoàn Viên - Thành Đạt',
        type: 'suy',
        message: ''
    },
    {
        id: 62,
        file: '62.mp3',
        title: 'Hoa Bất Tử - Thành Đạt x Phát Huy T4',
        type: 'suy',
        message: ''
    },
    {
        id: 63,
        file: '63.mp3',
        title: 'Mảnh Tình Sai Đôi - Thành Đạt',
        type: 'suy',
        message: ''
    },
    {
        id: 64,
        file: '64.mp3',
        title: 'Ngày Mai Người Ta Lấy Chồng - Quốc Thiên Cover',
        type: 'suy',
        message: ''
    },
    {
        id: 66,
        file: '66.mp3',
        title: 'Kỷ Niệm Giảm Cầm Chúng Ta - Thanh Hưng',
        type: 'suy',
        message: ''
    },
    {
        id: 67,
        file: '67.mp3',
        title: 'Mở Lòng Vì Ai Remix - Giang Jolee x ThahTrung',
        type: 'suy',
        message: ''
    },
    {
        id: 71,
        file: '71.mp3',
        title: 'Giữ Anh Em Cũng Làm Không Xong - LyLy',
        type: 'suy',
        message: ''
    },
    {
        id: 76,
        file: '76.mp3',
        title: 'Cảm Ơn Người Đã Thức Cùng Tôi',
        type: 'suy',
        message: ''
    },
    {
        id: 80,
        file: '80.mp3',
        title: 'Hẹn Một Mai - Bùi Anh Tuấn',
        type: 'suy',
        message: ''
    },
    {
        id: 81,
        file: '81.mp3',
        title: 'Không Buông - Hngle ft. Ari',
        type: 'suy',
        message: ''
    },
    {
        id: 82,
        file: '82.mp3',
        title: 'Hôm Nay Em Cưới Rồi - Khải Đăng',
        type: 'suy',
        message: ''
    },
    {
        id: 85,
        file: '85.mp3',
        title: 'Một Bước Yêu Vạn Dặm Đau - Đức Phúc, Quân A.P',
        type: 'suy',
        message: ''
    },
    {
        id: 88,
        file: '88.mp3',
        title: 'Suýt Nữa Thì - ANDIEZ',
        type: 'suy',
        message: ''
    },
    {
        id: 90,
        file: '90.mp3',
        title: 'Mây Lang Thang - Tùng TeA & PC ft. New$oulZ',
        type: 'suy',
        message: ''
    },
    {
        id: 91,
        file: '91.mp3',
        title: 'Khó Giữ Chân Thành',
        type: 'suy',
        message: ''
    },
    //Type suy here

];