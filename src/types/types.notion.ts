export type Multi = {
  name: string;
  color: string;
}

export interface PostType {
    id: string;
    title: string;
    contributor?: string[];
    updated: string;
    description: string;
    resourceType: string[];
    country?: string[];
    region?: string;
    discipline?: string[];
    project?: string;
    audience?: string[];
    slug: string;
}

export interface Properties {
  Slug: Slug;
  Audience: Audience;
  Region: Region;
  Description: Description;
  Discipline: Discipline;
  Updated: Updated;
  Status: Status;
  Resource: Resource;
  Contributor: Contributor;
  Project: Project;
  Country: Country;
  Name: Name;
}

interface Name {
  id: string;
  type: string;
  title: Richtext[];
}

interface Project {
  id: string;
  type: string;
  select: Multiselect;
}

interface Status {
  id: string;
  type: string;
  status: Multiselect;
}

interface Updated {
  id: string;
  type: string;
  last_edited_time: string;
}

interface Discipline {
  id: string;
  type: string;
  multi_select: Multiselect[];
}

interface Region {
  id: string;
  type: string;
  formula: Formula;
}

interface Formula {
  string: string;
}

interface Resource {
  id: string;
  type: string;
  multi_select: Multiselect[];
}

interface Contributor {
  id: string;
  type: string;
  multi_select: Multiselect[];
}

interface Country {
  id: string;
  type: string;
  multi_select: Multiselect[];
}

interface Description {
  id: string;
  type: string;
  rich_text: Richtext[];
}

interface Richtext {
  type: string;
  text: Text;
  annotations: Annotations;
  plain_text: string;
  href: null;
}

interface Annotations {
  bold: boolean;
  italic: boolean;
  strikethrough: boolean;
  underline: boolean;
  code: boolean;
  color: string;
}

interface Text {
  content: string;
  link: null;
}

interface Audience {
  id: string;
  type: string;
  multi_select: Multiselect[];
}

interface Multiselect {
  id: string;
  name: string;
  color: string;
}

interface Slug {
  id: string;
  type: string;
  formula: Formula;
}

interface Formula {
  type: string;
  string: string;
}
