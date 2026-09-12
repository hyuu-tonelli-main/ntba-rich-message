import { doc, heading, paragraph, bold, italic, link, list, table, spoiler } from './rich';  
import type { RichDocument } from './rich';  
import { sendRich } from './ntba-adapter';  

export function buildExampleDocument(): RichDocument {  
  return doc(  

    heading(1, 'Laporan'),  
    paragraph([  
      bold('Tebal'), ' dan ', italic('miring'), ' serta ',  
      link('tautan', 'https://telegram.org'),  
    ]),  
    paragraph(['<tg-button type="url" style="succes" url="https://web.telegram.org"><b>Telegram</b></tg-button>']),
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

  

export async function runExample(token: string, chatId: number | string) {  

  const document = buildExampleDocument();  

  const res = await sendRich(token, chatId, document);  

  console.log('Pesan terkirim, message_id:', res?.result?.message_id);  

  return res;  

}