import 'dotenv/config';  
import TelegramBot from 'node-telegram-bot-api';  
import { runExample } from './example';  
  
const token = process.env.TELEGRAM_BOT_TOKEN;  
  
if (!token) throw new Error('TELEGRAM_BOT_TOKEN belum di-set di .env');  
  
// Handler global agar error tak tertangkap TIDAK mematikan proses.  
process.on('unhandledRejection', (r) => console.error('unhandledRejection:', r));  
process.on('uncaughtException', (e) => console.error('uncaughtException:', e));  
  
const bot = new TelegramBot(token as string, { polling: true });  
  
console.log('Bot ntba-rich berjalan (polling). Menunggu command /start...');  
  
// Case: /start -> balas pesan Rich ke chat pengirim  
bot.onText(/^\/start\b/, async (msg) => {  
  const chatId = msg.chat.id;  
  try {  
    await runExample(token as string, chatId);  
    console.log('Membalas /start ke chat', chatId);  
  } catch (err) {  
    console.error('Gagal merespons /start:', err);  
  }  
});  
  
// (Opsional) Case tambahan: /help  
bot.onText(/^\/help\b/, async (msg) => {  
  const chatId = msg.chat.id;  
  try {  
    await bot.sendMessage(chatId, 'Perintah tersedia:\n/start - kirim pesan Rich\n/help - bantuan');  
  } catch (err) {  
    console.error('Gagal merespons /help:', err);  
  }  
});  
  
bot.on('polling_error', (err) => console.error('polling_error:', err));