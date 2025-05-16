import {InferSchemaValues, defineConfig} from '@sanity-typed/types'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

const config = defineConfig({
  name: 'default',
  title: 'andysprague.me',

  projectId: 'ium7bs42',
  dataset: 'production',

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
})

export default config;

export type SanityValues = InferSchemaValues<typeof config>;