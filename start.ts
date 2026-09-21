import 'dotenv/config';  
import TelegramBot from 'node-telegram-bot-api';  
import { runWelcome, runPing, runWeather, runOsInfo, runStatus } from './example';  
  
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
    await runWelcome(token as string, chatId);  
    console.log('Membalas /start ke chat', chatId);  
  } catch (err) {  
    console.error('Gagal merespons /start:', err);  
  }  
});  
  
// (Opsional) Case tambahan: /help  
bot.onText(/^\/help\b/, async (msg) => {  
  const chatId = msg.chat.id;  
  try {  
    await bot.sendMessage(chatId, 'Perintah tersedia:\n/start - kirim pesan Rich\n/status - status bot dan sistem\n/osinfo - informasi sistem\n/weather <kota> - cek cuaca\n/ping - cek latency bot\n/help - bantuan');  
  } catch (err) {  
    console.error('Gagal merespons /help:', err);  
  }  
});  

bot.onText(/^\/ping\b/, async (msg) => {  
  const chatId = msg.chat.id;  
  try {  
    const t0 = Date.now();  
    const sent = await bot.sendMessage(chatId, '🏓 Pinging...');  
    const latency = Date.now() - t0;  
    // opsi A: hapus pesan awal lalu kirim Rich hasil  
    await bot.deleteMessage(chatId, sent.message_id).catch(() => {});  
    await runPing(token as string, chatId, latency);  
  } catch (err) { console.error('Gagal merespons /ping:', err); }  
});

bot.onText(/^\/status\b/, async (msg) => {
  const chatId = msg.chat.id;
  try {
    const t0 = Date.now();
    const sent = await bot.sendMessage(chatId, '📊 Mengambil status...');
    const latency = Date.now() - t0;
    await bot.deleteMessage(chatId, sent.message_id).catch(() => {});
    await runStatus(token as string, chatId, latency);
  } catch (err) {
    console.error('Gagal merespons /status:', err);
  }
});

bot.onText(/^\/osinfo\b/, async (msg) => {
  const chatId = msg.chat.id;
  try {
    await runOsInfo(token as string, chatId);
    console.log('Membalas /osinfo ke chat', chatId);
  } catch (err) {
    console.error('Gagal merespons /osinfo:', err);
  }
});

bot.onText(/^\/weather(?:\s+(.+))?$/i, async (msg, match) => {
  const chatId = msg.chat.id;
  const city = match?.[1]?.trim();
  if (!city) {
    await bot.sendMessage(chatId, 'Format: /weather <kota>\nContoh: /weather Jakarta');
    return;
  }

  try {
    await runWeather(token as string, chatId, city);
    console.log('Membalas /weather ke chat', chatId, 'untuk', city);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Gagal mengambil data cuaca.';
    await bot.sendMessage(chatId, `Tidak bisa mengambil cuaca: ${message}`);
    console.error('Gagal merespons /weather:', err);
  }
});
  
bot.on('polling_error', (err) => console.error('polling_error:', err));