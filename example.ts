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
      { bordered: true, compact: true, caption: 'Key metrics' },  
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