"use server";

import { Client } from "@notionhq/client";

export interface PostType {
    id: string;
    title: string;
    contributor?: string;
    updated: string;
    description: string;
    resourceType: string[];
    country?: string[];
    region?: string;
    discipline?: string[];
    project?: string;
    audience: string[];
}

const notion = new Client({
    auth: process.env.NOTION_SECRET,
});

export const getProduction = async (): Promise<PostType[] | null> => {
    const databaseId = process.env.NOTION_PRODUCTION_DB;

    if(!databaseId) return console.log('Invalid Database ID');

    const response = await notion.databases.query({
        database_id: databaseId,
        filter: {
            property: "Status",
            status: {
                equals: "pending",
            }
        },
        sorts: [
        {
            property: 'Updated',
            direction: 'descending',
        },
        ],
    });
    console.log(response.results[0].properties.Region);

    const posts: PostType[] = response.results.map((result) => ({
        id: result.id,
        title: result.properties.Name.title[0].plain_text,
        contributor: result.properties.Contributor?.select,
        updated: result.properties.Updated.last_edited_time,
        description: result.properties.Description.rich_text[0].plain_text,
        resourceType: result.properties.Resource.multi_select.map((Resource) => Resource.name),
        country: result.properties.Country?.multi_select?.map((Country) => Country.name),
        region: result.properties.Region?.formula?.string,
        discipline: result.properties.Discipline?.select,
        project: result.properties.Project?.select,
        audience: result.properties.Audience.multi_select?.map((Audience) => Audience.name),
    }));

    return posts;
}

export const getPageById = async (id: string): Promise<PostType[] | null> => {
    const databaseId = process.env.NOTION_PRODUCTION_DB;

    if(!databaseId || !id) return console.log('Invalid Database or Page ID');

    const response = await notion.pages.retrieve({
        page_id: id,
    });

    return {
        id: response.id,
        title: response.properties.Name.title[0].plain_text,
        contributor: response.properties.Contributor?.select,
        updated: response.properties.Updated.last_edited_time,
        description: response.properties.Description.rich_text[0].plain_text,
        resourceType: response.properties.Resource.multi_select.map((Resource) => Resource.name),
        country: response.properties.Country?.multi_select?.map((Country) => Country.name),
        region: response.properties.Region?.formula?.string,
        discipline: response.properties.Discipline?.select,
        project: response.properties.Project?.select,
        audience: response.properties.Audience.multi_select?.map((Audience) => Audience.name),
    }
}

export const getBlocks = async (id: string): Promise<PostType[] | null> => {

    const databaseId = process.env.NOTION_PRODUCTION_DB;

    if(!databaseId || !id) return console.log('Invalid Database or Page ID');

    const { results } = await notion.blocks.children.list({
        block_id: id,
    })

    const childBlocks = results.map(async (block) => {
    if (block.has_children) {
      const children = await getBlocks(block.id);
      return { ...block, children };
    }
    return block;
  });

  return Promise.all(childBlocks).then((blocks) => blocks.reduce((acc, curr) => {
    acc.push(curr);
    return acc;
  }, []));
}
