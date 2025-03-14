"use server";

import { Client, isFullPageOrDatabase } from "@notionhq/client";
import { randomUUID } from "crypto";
import { PostType, Properties } from "@/types/types.notion";

const notion = new Client({
    auth: process.env.NOTION_SECRET,
});

const databaseId = process.env.NOTION_PRODUCTION_DB;


export const getProduction = async (): Promise<PostType[] | null> => {
    if(!databaseId) return null;

    const response = await notion.databases.query({
        database_id: databaseId!,
        filter: {
            property: "Status",
            status: {
                equals: "live",
            }
        },
        sorts: [
        {
            property: 'Updated',
            direction: 'descending',
        },
        ],
    });

    if (!response || !response?.results.length) return null;

    const posts: PostType[] = response.results
      .filter(isFullPageOrDatabase)
      .map((result) => {
        const properties = result.properties as unknown as Properties;
        const options = {month: "long" as const, day: "numeric" as const, year: "numeric" as const};
        return {
          id: result.id,
          title: properties.Name.title[0].plain_text,
          contributor: properties.Contributor?.multi_select.map((Contributor) => Contributor.name + ''),
          updated: new Date(properties.Updated.last_edited_time).toLocaleDateString("en-US", options),
          description: properties.Description.rich_text[0].plain_text,
          resourceType: properties.Resource.multi_select.map((Resource) => Resource.name + ''),
          country: properties.Country?.multi_select?.map((Country) => Country.name + ''),
          region: properties.Region?.formula?.string,
          discipline: properties.Discipline?.multi_select.map((Discipline) => Discipline.name + ''),
          project: properties.Project?.select?.name,
          audience: properties.Audience.multi_select?.map((Audience) => Audience.name + ''),
          slug: properties.Slug.formula.string,
        }
    });
    return posts;
}

export const getPageById = async (id: string): Promise<PostType[] | null> => {

    if(!databaseId || !id) return null;

    const response = await notion.pages.retrieve({
        page_id: id,
    });

    if (!response || !isFullPageOrDatabase(response)) return null;

    const properties = response.properties as unknown as Properties;
    const options = {month: "long" as const, day: "numeric" as const, year: "numeric" as const};

    return {
        id: response.id,
        title: properties.Name.title[0].plain_text,
        contributor: properties.Contributor?.multi_select?.map((Contributor) => Contributor.name + ' '),
        updated: new Date(properties.Updated.last_edited_time).toLocaleDateString("en-US", options),
        description: properties.Description.rich_text[0].plain_text,
        resourceType: properties.Resource.multi_select.map((Resource) => Resource.name + ' '),
        country: properties.Country?.multi_select?.map((Country) => Country.name + ' '),
        region: properties.Region?.formula?.string,
        discipline: properties.Discipline?.multi_select.map((Discipline) => Discipline.name + ' '),
        project: properties.Project?.select,
        audience: properties.Audience.multi_select?.map((Audience) => Audience.name + ' '),
        slug: properties.Slug.formula.string,
    }
}

export const getBlocks = async (id: string) => {

    const databaseId = process.env.NOTION_PRODUCTION_DB;

    if(!databaseId || !id) return console.log('Invalid Database or Page ID');

    const blockId = id.replaceAll('-', '');

  const { results } = await notion.blocks.children.list({
    block_id: blockId,
    page_size: 100,
  });

  // Fetches all child blocks recursively
  // be mindful of rate limits if you have large amounts of nested blocks
  // See https://developers.notion.com/docs/working-with-page-content#reading-nested-blocks
  const childBlocks = results.map(async (block) => {
    if (block.has_children) {
      const children = await getBlocks(block.id);
      return { ...block, children };
    }
    return block;
  });

  return Promise.all(childBlocks).then((blocks) => blocks.reduce((acc, curr) => {
    if (curr.type === 'bulleted_list_item') {
      if (acc[acc.length - 1]?.type === 'bulleted_list') {
        acc[acc.length - 1][acc[acc.length - 1].type].children?.push(curr);
      } else {
        acc.push({
          id: randomUUID().toString(),
          type: 'bulleted_list',
          bulleted_list: { children: [curr] },
        });
      }
    } else if (curr.type === 'numbered_list_item') {
      if (acc[acc.length - 1]?.type === 'numbered_list') {
        acc[acc.length - 1][acc[acc.length - 1].type].children?.push(curr);
      } else {
        acc.push({
          id: randomUUID().toString(),
          type: 'numbered_list',
          numbered_list: { children: [curr] },
        });
      }
    } else {
      acc.push(curr);
    }
    return acc;
  }, []));
};
