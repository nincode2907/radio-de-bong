const workerUrl = 'https://radio-proxy.services2907.workers.dev';

window.sendToTelegram = async (mood, content) => {
    const moodEmojis = {
        'vui': '😊 Vui',
        'buon': '😔 Buồn',
        'nho': '🥺 Nhớ',
        'gian': '😠 Giận'
    };

    const formattedContent = `
📝 **Nhật Ký Của Dê Bông**
---------------------------
Mood: ${moodEmojis[mood] || mood}
Nội dung:
"${content}"
---------------------------
⏰ ${new Date().toLocaleString('vi-VN')}
    `;

    try {
        const response = await fetch(workerUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: formattedContent
            })
        });

        if (!response.ok) {
            throw new Error('Gửi thất bại ' + response.status);
        }

        const data = await response.json();
        return data;

    } catch (error) {
        throw error;
    }
};