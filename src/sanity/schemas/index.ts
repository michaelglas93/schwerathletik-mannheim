import type { SchemaTypeDefinition } from "sanity";

import { imageBlock, link, resultsTable } from "./blocks";
import { person } from "./person";
import { post } from "./post";
import { clubDocument, galleryImage } from "./simple";
import { siteSettings } from "./siteSettings";

export const schemaTypes: SchemaTypeDefinition[] = [
  post,
  person,
  galleryImage,
  clubDocument,
  siteSettings,
  imageBlock,
  resultsTable,
  link,
];
