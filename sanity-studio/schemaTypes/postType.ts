
export default {
  name: 'post',
  title: 'Post',
  type: 'document',
  fields: [
    {
      name: 'title',
      type: 'string',
      validation: (rule: any) => rule.required()
    },
    {
      name: 'slug',
      type: 'slug',
      options: {source: 'title'},
      validation: (rule: any) => rule.required()
    },
    {
      name: 'publishedAt',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (rule: any) => rule.required()
    },
    {
      name: 'image',
      type: 'image',
    },
    {
      name: 'body',
      type: 'array',
      of: [{type: 'block'}],
    },
  ],
}
