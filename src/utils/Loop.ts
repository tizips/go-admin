const ById = (
  items: any[],
  id?: number,
  callback?: (item: any, index: number, items: any[]) => any,
  object?: string,
) => {
  for (let i = 0; i < items.length; i += 1) {
    if (items[i].id === id && items[i].object == object) {
      callback?.(items[i], i, items);
      break;
    } else if (items[i].children) ById(items[i].children, id, callback, object);
  }
};

export default { ById };
