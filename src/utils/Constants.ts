export default {
  Success: 20000,
  Authorization: 'Authorization',
  Controls: () => {
    const controls: any[] = [
      'headings',
      'bold',
      'italic',
      'underline',
      'text-color',
      'strike-through',
      'superscript',
      'subscript',
      'remove-styles',
      'emoji',
      'text-align',
      'text-indent',
      'link',
      'list-ul',
      'list-ol',
      'blockquote',
      'code',
      'media',
      'table',
      'hr',
      'fullscreen',
    ];
    return controls;
  },
  Exclude: () => {
    const excludes: any[] = [
      'font-size',
      'font-family',
      'line-height',
      'letter-spacing',
      'clear',
      'undo',
      'redo',
    ];
    return excludes;
  },
  Upload: '/api/admin/upload',
};
