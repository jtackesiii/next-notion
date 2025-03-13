import styles from '@/app/post.module.css';
import Link from 'next/link';

export default function Text({ title }) {
  if (!title) {
    return null;
  }
  return title.map((value) => {
    const {
      annotations: {
        bold, code, color, italic, strikethrough, underline,
      },
      text,
    } = value;
    if (value.type === 'text') {
    return (
      <span
        className={[
          bold ? styles.bold : '',
          code ? styles.code : '',
          italic ? styles.italic : '',
          strikethrough ? styles.strikethrough : '',
          underline ? styles.underline : '',
        ].join(' ')}
        style={color !== 'default' ? { color } : {}}
        key={text.content}
      >
        {text.link ? <a href={text.link.url}>{text.content}</a> : text.content}
      </span>
    )} else {
      return (
        <Link key={value.mention.page.id} href={`/resources/${value.mention.page.id}`}>{value.plain_text}</Link>
      )};
  });
}
