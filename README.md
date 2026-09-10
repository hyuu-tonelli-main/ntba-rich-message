# ntba-rich-message

Platform-independent TypeScript builder for **Telegram Rich Messages** using HTML mode.

This library is compatible with **Telegram Bot API 10.2** and generates valid Telegram HTML for the [Rich Messages API](https://core.telegram.org/bots/api#rich-messages).

* Fully typed
* Zero dependencies
* Tree-shakeable
* Platform-independent
* Built for TypeScript

## Features

### Inline Formatting

Supports:

* Bold
* Italic
* Underline
* Strikethrough
* Spoiler
* Inline code
* Marked text
* Subscript
* Superscript
* Line breaks
* Unsafe raw HTML
* Links
* Anchors
* References
* Custom emoji
* Date/time
* Math

### Block Elements

Supports:

* Paragraphs
* Headings (`h1`–`h6`)
* Preformatted code blocks
* Footers
* Dividers
* Math blocks
* Anchors
* Ordered and unordered lists
* Checkboxes
* Blockquotes
* Pullquotes
* Tables
* Expandable details blocks
* Maps
* Collages
* Slideshows

### Media

Supports:

* Photos
* Videos
* Animations
* Audio
* Voice

Media blocks can optionally include:

* Spoilers
* Captions
* Credits

Media with captions and credits are rendered using `<figure>` and `<figcaption>`.

---

## Installation

```bash
npm install ntba-rich-message
```

Or with other package managers:

```bash
pnpm add ntba-rich-message
```

```bash
yarn add ntba-rich-message
```

---

## Inline Builders

| Function                    | Generated HTML               | Description                           |
| --------------------------- | ---------------------------- | ------------------------------------- |
| `bold(text)`                | `<b>…</b>`                   | Bold text                             |
| `italic(text)`              | `<i>…</i>`                   | Italic text                           |
| `underline(text)`           | `<u>…</u>`                   | Underlined text                       |
| `strikethrough(text)`       | `<s>…</s>`                   | Strikethrough text                    |
| `spoiler(text)`             | `<tg-spoiler>…</tg-spoiler>` | Spoiler text                          |
| `code(text)`                | `<code>…</code>`             | Inline code                           |
| `marked(text)`              | `<mark>…</mark>`             | Marked text                           |
| `sub(text)`                 | `<sub>…</sub>`               | Subscript                             |
| `sup(text)`                 | `<sup>…</sup>`               | Superscript                           |
| `lineBreak()`               | `<br>`                       | Line break                            |
| `unsafeRawInline(input)`    | `input`                      | Inserts trusted HTML without escaping |
| `link(text, url)`           | `<a href="…">…</a>`          | Hyperlink                             |
| `anchor(name)`              | `<a name="…"></a>`           | Named anchor                          |
| `userMention(text, userId)` | Telegram mention markup      | User mention                          |
| `customEmoji(text, id)`     | Custom emoji markup          | Custom emoji                          |
| `dateTime(...)`             | Telegram date/time markup    | Date and time                         |
| `math(...)`                 | Telegram math markup         | Inline math                           |

> **Warning:** `unsafeRawInline()` inserts its input without escaping. Only use it with trusted HTML.

---

## Block Builders

| Function                           | Generated HTML                     | Description               |
| ---------------------------------- | ---------------------------------- | ------------------------- |
| `paragraph(content)`               | `<p>…</p>`                         | Paragraph                 |
| `heading(level, content)`          | `<h1>…</h1>` … `<h6>…</h6>`        | Heading                   |
| `pre(code, language?)`             | `<pre>…</pre>`                     | Preformatted code         |
| `footer(content)`                  | `<footer>…</footer>`               | Footer                    |
| `divider()`                        | `<hr>`                             | Divider                   |
| `mathBlock(latex)`                 | `<tg-math-block>…</tg-math-block>` | Block math                |
| `anchor(name)`                     | `<a name="…"></a>`                 | Standalone anchor         |
| `blockquote(content, credit?)`     | `<blockquote>…</blockquote>`       | Blockquote                |
| `pullquote(text, credit?)`         | `<aside>…</aside>`                 | Pullquote                 |
| `list(items, options?)`            | `<ul>…</ul>` / `<ol>…</ol>`        | Ordered or unordered list |
| `details(summary, content, opts?)` | `<details>…</details>`             | Expandable content        |
| `table(rows, options?)`            | `<table>…</table>`                 | Table                     |
| `map(lat, long, zoom, opts?)`      | `<tg-map … />`                     | Map                       |

### Lists

Lists support:

* Ordered lists
* Unordered lists
* Start values
* List types
* Reversed lists
* Per-item values
* Checkboxes
* Checked state

Example:

```ts
list([
  { content: 'First item' },
  { content: 'Completed item', checkbox: true, checked: true },
  { content: 'Pending item', checkbox: true, checked: false },
]);
```

---

## Tables

Tables support:

* Header cells
* Column spanning
* Row spanning
* Horizontal alignment
* Vertical alignment
* Borders
* Stripes
* Captions

Example:

```ts
table(
  [
    [
      { content: 'Metric', header: true },
      { content: 'Value', header: true },
    ],
    [
      { content: 'Speed' },
      { content: bold('42'), align: 'right' },
    ],
    [
      { content: 'Status' },
      { content: spoiler('ready'), align: 'center' },
    ],
  ],
  {
    bordered: true,
    striped: true,
    caption: 'Key metrics',
  },
);
```

---

## Media Builders

| Function                  | Generated HTML                   | Description     |
| ------------------------- | -------------------------------- | --------------- |
| `photo(url, opts?)`       | `<img src="…">`                  | Photo           |
| `video(url, opts?)`       | `<video src="…">`                | Video           |
| `animation(url, opts?)`   | `<video src="…">`                | Animation       |
| `audio(url, opts?)`       | `<audio src="…">`                | Audio           |
| `voice(url, opts?)`       | `<audio src="…">`                | Voice           |
| `collage(items, opts?)`   | `<tg-collage>…</tg-collage>`     | Media collage   |
| `slideshow(items, opts?)` | `<tg-slideshow>…</tg-slideshow>` | Media slideshow |

Media options can include:

```ts
type MediaOptions = {
  spoiler?: boolean;
  caption?: string;
  credit?: string;
};
```

For example:

```ts
photo('https://example.com/chart.jpg', {
  caption: 'Revenue chart',
  credit: 'Finance department',
  spoiler: false,
});
```

`animation()` renders as `<video>` and `voice()` renders as `<audio>`. Telegram determines the actual media type from the URL and/or MIME type.

Recommended formats:

* Animation: `.gif` or `.mp4`
* Voice: `.ogg`

---

## RichDocument

```ts
class RichDocument {
  constructor(blocks: BlockNode[]);

  get blocks(): readonly BlockNode[];

  toHTML(): string;

  validate(): this;

  toInputRichMessage(
    opts?: DocumentOptions,
  ): InputRichMessage;
}
```

### DocumentOptions

```ts
type DocumentOptions = {
  isRtl?: boolean;
  skipEntityDetection?: boolean;
};
```

### `doc()`

The `doc()` helper creates a `RichDocument`.

It accepts a flat list of blocks or nested arrays of blocks.

```ts
const message = doc(
  heading(1, 'Hello'),
  paragraph('Welcome to ntba-rich-message'),
  divider(),
  paragraph('This is a Telegram Rich Message.'),
);
```

---

## `fmtRich` Tagged Template

`fmtRich` provides a convenient template-literal API.

```ts
const message = fmtRich`
  ${heading(1, 'Quarterly Report')}

  ${paragraph([
    bold('Team'),
    ' achieved ',
    italic('record'),
    ' growth.',
  ])}

  ${divider()}

  ${paragraph('Thank you!')}
`;
```

`fmtRich`:

* Automatically wraps inline sequences into paragraphs
* Collapses multiple spaces and newlines into a single space inside paragraphs
* Ignores `null`
* Ignores `undefined`
* Ignores `false`
* Accepts `RichDocument` instances and merges their blocks

```ts
type FmtValue =
  | Inline
  | BlockContent
  | RichDocument
  | null
  | undefined
  | false;

function fmtRich(
  strings: TemplateStringsArray,
  ...values: FmtValue[]
): RichDocument;
```

---

## Complete Example

```ts
import {
  doc,
  heading,
  paragraph,
  bold,
  italic,
  code,
  list,
  blockquote,
  divider,
  photo,
  table,
  link,
  spoiler,
  userMention,
} from 'ntba-rich-message';

const message = doc(
  heading(1, 'Quarterly Report'),

  paragraph([
    bold('Team'),
    ' achieved ',
    italic('record'),
    ' growth.',
  ]),

  divider(),

  heading(2, 'Highlights'),

  list([
    {
      content: 'Revenue +20%',
      checkbox: true,
      checked: true,
    },
    {
      content: code('New product launch'),
      checkbox: false,
    },
    {
      content: 'Opened 3 new markets',
    },
  ]),

  blockquote(
    [
      paragraph('The best quarter ever.'),
      paragraph(
        'Special thanks to the engineering team.',
      ),
    ],
    'CEO',
  ),

  heading(2, 'Visuals'),

  photo('https://example.com/chart.jpg', {
    caption: 'Revenue chart',
    credit: 'Finance department',
    spoiler: false,
  }),

  heading(2, 'Metrics'),

  table(
    [
      [
        { content: 'Metric', header: true },
        { content: 'Value', header: true },
      ],
      [
        { content: 'Speed' },
        {
          content: bold('42'),
          align: 'right',
        },
      ],
      [
        { content: 'Status' },
        {
          content: spoiler('ready'),
          align: 'center',
        },
      ],
    ],
    {
      bordered: true,
      striped: true,
      caption: 'Key metrics',
    },
  ),

  paragraph([
    'Visit ',
    link(
      'our website',
      'https://example.com',
    ),
    ' or mention ',
    userMention('@admin', 123456789),
  ]),
);

console.log(message.toHTML());
```

---

## Generated HTML

The document can be converted to Telegram-compatible HTML using:

```ts
const html = message.toHTML();

console.log(html);
```

The resulting HTML can then be inspected, logged, stored, or sent to your Telegram integration.

---

## Validation

Call `validate()` before sending a document if you want to explicitly check the configured limits.

```ts
message.validate();
```

`validate()` returns the same document instance when validation succeeds.

If validation fails, a `TgRichError` is thrown.

### Validation Limits

| Limit             |                 Maximum |
| ----------------- | ----------------------: |
| Total text        | 32,768 UTF-8 characters |
| Media attachments |                      50 |
| Blocks            |                     500 |
| Nesting depth     |                      16 |

The text limit is measured approximately after stripping tags/entities and is counted as Unicode code points.

Blocks include nested blocks, list items, and table rows.

---

## Error Handling

Invalid input throws `TgRichError`.

Examples include:

* Heading level outside `1`–`6`
* Too many table columns
* Invalid map zoom
* Exceeding document limits
* Invalid builder options

Example:

```ts
import {
  heading,
  TgRichError,
} from 'ntba-rich-message';

try {
  const message = heading(7, 'Invalid heading');

  message.validate();
} catch (error) {
  if (error instanceof TgRichError) {
    console.error(error.message);
  }
}
```

---

## Escaping

The library automatically escapes text where required.

You can also use the exported helper:

```ts
import { escapeText } from 'ntba-rich-message';

const escaped = escapeText(
  `Hello <world> & "friends"`
);
```

`escapeText()` escapes:

* `&`
* `<`
* `>`
* `"`
* `'`

### Unsafe Raw HTML

Use `unsafeRawInline()` only when the HTML is trusted.

```ts
import { unsafeRawInline } from 'ntba-rich-message';

const trusted = unsafeRawInline(
  '<b>Trusted HTML</b>',
);
```

The input is inserted as-is and **is not escaped**.

> Never pass untrusted user input directly to `unsafeRawInline()`.

---

## Using with Telegram Bot API

After generating your rich message, send the resulting `InputRichMessage` through the appropriate Telegram API integration.

Example using `fetch`:

```ts
const input = message.toInputRichMessage({
  skipEntityDetection: false,
});

await fetch(
  `https://api.telegram.org/bot${TOKEN}/sendRichMessage`,
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      rich_message: input,
    }),
  },
);
```

For the official Telegram Bot API documentation, see:

https://core.telegram.org/bots/api

For Rich Messages documentation, see:

https://core.telegram.org/bots/api#rich-messages

---

## TypeScript Configuration

The library is written in TypeScript and ships with type declarations.

No additional TypeScript configuration is required for normal usage.

Example:

```ts
import {
  doc,
  paragraph,
  bold,
} from 'ntba-rich-message';

const message = doc(
  paragraph([
    bold('Hello'),
    ' from TypeScript!',
  ]),
);
```

---

## Tree Shaking

The package is designed to be tree-shakeable.

Import only the builders you need:

```ts
import {
  doc,
  paragraph,
  bold,
} from 'ntba-rich-message';
```

This allows modern bundlers to remove unused exports from the final bundle.

---

## Zero Dependencies

`ntba-rich-message` has **zero runtime dependencies**.

It relies only on the JavaScript/TypeScript runtime and the Telegram Rich Messages format.

---

## API Overview

### Documents

```ts
doc(...)
fmtRich`...`
new RichDocument(...)
```

### Inline

```ts
bold(...)
italic(...)
underline(...)
strikethrough(...)
spoiler(...)
code(...)
marked(...)
sub(...)
sup(...)
lineBreak(...)
unsafeRawInline(...)
link(...)
anchor(...)
userMention(...)
customEmoji(...)
dateTime(...)
math(...)
```

### Blocks

```ts
paragraph(...)
heading(...)
pre(...)
footer(...)
divider(...)
mathBlock(...)
blockquote(...)
pullquote(...)
list(...)
details(...)
table(...)
map(...)
```

### Media

```ts
photo(...)
video(...)
animation(...)
audio(...)
voice(...)
collage(...)
slideshow(...)
```

### Utilities

```ts
escapeText(...)
```

---

## Roadmap

* [ ] Add `<tg-thinking>` support for draft messages
* [ ] Expand builder coverage as the Telegram Rich Messages API evolves
* [ ] Add more advanced document composition helpers
* [ ] Improve validation diagnostics

---

## Contributing

Pull requests are welcome!

Before submitting a pull request, please make sure that:

1. TypeScript builds successfully.
2. Existing tests pass.
3. New functionality includes appropriate tests.
4. Public APIs are fully typed.
5. Documentation is updated when the public API changes.

---

## License

See the `LICENSE` file for licensing information.

---

## Links

* [Telegram Bot API](https://core.telegram.org/bots/api)
* [Telegram Rich Messages](https://core.telegram.org/bots/api#rich-messages)

---

⭐ **Like this project? Give it a star on GitHub — it helps others discover `ntba-rich-message`!**
