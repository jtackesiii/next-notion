import { Fragment } from 'react';
import Link from 'next/link';
import Text from './text';
import styles from '@/app/post.module.css';
import { randomUUID } from 'crypto';

export function renderBlock(block) {
  const { type, id } = block;
  const value = block[type];

  switch (type) {
    case 'paragraph':
      // console.log(block);
        return (
          <p key={randomUUID()}>
            <Text title={value.rich_text} />
          </p>
        );
    case 'heading_1':
      if (value.is_toggleable) {
        return (
          <details>
            <summary className="header-1">
              <Text title={value.rich_text} />
            </summary>
            {block.children?.map((child) => (
              <Fragment key={child.id}>{renderBlock(child)}</Fragment>
            ))}
          </details>
        )
      } else {
        return (
          <h1>
            <Text title={value.rich_text} />
          </h1>
      )};
    case 'heading_2':
      if (value.is_toggleable) {
        return (
          <details>
            <summary className="header-2">
              <Text title={value.rich_text} />
            </summary>
            {block.children?.map((child) => (
              <Fragment key={child.id}>{renderBlock(child)}</Fragment>
            ))}
          </details>
        )
      } else {
        return (
          <h2 key={randomUUID()}>
            <Text title={value.rich_text} />
          </h2>
      )};
    case 'heading_3':
      if (value.is_toggleable) {
        return (
          <details>
            <summary className="header-3">
              <Text title={value.rich_text} />
            </summary>
            {block.children?.map((child) => (
              <Fragment key={child.id}>{renderBlock(child)}</Fragment>
            ))}
          </details>
        )
      } else {
        return (
          <h3>
            <Text title={value.rich_text} />
          </h3>
      )};
    case 'bulleted_list': {
      return <ul>{value.children.map((child) => renderBlock(child))}</ul>;
    }
    case 'numbered_list': {
      return <ol>{value.children.map((child) => renderBlock(child))}</ol>;
    }
    case 'bulleted_list_item':
    case 'numbered_list_item':
      return (
        <li key={block.id}>
          <Text title={value.rich_text} />
          {/* eslint-disable-next-line no-use-before-define */}
          {!!value.children && renderNestedList(block)}
        </li>
      );
    case 'to_do':
      return (
        <div>
          <label htmlFor={id}>
            <input type="checkbox" id={id} defaultChecked={value.checked} />
            {' '}
            <Text title={value.rich_text} />
          </label>
        </div>
      );
    case 'toggle':
      return (
        <details>
          <summary>
            <Text title={value.rich_text} />
          </summary>
          {block.children?.map((child) => (
            <Fragment key={child.id}>{renderBlock(child)}</Fragment>
          ))}
        </details>
      );
    case 'child_page':
      return (
        <div className={styles.childPage}>
          <strong>{value?.title}</strong>
          {block.children.map((child) => renderBlock(child))}
        </div>
      );
    case 'image': {
      const src = value.type === 'external' ? value.external.url : value.file.url;
      const caption = value.caption ? value.caption[0]?.plain_text : '';
      return (
        <figure>
          <img src={src} alt={caption} />
          {caption && <figcaption>{caption}</figcaption>}
        </figure>
      );
    }
    case 'divider':
      return <hr key={id} />;
    case 'quote':
      return <blockquote key={id}>{value.rich_text[0].plain_text}</blockquote>;
    case 'code':
      return (
        <pre className={styles.pre}>
          <code className={styles.code_block} key={id}>
            {value.rich_text[0].plain_text}
          </code>
        </pre>
      );
    case 'file': {
      const srcFile = value.type === 'external' ? value.external.url : value.file.url;
      const splitSourceArray = srcFile.split('/');
      const lastElementInArray = splitSourceArray[splitSourceArray.length - 1];
      const captionFile = value.caption ? value.caption[0]?.plain_text : '';
      return (
        <figure>
          <div className={styles.file}>
            📎
            {' '}
            <Link href={srcFile} passHref>
              {lastElementInArray.split('?')[0]}
            </Link>
          </div>
          {captionFile && <figcaption>{captionFile}</figcaption>}
        </figure>
      );
    }
    case 'bookmark': {
      const href = value.url;
      return (
        <a href={href} target="_blank" rel="noreferrer noopener" className={styles.bookmark}>
          {href}
        </a>
      );
    }
    case 'table': {
      return (
        <table className={styles.table}>
          <tbody>
            {block.children?.map((child, index) => {
              const RowElement = value.has_column_header && index === 0 ? 'th' : 'td';
              return (
                <tr key={child.id}>
                  {child.table_row?.cells?.map((cell, i) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <RowElement key={`${cell.plain_text}-${i}`}>
                      <Text title={cell} />
                    </RowElement>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      );
    }
    case 'column_list': {
      return (
        <div className={styles.row}>
          {block.children.map((childBlock) => renderBlock(childBlock))}
        </div>
      );
    }
    case 'column': {
      return <div key={randomUUID()}>{block.children.map((child) => renderBlock(child))}</div>;
    }
    case 'video': {
      const src = value.external.url
      console.log(src);
      return <iframe width="640" height="360" src={src}></iframe>
    }

    default:
      console.log(block);
      return `❌ Unsupported block (${
        type === 'unsupported' ? 'unsupported by Notion API' : type
      })`;
  }
}

export function renderNestedList(blocks) {
  const { type } = blocks;
  const value = blocks[type];
  if (!value) return null;

  const isNumberedList = value.children[0].type === 'numbered_list_item';

  if (isNumberedList) {
    return <ol>{value.children.map((block) => renderBlock(block))}</ol>;
  }
  return <ul>{value.children.map((block) => renderBlock(block))}</ul>;
}
