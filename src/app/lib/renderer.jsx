import { Fragment } from 'react';
import Link from 'next/link';
import Text from './text';
import styles from '@/app/post.module.css';
import { randomUUID } from 'crypto';
import { Heading, Image, AspectRatio, List, Stack } from '@chakra-ui/react';

export function renderBlock(block) {
  const { type, id } = block;
  const value = block[type];

  switch (type) {
    case 'paragraph':
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
          <Heading size="3xl">
            <Text title={value.rich_text} />
          </Heading>
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
          <Heading size="2xl" key={randomUUID()}>
            <Text title={value.rich_text} />
          </Heading>
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
          <Heading size="xl">
            <Text title={value.rich_text} />
          </Heading>
      )};
    case 'bulleted_list': {
      return <List.Root>{value.children.map((child) => renderBlock(child))}</List.Root>;
    }
    case 'numbered_list': {
      return <List.Root as="ol">{value.children.map((child) => renderBlock(child))}</List.Root>;
    }
    case 'bulleted_list_item':
    case 'numbered_list_item':
      return (
        <List.Item _marker={{color: "navy"}} key={block.id}>
          <Text title={value.rich_text} />
          {/* eslint-disable-next-line no-use-before-define */}
          {!!value.children && renderNestedList(block)}
        </List.Item>
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
    // case 'image': {
    //   const src = value.type === 'external' ? value.external.url : value.file.url;
    //   const caption = value.caption ? value.caption[0]?.plain_text : '';
    //   return (
    //     <figure key={id}>
    //       <Image src={src} alt={caption} className="img-responsive" />
    //       {caption && <figcaption>{caption}</figcaption>}
    //     </figure>
    //   );
    // }
    case 'image': {
      // Use the proxy API route for Notion images
      let src = value.type === 'external' ? value.external.url : value.file.url;
      const caption = value.caption ? value.caption[0]?.plain_text : '';
      // Proxy Notion-hosted images through your API
      if (
        src.startsWith("https://www.notion-static.com/") ||
        src.startsWith("https://s3.us-west-2.amazonaws.com/secure.notion-static.com/")
      ) {
        src = `/api/notion-image?src=${encodeURIComponent(src)}`;
      }
      return (
        <figure key={id}>
          <Image src={src} alt={caption} className="img-responsive" />
          {caption && <figcaption>{caption}</figcaption>}
        </figure>
      );
    }
    case 'link_preview': {
      const src = value.url;
      console.log(src);
      return (
        <figure key={id}>
          <Image src={src} alt='' className="img-responsive" />
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
        <Stack direction={{ base: "column", md: "row" }} gap="10">
          {block.children.map((childBlock) => renderBlock(childBlock))}
        </Stack>
      );
    }
    case 'column': {
      return <div key={randomUUID()}>{block.children.map((child) => renderBlock(child))}</div>;
    }
    case 'video': {
      const src = value.external.url
      return (
        <AspectRatio>
          <iframe src={src} allowFullScreen></iframe>
        </AspectRatio>
      )
    }

    default:
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
