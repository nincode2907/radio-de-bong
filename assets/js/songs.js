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
        id: 8,
        file: '8.mp3',
        title: 'Người Đầu Tiên - Juky San, Em Xinh Say Hi',
        type: 'suy',
        message: 'Người đầu tiên làm anh web tặng riêng thế này đấy. Cảm thấy VIP chưa? 👑'
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
];