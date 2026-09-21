import os from 'node:os';
import { escapeText, pre, heading, table, marked, list, link, blockquote, thinking, pullquote, details, map, doc, fmtRich, bold, italic, spoiler, underline, strike, code, sub, sup, br, unsafeRawInline, email, phone, userMention, emoji, dateTime, anchorLink, reference, footer, divider, anchor, photo, video, animation, paragraph, audio, tgButton, voice, collage, slideshow } from './rich';  
import type { RichDocument } from './rich';  
import { sendRich } from './ntba-adapter';  

function formatUptime(seconds: number): string {  
  const s = Math.floor(seconds);  
  const h = Math.floor(s / 3600);  
  const m = Math.floor((s % 3600) / 60);  
  const d = s % 60;  
  return `${h}j ${m}m ${d}d`;  
}

export function buildExampleDocument(): RichDocument {  
  return doc(  

    heading(1, 'Laporan'),  
    paragraph([  
      bold('Tebal'), ' dan ', italic('miring'), ' serta ',  
      link('tautan', 'https://telegram.org'),  
    ]),  
    paragraph([tgButton(bold('Telegram'), { type: 'url', style: 'success', url: 'https://web.telegram.org' })]),
    list(['Item satu', 'Item dua', 'Item tiga']),  
    table(  
      [  
        [{ content: 'Metric', header: true }, { content: 'Value', header: true }],  
        [{ content: 'Speed' }, { content: bold('42'), align: 'right' }],  
        [{ content: 'Status' }, { content: spoiler('ready'), align: 'center' }],  
      ],  
      { bordered: true, compact: true },  
    ),  
  ); 
}  

export async function runPing(token: string, chatId: number | string, latencyMs: number) {  
  const document = doc(  
    heading(1, '🏓 Pong'),  
    divider(),  
    table(  
      [  
        [{ content: (bold('Field')), header: true }, { content: 'Nilai', header: true }],  
        [{ content: 'Status' }, { content: marked('Online') }],  
        [{ content: 'Latency' }, { content: marked(`${latencyMs} ms`) }],  
        [{ content: 'Uptime' }, { content: marked(formatUptime(process.uptime())) }],  
      ],  
      { bordered: true, compact: true },  
    ),  
    pullquote(italic('"Powered by Suganzi."'), 'Gallagher'),  
  );  
  const res = await sendRich(token, chatId, document);  
  return res;  
}

export async function runExample(token: string, chatId: number | string) {  

  const document = buildExampleDocument();  

  const res = await sendRich(token, chatId, document);  

  console.log('Pesan terkirim, message_id:', res?.result?.message_id);  

  return res;  

}

export function buildWelcomeDocument(): RichDocument {
  return doc(
    heading(1, 'Selamat datang di NTBA Bot!'),
    paragraph('Bot Telegram untuk mencoba Rich Message dan berbagai utilitas server.'),
    table(
      [
        [{ content: bold('Command'), header: true }, { content: bold('Deskripsi'), header: true }],
        [{ content: '/start' }, { content: 'Tampilkan pesan welcome' }],
        [{ content: '/status' }, { content: 'Cek status dan kesehatan bot' }],
        [{ content: '/osinfo' }, { content: 'Tampilkan informasi sistem' }],
        [{ content: '/weather <kota>' }, { content: 'Cek cuaca sebuah kota' }],
        [{ content: '/ping' }, { content: 'Cek latency bot' }],
        [{ content: '/help' }, { content: 'Tampilkan bantuan command' }],
      ],
      { bordered: true, compact: true },
    ),
    paragraph(
      tgButton('👤  Hubungi Owner  @suganzi', {
        type: 'url',
        style: 'success',
        align: 'center',
        url: 'https://t.me/suganzi',
      }),
    ),
  );
}

export async function runWelcome(token: string, chatId: number | string) {
  return sendRich(token, chatId, buildWelcomeDocument());
}

interface WeatherApiResponse {
  current_condition?: Array<{
    temp_C?: string;
    FeelsLikeC?: string;
    humidity?: string;
    windspeedKmph?: string;
    weatherDesc?: Array<{ value?: string }>;
  }>;
  nearest_area?: Array<{
    areaName?: Array<{ value?: string }>;
    country?: Array<{ value?: string }>;
  }>;
}

interface WeatherSnapshot {
  location: string;
  country: string;
  temperature: string;
  feelsLike: string;
  condition: string;
  humidity: string;
  windSpeed: string;
}

function weatherValue(value: string | undefined, fallback: string): string {
  return value?.trim() || fallback;
}

function parseWeatherResponse(data: WeatherApiResponse, requestedCity: string): WeatherSnapshot {
  const current = data.current_condition?.[0];
  if (!current) throw new Error(`Cuaca untuk "${requestedCity}" tidak ditemukan.`);

  const area = data.nearest_area?.[0];
  return {
    location: weatherValue(area?.areaName?.[0]?.value, requestedCity),
    country: weatherValue(area?.country?.[0]?.value, 'Tidak diketahui'),
    temperature: `${weatherValue(current.temp_C, '?')} °C`,
    feelsLike: `${weatherValue(current.FeelsLikeC, '?')} °C`,
    condition: weatherValue(current.weatherDesc?.[0]?.value, 'Tidak diketahui'),
    humidity: `${weatherValue(current.humidity, '?')}%`,
    windSpeed: `${weatherValue(current.windspeedKmph, '?')} km/jam`,
  };
}

async function fetchWeather(city: string): Promise<WeatherSnapshot> {
  const trimmedCity = city.trim();
  if (!trimmedCity) throw new Error('Nama kota wajib diisi.');

  const response = await fetch(
    `https://wttr.in/${encodeURIComponent(trimmedCity)}?format=j1`,
    { headers: { 'User-Agent': 'ntba-weather-bot/1.0' } },
  );
  if (!response.ok) throw new Error(`Layanan cuaca tidak tersedia (${response.status}).`);

  return parseWeatherResponse((await response.json()) as WeatherApiResponse, trimmedCity);
}

function buildWeatherDocument(weather: WeatherSnapshot): RichDocument {
  return doc(
    heading(1, `Cuaca ${weather.location}`),
    paragraph(`Kondisi cuaca saat ini di ${weather.location}, ${weather.country}.`),
    table(
      [
        [{ content: bold('Informasi'), header: true }, { content: bold('Nilai'), header: true }],
        [{ content: 'Kondisi' }, { content: marked(weather.condition) }],
        [{ content: 'Suhu' }, { content: weather.temperature }],
        [{ content: 'Terasa seperti' }, { content: weather.feelsLike }],
        [{ content: 'Kelembapan' }, { content: weather.humidity }],
        [{ content: 'Angin' }, { content: weather.windSpeed }],
      ],
      { bordered: true, compact: true },
    ),
  );
}

export async function runWeather(token: string, chatId: number | string, city: string) {
  const weather = await fetchWeather(city);
  return sendRich(token, chatId, buildWeatherDocument(weather));
}

export interface OsInfoSnapshot {
  platform: string;
  release: string;
  architecture: string;
  hostname: string;
  cpuModel: string;
  cpuCount: number;
  totalMemory: number;
  freeMemory: number;
  uptime: number;
  nodeVersion: string;
}

function formatBytes(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let value = bytes;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  return `${value.toFixed(unitIndex === 0 ? 0 : 2)} ${units[unitIndex]}`;
}

function formatDuration(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${days}h ${hours}j ${minutes}m ${remainingSeconds}d`;
}

export function getOsInfo(): OsInfoSnapshot {
  return {
    platform: `${os.type()} ${os.platform()}`,
    release: os.release(),
    architecture: os.arch(),
    hostname: os.hostname(),
    cpuModel: os.cpus()[0]?.model ?? 'Tidak diketahui',
    cpuCount: os.cpus().length,
    totalMemory: os.totalmem(),
    freeMemory: os.freemem(),
    uptime: os.uptime(),
    nodeVersion: process.version,
  };
}

export function buildOsInfoDocument(snapshot: OsInfoSnapshot = getOsInfo()): RichDocument {
  const usedMemory = snapshot.totalMemory - snapshot.freeMemory;

  return doc(
    heading(1, 'Informasi OS'),
    paragraph('Detail sistem tempat bot sedang berjalan.'),
    table(
      [
        [{ content: bold('Field'), header: true }, { content: bold('Nilai'), header: true }],
        [{ content: 'OS' }, { content: marked(snapshot.platform) }],
        [{ content: 'Versi' }, { content: snapshot.release }],
        [{ content: 'Arsitektur' }, { content: snapshot.architecture }],
        [{ content: 'Hostname' }, { content: snapshot.hostname }],
        [{ content: 'CPU' }, { content: `${snapshot.cpuModel} (${snapshot.cpuCount} core)` }],
        [{ content: 'Memori' }, { content: `${formatBytes(usedMemory)} / ${formatBytes(snapshot.totalMemory)}` }],
        [{ content: 'Uptime OS' }, { content: formatDuration(snapshot.uptime) }],
        [{ content: 'Node.js' }, { content: snapshot.nodeVersion }],
      ],
      { bordered: true, compact: true },
    ),
  );
}

export async function runOsInfo(token: string, chatId: number | string) {
  return sendRich(token, chatId, buildOsInfoDocument());
}

export function buildStatusDocument(latencyMs: number): RichDocument {
  const system = getOsInfo();
  const usedMemory = system.totalMemory - system.freeMemory;

  return doc(
    heading(1, 'Status Bot'),
    paragraph('Ringkasan kesehatan bot dan sistem.'),
    table(
      [
        [{ content: bold('Metric'), header: true }, { content: bold('Nilai'), header: true }],
        [{ content: 'Status' }, { content: marked('Online') }],
        [{ content: 'Latency Telegram' }, { content: `${latencyMs} ms` }],
        [{ content: 'Uptime Bot' }, { content: formatDuration(process.uptime()) }],
        [{ content: 'Uptime OS' }, { content: formatDuration(system.uptime) }],
        [{ content: 'Memori' }, { content: `${formatBytes(usedMemory)} / ${formatBytes(system.totalMemory)}` }],
        [{ content: 'CPU' }, { content: `${system.cpuModel} (${system.cpuCount} core)` }],
        [{ content: 'Hostname' }, { content: system.hostname }],
        [{ content: 'Node.js' }, { content: system.nodeVersion }],
      ],
      { bordered: true, compact: true },
    ),
  );
}

export async function runStatus(token: string, chatId: number | string, latencyMs: number) {
  return sendRich(token, chatId, buildStatusDocument(latencyMs));
}