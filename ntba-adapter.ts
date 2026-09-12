import type TelegramBot from 'node-telegram-bot-api';  
import type { Message, SendMessageOptions } from 'node-telegram-bot-api';  
import { RichDocument } from './rich';  


export async function sendRich(  
  token: string,  
  chatId: number | string,  
  doc: RichDocument,  
  opts?: { skipEntityDetection?: boolean; isRtl?: boolean },  
): Promise<any> {  
  const res = await fetch(`https://api.telegram.org/bot${token}/sendRichMessage`, {  
    method: 'POST',  
    headers: { 'Content-Type': 'application/json' },  
    body: JSON.stringify({  
      chat_id: chatId,  
      rich_message: doc.toInputRichMessage({  
        isRtl: opts?.isRtl,  
        skipEntityDetection: opts?.skipEntityDetection ?? false,  
      }),  
    }),  
  });  

  const data: any = await res.json();  
  if (!res.ok || data?.ok === false) {  
    throw new Error(  
      `Telegram error ${data?.error_code ?? res.status}: ${data?.description ?? res.statusText}`,  
    );  
  }  
  return data;  
}  

export function sendRichMessage(  
  bot: TelegramBot,  
  chatId: number | string,  
  doc: RichDocument,  
  opts?: SendMessageOptions,  
): Promise<Message> {  
  const html = doc.toHTML();  
  return bot.sendMessage(chatId, html, { parse_mode: 'HTML', ...opts });  
}